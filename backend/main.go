package main

import (
	"flag"
	"fmt"
	"github.com/peterbourgon/diskv"
	"github.com/spf13/viper"
	"go.uber.org/zap"
	"net/http"
	"os"
	"segmed-backend/api"
)

func main() {
	configFile := flag.String("config", "config.json", "Configuration file")

	var err error

	// logging domain
	var parentLogger *zap.Logger
	{
		parentLogger, err = zap.NewProduction()
		if err != nil {
			fmt.Printf("Cannot acquire parentLogger: %v\n", err)
			os.Exit(1)
		}

	}
	// configuration domain
	{
		// set defaults
		// precedence rules: https://github.com/spf13/viper#why-viper
		viper.SetConfigFile(*configFile)
		viper.SetEnvPrefix("SMED")
		viper.AutomaticEnv()
		viper.SetDefault(ServerPort, 5000)
		viper.SetDefault(MaxRequestsSec, 1)
	}

	// Simplest transform function: put all the data files into the base dir.
	flatTransform := func(s string) []string { return []string{} }

	// Initialize a new diskv store, rooted at "my-data-dir", with a 1MB cache.
	store := diskv.New(diskv.Options{
		BasePath:     "_data",
		Transform:    flatTransform,
		CacheSizeMax: 1024 * 1024,
	})

	handler := api.New(
		store,
		parentLogger.With(zap.String("component", "http")),
	)
	parentLogger.Info("HTTP API Server starting", zap.Int("port", viper.GetInt(ServerPort)))
	if err := http.ListenAndServe(fmt.Sprintf(":%d", viper.GetInt(ServerPort)), handler); err != nil {
		parentLogger.Fatal("ListenAndServe", zap.Error(err))
	}
}
