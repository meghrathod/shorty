# Stage 1: Build the Go application
FROM golang:latest AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod tidy

COPY . .

RUN go build meghrathod/shorty

# Stage 2: GeoIP database setup and application image
FROM debian:bookworm

WORKDIR /app

# Copy the setup script
COPY geoip_setup.sh /app/

# Set environment variables (IMPORTANT: Set these during the build)
ARG MAXMIND_ACCOUNT_ID
ARG MAXMIND_LICENSE_KEY
ARG PORT
ARG USERNAME
ARG PASSWORD
ARG DB_HOST
ARG DB_PORT
ARG DB_NAME
ARG ALLOWED_ORIGINS
ENV MAXMIND_ACCOUNT_ID $MAXMIND_ACCOUNT_ID
ENV MAXMIND_LICENSE_KEY $MAXMIND_LICENSE_KEY
ENV PORT $PORT
ENV USERNAME $USERNAME
ENV PASSWORD $PASSWORD
ENV DB_HOST $DB_HOST
ENV DB_PORT $DB_PORT
ENV DB_NAME $DB_NAME
ENV ALLOWED_ORIGINS $ALLOWED_ORIGINS

# Make the script executable
RUN chmod +x /app/geoip_setup.sh

# Create the GeoIP database directory
RUN mkdir -p /usr/local/share/GeoIP

CMD ["/app/geoip_setup.sh"]
# Copy the Go binary
COPY --from=builder /app/shorty /app/shorty

# Install cron (and any other dependencies your app needs)
RUN apt-get update && apt-get install -y --no-install-recommends cron ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Add cron job (adjust the schedule as needed)
RUN echo "0 0 * * 0 root geoipupdate -f /etc/GeoIP.conf" > /etc/cron.d/geoipupdate-cron && \
    chmod 0644 /etc/cron.d/geoipupdate-cron

# Start cron and the application
CMD service cron start && /app/shorty

EXPOSE $PORT