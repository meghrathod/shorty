#!/bin/sh

# Install software-properties-common, ca-certificates, gettext, and geoipupdate
apt-get update && apt-get install -y --no-install-recommends ca-certificates gettext wget  # Add wget here

# Download geoipupdate .deb package (adjust version if needed)
wget -qO geoipupdate.deb https://github.com/maxmind/geoipupdate/releases/download/v7.1.0/geoipupdate_7.1.0_linux_amd64.deb

# Install geoipupdate (and resolve dependencies)
dpkg -i geoipupdate.deb
apt-get install -y -f  # Important: Resolve dependencies
rm geoipupdate.deb

# Create GeoIP configuration file using a template and envsubst
echo "AccountID $MAXMIND_ACCOUNT_ID" > /etc/GeoIP.conf.template
echo "LicenseKey $MAXMIND_LICENSE_KEY" >> /etc/GeoIP.conf.template
echo "EditionIDs GeoLite2-City" >> /etc/GeoIP.conf.template
echo "DatabaseDirectory /usr/local/share/GeoIP" >> /etc/GeoIP.conf.template
envsubst < /etc/GeoIP.conf.template > /etc/GeoIP.conf
rm /etc/GeoIP.conf.template

# Run geoipupdate
geoipupdate -f /etc/GeoIP.conf