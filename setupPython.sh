#!/usr/bin/env bash
set -e
sudo apt install -y python3-libcamera
# Create and activate Python virtual environment, then install requirements
sudo python3 -m venv --system-site-packages venv
# shellcheck disable=SC1091
source venv/bin/activate

sudo pip install -r requirements.txt
echo "Python virtual environment ready and requirements installed."
