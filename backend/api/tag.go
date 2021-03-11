package api

import (
	"encoding/json"
	"github.com/gorilla/mux"
	"go.uber.org/zap"
	"net/http"
	"segmed-backend/models"
	"strings"
)

func (t handlers) getTags(w http.ResponseWriter, r *http.Request) {
	username := r.Context().Value(sessionKey).(string)

	tags := make([]models.Tag, 0)
	keys := t.store.KeysPrefix("tag:"+username+":", nil)
	for key := range keys {
		t.logger.Info("found key", zap.String("key", key))
		s := strings.Split(key, ":")
		if len(s) != 3 {
			t.logger.Error("get tags failed", zap.String("detail", "unexpected key"),
				zap.String("key", key))
			writeResponse(w, errMsg("get tags failed"))
			return
		}
		b, err := t.store.Read(key)
		if err != nil {
			t.logger.Error("get tags failed", zap.Error(err), zap.String("detail", "failed to read tag"))
			writeResponse(w, errMsg("get tags failed"))
			return
		}
		tag := models.Tag{
			PhotoId: s[2],
			Tag:     b[0] != 0x0,
		}
		tags = append(tags, tag)
	}
	response, err := json.Marshal(map[string]interface{}{tagsKey: tags, successKey: true})
	if err != nil {
		t.logger.Error("get tags failed", zap.Error(err), zap.String("detail", "failed to serialize response"))
		writeResponse(w, errMsg("get tags failed"))
		return
	}

	writeResponse(w, response)
}

func (t handlers) postTag(w http.ResponseWriter, r *http.Request) {
	username := r.Context().Value(sessionKey).(string)

	tagParams := models.Tag{}
	{
		err := json.NewDecoder(r.Body).Decode(&tagParams)
		if err != nil {
			t.logger.Error("post tag failed", zap.Error(err), zap.String("detail", "failed to deserialize tag"))
			writeResponse(w, errMsg("post tag failed"))
			return
		}
		defer func() {
			_ = r.Body.Close()
		}()
	}

	if len(tagParams.PhotoId) == 0 {
		t.logger.Error("post tag failed", zap.String("detail", "invalid photo id"),
			zap.String("photoId", tagParams.PhotoId))
		writeResponse(w, errMsg("post tag failed"))
		return

	}

	key := "tag:" + username + ":" + tagParams.PhotoId

	b := make([]byte, 1)
	if tagParams.Tag {
		b[0] = 0x1
	} else {
		b[0] = 0x0
	}

	err := t.store.Write(key, b)
	if err != nil {
		t.logger.Error("post tag failed", zap.Error(err), zap.String("detail", "failed to write tag"))
		writeResponse(w, errMsg("delete tag  failed"))
		return
	}
	response, err := json.Marshal(map[string]interface{}{successKey: true})
	if err != nil {
		t.logger.Error("post tag failed", zap.Error(err), zap.String("detail", "failed to serialize delete-tag result"))
		writeResponse(w, errMsg("post tag failed"))
		return
	}

	writeResponse(w, response)

}

func (t handlers) deleteTag(w http.ResponseWriter, r *http.Request) {
	username := r.Context().Value(sessionKey).(string)

	params := mux.Vars(r)
	id := params["id"]

	key := "tag:" + username + ":" + id

	err := t.store.Erase(key)

	if err != nil {
		t.logger.Error("delete tag  failed", zap.Error(err), zap.String("detail", "failed to delete tag"))
		writeResponse(w, errMsg("delete tag  failed"))
		return
	}
	response, err := json.Marshal(map[string]interface{}{successKey: true})
	if err != nil {
		t.logger.Error("logout failed", zap.Error(err), zap.String("detail", "failed to serialize delete-session result"))
		writeResponse(w, errMsg("logout failed"))
		return
	}

	writeResponse(w, response)

}
