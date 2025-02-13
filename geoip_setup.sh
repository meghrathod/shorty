#!/bin/sh

# Install software-properties-common, ca-certificates, gettext, and geoipupdate
apt-get update && apt-get install -y --no-install-recommends software-properties-common ca-certificates gettext

# Add MaxMind PPA
add-apt-repository -y ppa:maxmind/ppa

# Update package lists again after adding the PPA
apt-get update
apt-get install -y --no-install-recommends geoipupdate

# Set environment variables (these will be passed in by Docker)
MAXMIND_ACCOUNT_ID="$MAXMIND_ACCOUNT_ID"
MAXMIND_LICENSE_KEY="$MAXMIND_LICENSE_KEY"

# Create GeoIP configuration file using a template and envsubst
echo "AccountID $MAXMIND_ACCOUNT_ID" > /etc/GeoIP.conf.template
echo "LicenseKey $MAXMIND_LICENSE_KEY" >> /etc/GeoIP.conf.template
echo "EditionIDs GeoLite2-City" >> /etc/GeoIP.conf.template
echo "DatabaseDirectory /usr/local/share/GeoIP" >> /etc/GeoIP.conf.template
envsubst < /etc/GeoIP.conf.template > /etc/GeoIP.conf
rm /etc/GeoIP.conf.template

# Run geoipupdate
geoipupdate -f /etc/GeoIP.conf