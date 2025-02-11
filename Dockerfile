# Use an official Go image as the base
FROM golang:1.21 AS builder

# Set environment variables
ENV GO111MODULE=on \
    CGO_ENABLED=0 \
    GOOS=linux \
    GOARCH=amd64

# Set working directory inside the container
WORKDIR /app

# Copy Go modules & download dependencies
COPY go.mod ./
RUN go mod download

# Copy the rest of the app source code
COPY . .

# Build the application
RUN go build -o shorty main.go

# Create a minimal runtime image
FROM debian:bookworm-slim

# Install geoipupdate & cron
RUN apt update && apt install -y software-properties-common && rm -rf /var/lib/apt/lists/*
RUN add-apt-repository ppa:maxmind/ppa
RUN apt update && apt install -y geoipupdate cron

# Set working directory
WORKDIR /app

# Copy compiled Go binary from builder
COPY --from=builder /app/shorty /app/shorty

# Configure geoipupdate using environment variables
RUN echo "AccountID ${MAXMIND_ACCOUNT_ID}" > /etc/GeoIP.conf && \
    echo "LicenseKey ${MAXMIND_LICENSE_KEY}" >> /etc/GeoIP.conf && \
    echo "EditionIDs GeoLite2-City" >> /etc/GeoIP.conf && \
    echo "DatabaseDirectory /usr/local/share/GeoIP" >> /etc/GeoIP.conf

# Run geoipupdate initially
RUN geoipupdate

# Add a cron job to update GeoIP database every **Sunday at midnight**
RUN echo "0 0 * * 0 root geoipupdate" > /etc/cron.d/geoipupdate-cron && \
    chmod 0644 /etc/cron.d/geoipupdate-cron && \
    crontab /etc/cron.d/geoipupdate-cron

# Start cron and the server
CMD service cron start && /app/shorty

# Expose required port
EXPOSE 8080