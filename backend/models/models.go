package models

type Photo struct {
	PhotoId string `json:"photoId"`
	Title   string `json:"title"`
	Url     string `json:"url"`
}

type Tag struct {
	PhotoId string `json:"photoId"`
	Tag     bool   `json:"tag"`
}

type AuthParams struct {
	Username string `json:"username"`
}

type AuthToken struct {
	Token string `json:"token"`
}

type HttpError struct {
	ErrorMessage string `json:"errorMessage"`
	Success      bool   `json:"success"`
}
