package main

import (
	"database/sql"
	"encoding/json"
	"errors"
	"log"
	"net/http"
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
		//searchAndRedirect(w, r, db)
		return
	}

}

func handleNewURL(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	if err := r.ParseForm(); err != nil {
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
	pin := res["pin"]
	name := res["name"]
	stmt, err := db.Prepare("SELECT * FROM urls WHERE name = $1")
	if err != nil {
		http.Error(w, "Error selecting from database", http.StatusInternalServerError)
		return
	}
	rows, err := stmt.Query(name)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			http.Error(w, "URL not found", http.StatusNotFound)
			return
		}
		http.Error(w, "Error selecting from database", http.StatusInternalServerError)
	}
	var url shortURL
	if rows == nil {
		http.Error(w, "URL not found", http.StatusNotFound)
		return
	}
	for rows.Next() {
		err = rows.Scan(&url.ShortURL, &url.Url, &url.DateCreated, &url.Pin)
		if err != nil {
			http.Error(w, "Error scanning from database", http.StatusInternalServerError)
			return
		}
		if url.Pin == pin {
			stmt, err := db.Prepare("DELETE FROM urls WHERE name = $1 AND pin = $2")
			if err != nil {
				http.Error(w, "Error deleting from database", http.StatusInternalServerError)
				return
			}
			_, err = stmt.Exec(url.ShortURL, pin)
			w.WriteHeader(http.StatusOK)
			return
		}
	}
	http.Error(w, "Invalid pin", http.StatusBadRequest)

}
