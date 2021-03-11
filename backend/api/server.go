package api

import (
	"context"
	"encoding/json"
	"github.com/gorilla/mux"
	"github.com/peterbourgon/diskv"
	"go.uber.org/zap"
	"net/http"
	"regexp"
	"segmed-backend/models"
	"strings"
)

func New(store *diskv.Diskv, logger *zap.Logger) http.Handler {
	s := handlers{
		store:  store,
		logger: logger,
	}

	r := mux.NewRouter()
	r.HandleFunc("/health", s.health).Methods("GET")

	r.HandleFunc("/session", s.login).Methods("POST")
	r.HandleFunc("/session", s.logout).Methods("DELETE")

	r.HandleFunc("/tags", s.getTags).Methods("GET")
	r.HandleFunc("/tag", s.postTag).Methods("POST")
	r.HandleFunc("/tag/{id}", s.deleteTag).Methods("DELETE")

	r.HandleFunc("/photos", s.getPhotos).Methods("GET")

	paths := make(map[string]bool)
	r.Walk(func(route *mux.Route, router *mux.Router, ancestors []*mux.Route) error {
		templ, err := route.GetPathTemplate()
		if err != nil {
			return err
		}
		paths[templ] = true
		return nil
	})

	// add OPTIONS handlers
	r.HandleFunc("/", s.options).Methods("OPTIONS")
	for name, _ := range paths {
		if name != "/health" {
			r.HandleFunc(name, s.options).Methods("OPTIONS")
		}
	}

	// install middlewares
	r.Use(s.logging)
	r.Use(s.authorize)

	return r
}

func (t handlers) health(w http.ResponseWriter, _ *http.Request) {
	ch := t.store.KeysPrefix("session:", nil)
	for key := range ch {
		t.logger.Info("key", zap.String("key", key))
	}
	response, _ := json.Marshal(map[string]interface{}{successKey: true})
	writeResponse(w, response)
}

func (t handlers) options(w http.ResponseWriter, r *http.Request) {
	w.Header().Add("Content-Type", "application/json")
	w.Header().Add("Access-Control-Allow-Origin", "*")
	w.Header().Add("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS")
	w.Header().Add("Access-Control-Allow-Headers", "*")
}

func writeResponse(w http.ResponseWriter, message []byte) {
	w.Header().Add("Content-Type", "application/json")
	w.Header().Add("Access-Control-Allow-Origin", "*")
	w.Header().Add("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS")
	w.Header().Add("Access-Control-Allow-Headers", "*")

	w.WriteHeader(http.StatusOK)
	_, _ = w.Write(message)
}

func sendHttpError(w http.ResponseWriter, error string, code int) {
	w.Header().Add("Content-Type", "application/json")
	w.Header().Add("Access-Control-Allow-Origin", "*")
	w.Header().Add("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS")
	w.Header().Add("Access-Control-Allow-Headers", "*")
	http.Error(w, error, code)
}

func errMsg(msg string) []byte {
	h := models.HttpError{
		ErrorMessage: msg,
		Success:      false,
	}
	b, _ := json.Marshal(&h)
	return b
}

// logging middleware
func (t handlers) logging(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		t.logger.Info("request", zap.String("method", r.Method), zap.String("path", r.URL.Path))
		next.ServeHTTP(w, r)
	})
}

var (
	authHeaderRegex = regexp.MustCompile("Bearer (.*)")
)

// auth middleware
func (t *handlers) authorize(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if authRequired(r) {
			reqToken := r.Header.Get("Authorization")
			rs := authHeaderRegex.FindStringSubmatch(reqToken)
			if len(rs) != 2 {
				sendHttpError(w, "authentication failed", http.StatusUnauthorized)
				return
			}

			bearerToken := rs[1]
			userId, err := t.store.Read("session:" + bearerToken)
			if err != nil {
				sendHttpError(w, "authentication failed", http.StatusUnauthorized)
			} else {
				t.logger.Info("user authenticated", zap.String("userId", string(userId)))
				r = r.WithContext(context.WithValue(r.Context(), sessionKey, string(userId)))
				next.ServeHTTP(w, r)
			}
		} else {
			next.ServeHTTP(w, r)
		}
	})
}

func authRequired(r *http.Request) bool {
	path := r.URL.Path

	switch {
	case r.Method == "OPTIONS":
		return false
	case path == "/health" || path == "/session":
		return false
	}
	return true
}

const validUsername = "abcdefghijklmnopqrstuvwxyz0123456789"

func isUsernameValid(s string) bool {
	for _, char := range s {
		if !strings.Contains(validUsername, strings.ToLower(string(char))) {
			return false
		}
	}
	return true
}
