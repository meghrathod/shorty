package main

import (
	"database/sql"
	"fmt"
	"github.com/oschwald/geoip2-golang"
	"log"
	"math/rand"
	"net"
	"net/http"
	"net/url"
	"os"
	"strings"
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
		DateCreated: time.Now().UTC(),
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

func checkURLValid(givenURL string) (bool, error) {
	// Parse URL to check if it's valid
	_, err := url.ParseRequestURI(givenURL)
	if err != nil {
		return false, fmt.Errorf("invalid URL format: %v", err)
	}

	// Create an HTTP client with timeout
	//client := &http.Client{
	//	Timeout: 5 * time.Second,
	//}

	// Create a new request with a User-Agent to bypass bot restrictions
	//req, err := http.NewRequest("GET", parsedURL.String(), nil)
	//if err != nil {
	//	return false, fmt.Errorf("error creating request: %v", err)
	//}

	// Mimic a browser to avoid LinkedIn's 999 error
	//req.Header.Set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
	//
	//resp, err := client.Do(req)
	//if err != nil {
	//	return false, fmt.Errorf("error making GET request: %v", err)
	//}
	//defer func(Body io.ReadCloser) {
	//	err := Body.Close()
	//	if err != nil {
	//		log.Fatal(err)
	//	}
	//}(resp.Body)
	//
	//// Check for HTTP errors
	//if resp.StatusCode >= 400 {
	//	return false, fmt.Errorf("URL returned status code %d", resp.StatusCode)
	//}

	return true, nil
}

func enableCors(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Get allowed origin from environment variable
		allowedOrigin := os.Getenv("ALLOWED_ORIGIN")
		if allowedOrigin == "" {
			allowedOrigin = "http://localhost:5173"
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

func getIP(r *http.Request) (string, string, string, error) {
	ips := r.Header.Get("X-Forwarded-For")
	splitIps := strings.Split(ips, ",")

	ip := ""

	if len(splitIps) > 0 {
		// get last IP in list since ELB prepends other user defined IPs, meaning the last one is the actual client IP.
		netIP := net.ParseIP(splitIps[len(splitIps)-1])
		if netIP == nil {
			ipHost, _, err := net.SplitHostPort(r.RemoteAddr)
			if err != nil {
				return "No IP", "Location not found", "Country not found", err
			}
			ip = ipHost
		}
	}

	netIP := net.ParseIP(ip)
	if netIP != nil {
		ip := netIP.String()
		if ip == "::1" {
			return "127.0.0.1", "Loopback", "Home", nil
		}
		return ip, "Location not found", "Country not found", nil
	}

	city, country, err := useGeoIP(ip)
	if err != nil {
		return ip, "", "", err
	}
	return ip, city, country, nil

}

func useGeoIP(ip string) (string, string, error) {
	path := ""
	if os.Getenv("APP_ENV") == "development" {
		path = "GeoLite2-City.mmdb"
	} else {
		path = "/usr/local/share/GeoIP/GeoLite2-City.mmdb"
	}

	db, err := geoip2.Open(path)
	if err != nil {
		return "", "", err
	}
	defer func(db *geoip2.Reader) {
		err := db.Close()
		if err != nil {
			log.Fatal(err)
		}
	}(db)

	city, err := db.City(net.ParseIP(ip))
	if err != nil {
		return "", "", err
	}

	fmt.Println(city.City.Names["en"], city.Country.Names["en"])

	return city.City.Names["en"], city.Country.Names["en"], nil
}
