package main

import "math/rand"

func flattenForm(form map[string][]string) map[string]string {
	flatMap := make(map[string]string)
	for key, values := range form {
		if len(values) > 0 {
			flatMap[key] = values[0] // Take the first value
		}
	}
	return flatMap
}

func generateKey() string {
	chars := "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
	key := ""
	for i := 0; i < 6; i++ {
		key += string(chars[rand.Intn(len(chars))])
	}
	return key
}
