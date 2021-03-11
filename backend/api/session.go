package api

import (
	"encoding/json"
	"github.com/google/uuid"
	"go.uber.org/zap"
	"net/http"
	"segmed-backend/models"
	"strings"
)

func (t handlers) login(w http.ResponseWriter, r *http.Request) {
	loginParams := models.AuthParams{}
	{
		err := json.NewDecoder(r.Body).Decode(&loginParams)
		if err != nil {
			t.logger.Error("login failed", zap.Error(err), zap.String("detail", "failed to deserialize user"))
			writeResponse(w, errMsg("login failed"))
			return
		}
		defer func() {
			_ = r.Body.Close()
		}()
	}
	if !isUsernameValid(loginParams.Username) {
		t.logger.Error("login failed", zap.String("username", loginParams.Username),
			zap.String("detail", "invalid username"))
		writeResponse(w, errMsg("login failed"))
		return
	}

	//FIXME In a real app we would validate user with a password or otherwise here

	sessionId := uuid.New().String()

	err := t.store.Write("session:"+sessionId, []byte(strings.ToLower(loginParams.Username)))
	if err != nil {
		t.logger.Error("login failed", zap.Error(err), zap.String("detail", "failed to write session"))
		writeResponse(w, errMsg("login failed"))
		return
	}

	response, err := json.Marshal(map[string]interface{}{sessionKey: models.AuthToken{Token: sessionId}, successKey: true})
	if err != nil {
		t.logger.Error("login failed", zap.Error(err), zap.String("detail", "failed to serialize create-session result"))
		writeResponse(w, errMsg("login failed"))
		return
	}

	writeResponse(w, response)

	t.logger.Info("successful login", zap.String("username", loginParams.Username))
}

func (t handlers) logout(w http.ResponseWriter, r *http.Request) {
	username := r.Context().Value(sessionKey).(string)

	reqToken := r.Header.Get("Authorization")
	rs := authHeaderRegex.FindStringSubmatch(reqToken)
	if len(rs) != 2 {
		sendHttpError(w, "authentication failed", http.StatusUnauthorized)
		return
	}

	bearerToken := rs[1]
	_ = t.store.Erase("session:" + bearerToken)
	response, err := json.Marshal(map[string]interface{}{successKey: true})
	if err != nil {
		t.logger.Error("logout failed", zap.Error(err), zap.String("detail", "failed to serialize delete-session result"))
		writeResponse(w, errMsg("logout failed"))
		return
	}

	writeResponse(w, response)

	t.logger.Info("user logged out", zap.String("username", username))
}
