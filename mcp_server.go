package main

import (
	"bufio"
	"database/sql"
	"fmt"
	"log"
	"net"
	"os"
	"strings"
)

// startMCPServer starts a simple TCP server that accepts text based
// commands to shorten URLs. It is intentionally minimal and supports
// the following commands:
//
//	PING                        -> replies with PONG
//	SHORTEN <url>               -> shorten the given URL
//	SHORTEN <url> CUSTOM <key>  -> shorten with a custom key
func startMCPServer(db *sql.DB) {
	port := os.Getenv("MCP_PORT")
	if port == "" {
		port = "5555"
	}

	ln, err := net.Listen("tcp", ":"+port)
	if err != nil {
		log.Printf("failed to start MCP server: %v", err)
		return
	}
	log.Printf("MCP server listening on %s", port)

	go func() {
		for {
			conn, err := ln.Accept()
			if err != nil {
				log.Printf("MCP accept error: %v", err)
				continue
			}
			go handleMCPConn(conn, db)
		}
	}()
}

func handleMCPConn(conn net.Conn, db *sql.DB) {
	defer conn.Close()
	scanner := bufio.NewScanner(conn)
	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())
		if line == "" {
			continue
		}
		fields := strings.Fields(line)
		if len(fields) == 0 {
			continue
		}
		cmd := strings.ToUpper(fields[0])
		switch cmd {
		case "PING":
			fmt.Fprintln(conn, "PONG")
		case "SHORTEN":
			handleMCPShorten(conn, db, fields[1:])
		default:
			fmt.Fprintln(conn, "ERR unknown command")
		}
	}
	if err := scanner.Err(); err != nil {
		log.Printf("MCP read error: %v", err)
	}
}

func handleMCPShorten(conn net.Conn, db *sql.DB, args []string) {
	if len(args) < 1 {
		fmt.Fprintln(conn, "ERR missing URL")
		return
	}
	targetURL := args[0]
	custom := false
	customKey := ""
	if len(args) >= 3 && strings.ToUpper(args[1]) == "CUSTOM" {
		custom = true
		customKey = args[2]
	}
	if _, err := checkURLValid(targetURL); err != nil {
		fmt.Fprintln(conn, "ERR invalid URL")
		return
	}
	newURL, err := createURL(targetURL, db, custom, customKey)
	if err != nil {
		fmt.Fprintf(conn, "ERR %v\n", err)
		return
	}
	if err := saveURL(newURL, db); err != nil {
		fmt.Fprintf(conn, "ERR %v\n", err)
		return
	}
	fmt.Fprintf(conn, "%s %s %s\n", newURL.ShortURL, newURL.Url, newURL.Pin)
}
