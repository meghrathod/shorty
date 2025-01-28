package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"strings"
)

func handleURL(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	if r.URL.Path == "/new" {
		handleNewURL(w, r, db)
		return
	} else if r.URL.Path == "/delete" {
		handleDeleteURL(w, r, db)
		return
	} else {
		searchAndRedirect(w, r, db)
		return
	}

}

func searchAndRedirect(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	if r.Method != "GET" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	name := r.URL.Path[1:]
	stmt, err := db.Prepare("SELECT * FROM urls WHERE name = $1")
	if err != nil {
		http.Error(w, "Error selecting from database", http.StatusInternalServerError)
		return
	}
	var url shortURL
	err = stmt.QueryRow(name).Scan(&url.ShortURL, &url.Url, &url.DateCreated, &url.Pin)
	if err != nil {
		http.Error(w, "URL not found", http.StatusNotFound)
	}
	http.Redirect(w, r, url.Url, http.StatusPermanentRedirect)

}

func handleNewURL(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	if err := r.ParseForm(); err != nil {
		fmt.Println(err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	res := flattenForm(r.Form)
	if res["url"] == "" {
		http.Error(w, "url is required", http.StatusBadRequest)
		return
	}
	url := res["url"]
	if strings.HasPrefix(url, "https://") == false && strings.HasPrefix(url, "http://") == false {
		url = "http://" + url
	}

	_, err := checkURLValid(url)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	newURL := createURL(url, db)

	stmt, err := db.Prepare("INSERT INTO urls (name, redirect_url, date_created, pin) VALUES ($1, $2, $3, $4)")
	if err != nil {
		http.Error(w, "Error inserting into database", http.StatusInternalServerError)
		return
	}
	_, err = stmt.Exec(newURL.ShortURL, newURL.Url, newURL.DateCreated, newURL.Pin)
	if err != nil {
		http.Error(w, "Error inserting into database", http.StatusInternalServerError)
		return
	}

	jsonUrl, err := json.Marshal(newURL)
	if err != nil {
		http.Error(w, "Error generating JSON", http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	_, err = w.Write(jsonUrl)
	if err != nil {
		log.Fatal(err)
	}
}

func handleDeleteURL(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	if r.Method != "DELETE" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	if err := r.ParseForm(); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	res := flattenForm(r.Form)
	if res["pin"] == "" {
		http.Error(w, "Pin is required", http.StatusBadRequest)
	}
	pin, err := strconv.Atoi(res["pin"])
	name := res["url"]
	stmt, err := db.Prepare("SELECT * FROM urls WHERE name = $1 and pin = $2")
	if err != nil {
		http.Error(w, "Error selecting from database", http.StatusInternalServerError)
		return
	}
	row := stmt.QueryRow(name, pin)

	var url shortURL
	if row == nil {
		http.Error(w, "URL not found", http.StatusNotFound)
		return
	}
	err = row.Scan(&url.ShortURL, &url.Url, &url.DateCreated, &url.Pin)
	if err != nil {
		http.Error(w, "Error selecting from database", http.StatusInternalServerError)
		return
	}
	stmt, err = db.Prepare("DELETE FROM urls WHERE name = $1 and pin = $2")
	if err != nil {
		http.Error(w, "Error deleting from database", http.StatusInternalServerError)
		return
	}
	_, err = stmt.Exec(name, pin)
	if err != nil {
		http.Error(w, "Error deleting from database", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
	return

}
