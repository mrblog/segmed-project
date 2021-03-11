SHELL:=/bin/bash
NAME:=segmed-backend
VERSION ?= $(shell cat VERSION.txt)
COMMIT_ID:=$(shell git rev-parse --short HEAD)
DATE:=$(shell date +"%e%b%Y %H:%M%p %Z")
SDK:=$(shell go version)
LD_FLAGS:= -X 'segmed-backend/version.BuildVersion=v$(VERSION), commitID: $(COMMIT_ID), build date: $(DATE), SDK: $(SDK)'

.PHONY: build
build:
	mkdir -p _build/
	go fmt ./...
	go build -ldflags "$(LD_FLAGS)" -o _build/${NAME}

.PHONY: run
run: build
	./_build/${NAME}
