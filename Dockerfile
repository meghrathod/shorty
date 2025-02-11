# Stage 1: Build the Go application
FROM golang:latest AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod tidy

COPY . .

RUN go build -o shorty main.go

# Stage 2: GeoIP database setup and application image
FROM debian:bookworm-slim

WORKDIR /app

# Copy the setup script
COPY geoip_setup.sh /app/

# Set environment variables (IMPORTANT: Set these during the build)
ARG MAXMIND_ACCOUNT_ID
ARG MAXMIND_LICENSE_KEY
ENV MAXMIND_ACCOUNT_ID=${MAXMIND_ACCOUNT_ID}
ENV MAXMIND_LICENSE_KEY=${MAXMIND_LICENSE_KEY}

# Make the script executable
RUN chmod +x /app/geoip_setup.sh

# Create the GeoIP database directory
RUN mkdir -p /usr/local/share/GeoIP

# Run the setup script (downloads, installs, and configures GeoIP)
RUN /app/geoip_setup.sh

# Copy the Go binary
COPY --from=builder /app/shorty /app/shorty

# Install cron (and any other dependencies your app needs)
RUN apt-get update && apt-get install -y --no-install-recommends cron \
    && rm -rf /var/lib/apt/lists/*

# Add cron job (adjust the schedule as needed)
RUN echo "0 0 * * 0 root geoipupdate -f /etc/GeoIP.conf" > /etc/cron.d/geoipupdate-cron && \
    chmod 0644 /etc/cron.d/geoipupdate-cron

# Start cron and the application
CMD service cron start && /app/shorty

EXPOSE 8080