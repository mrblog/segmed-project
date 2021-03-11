package api

import (
	"github.com/peterbourgon/diskv"
	"go.uber.org/zap"
)

type handlers struct {
	store  *diskv.Diskv
	logger *zap.Logger
}
