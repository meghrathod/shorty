package main

import (
	"fmt"
	"log"
	"net/http"
	"regexp"
	"time"
)

type shortURL struct {
	key         string
	url         string
	dateCreated time.Time
	pin         string
}

func createURL(url string) shortURL {
	newURL := shortURL{
		key:         generateKey(),
		url:         url,
		dateCreated: time.Now(),
		pin:         "1234",
	}
	return newURL
}

func handleURL(w http.ResponseWriter, r *http.Request) {
	if err := r.ParseForm(); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
	}
	res := flattenForm(r.Form)
	if res["url"] == "" {
		http.Error(w, "url is required", http.StatusBadRequest)
	}
	_, err := checkURLValid(res["url"])
	if err != nil {
		http.Error(w, "url is invalid or unreachable", http.StatusBadRequest)
	}
	newURL := createURL(res["url"])

	w.Write([]byte(newURL.key))
}

func checkURLValid(url string) (bool, error) {
	correctRegex := "[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)"

	val, err := regexp.MatchString(correctRegex, url)
	if err != nil {
		return false, fmt.Errorf("error matching url: %v", err)
	}
	// make a get request to the url and check if the response status is 100
	get, err := http.Get(url)
	if err != nil {
		return false, fmt.Errorf("error making get request: %v", err)
	}
	if get.StatusCode >= 400 {
		return false, fmt.Errorf("url is not valid")
	}
	return val, nil
}

func main() {
	fmt.Println("Starting server...")
	http.HandleFunc("/url", handleURL)
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatal(err)
	}
}
