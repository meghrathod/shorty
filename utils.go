package main

import (
	"database/sql"
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"os"
	"regexp"
	"time"
)

type shortURL struct {
	ShortURL    string    `json:"shortURL"`
	Url         string    `json:"url"`
	DateCreated time.Time `json:"dateCreated"`
	Pin         string    `json:"pin"`
}

type shortURLResponse struct {
	ShortURL string `json:"shortURL"`
	LongURL  string `json:"url"`
}

type searchURLRequest struct {
	ShortURL   string    `json:"url"`
	AccessTime time.Time `json:"accessTime"`
	UserAgent  string    `json:"userAgent"`
	IpAddress  string    `json:"ipAddress"`
	Location   string    `json:"location"`
	Country    string    `json:"country"`
}

type analyticsResponse struct {
	UrlDetails shortURL           `json:"urlDetails"`
	Analytics  []searchURLRequest `json:"analytics"`
}

func initDB() *sql.DB {
	connStr := fmt.Sprintf(
		"user=%s dbname=%s password=%s sslmode=disable host=%s port=%s",
		os.Getenv("USERNAME"),
		os.Getenv("DB_NAME"),
		os.Getenv("PASSWORD"),
		os.Getenv("DB_HOST"),
		os.Getenv("DB_PORT"),
	)
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}
	return db
}

func createURL(url string, db *sql.DB) shortURL {
	return shortURL{
		ShortURL:    generateKey(db),
		Url:         url,
		DateCreated: time.Now(),
		Pin:         generatePin(),
	}
}

func generateKey(db *sql.DB) string {
	prohibited := map[string]bool{"new": true, "delete": true}
	chars := "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
	key := ""

	for {
		for i := 0; i < 6; i++ {
			key += string(chars[rand.Intn(len(chars))])
		}
		if prohibited[key] {
			continue
		}
		stmt, err := db.Prepare("SELECT count(name) FROM urls where name = $1")
		if err != nil {
			log.Fatal(err)
		}
		row := stmt.QueryRow(key)
		var count int
		err = row.Scan(&count)
		if err != nil {
			log.Fatal(err)
		}
		if count == 0 {
			return key
		}
	}
}

func generatePin() string {
	chars := "1234567890"
	pin := ""
	for i := 0; i < 6; i++ {
		pin += string(chars[rand.Intn(len(chars))])
	}
	return pin
}

func checkURLValid(url string) (bool, error) {
	correctRegex := "[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)"

	val, err := regexp.MatchString(correctRegex, url)
	if err != nil {
		return false, fmt.Errorf("error matching url: %v", err)
	}
	get, err := http.Get(url)
	if err != nil {
		return false, fmt.Errorf("error making get request: %v", err)
	}
	if get.StatusCode >= 400 {
		return false, fmt.Errorf("url is not valid")
	}
	return val, nil
}

func enableCors(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Get allowed origin from environment variable
		allowedOrigin := os.Getenv("ALLOWED_ORIGIN")
		if allowedOrigin == "" {
			allowedOrigin = "http://localhost:5173" // Default for development
		}

		//Dynamically match the request's Origin with the configured allowed origin
		origin := r.Header.Get("Origin")
		if origin == allowedOrigin {
			w.Header().Set("Access-Control-Allow-Origin", "*")
		} else {
			// If CORS origin doesn't match allowedOrigin, reject the request
			http.Error(w, "CORS policy: Origin not allowed", http.StatusForbidden)
			return
		}

		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		w.Header().Set("Access-Control-Allow-Credentials", "true") // Support credentials if needed

		// Handle preflight OPTIONS requests
		if r.Method == http.MethodOptions {
			// Preflight requests need to respond early with headers and status 204
			w.WriteHeader(http.StatusNoContent)
			return
		}

		// For other requests, proceed to the actual handler
		next(w, r)
	}
}
