package main

import (
	"database/sql"
	"log"
	"math/rand"
)

func flattenForm(form map[string][]string) map[string]string {
	flatMap := make(map[string]string)
	for key, values := range form {
		if len(values) > 0 {
			flatMap[key] = values[0] // Take the first value
		}
	}
	return flatMap
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
	for i := 0; i < 8; i++ {
		pin += string(chars[rand.Intn(len(chars))])
	}
	return pin
}
