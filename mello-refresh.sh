#!/usr/bin/env bash

echo "Refreshing: Mello"

/usr/local/bin/docker-compose pull web
/usr/local/bin/docker-compose pull api

echo "Rerunning composition"
/usr/local/bin/docker-compose up -d
