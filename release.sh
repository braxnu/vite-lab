#!/bin/bash
set -e

npm run build
docker build -t medyk-lab .
