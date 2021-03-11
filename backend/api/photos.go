package api

import (
	"encoding/json"
	"go.uber.org/zap"
	"io/ioutil"
	"net/http"
	"segmed-backend/models"
)

func (t handlers) getPhotos(w http.ResponseWriter, r *http.Request) {

	// FIXME: in real life, pull this from a database
	data, err := ioutil.ReadFile("_json/photos.json")
	if err != nil {
		t.logger.Error("get photos failed", zap.Error(err), zap.String("detail", "failed to read photos"))
		writeResponse(w, errMsg("get photos failed"))
		return
	}
	photos := make([]models.Photo, 0)
	err = json.Unmarshal(data, &photos)
	if err != nil {
		t.logger.Error("get photos failed", zap.Error(err), zap.String("detail", "failed to read photos"))
		writeResponse(w, errMsg("get photos failed"))
		return
	}
	response, err := json.Marshal(map[string]interface{}{photosKey: photos, successKey: true})
	if err != nil {
		t.logger.Error("get photos failed", zap.Error(err), zap.String("detail", "failed to serialize response"))
		writeResponse(w, errMsg("get photos failed"))
		return
	}

	writeResponse(w, response)
}
