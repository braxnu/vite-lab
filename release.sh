#!/bin/bash
set -e

npm run build
docker build -t medyk-lab .
docker tag medyk-lab reg.braxnu.com:5000/medyk-lab
docker push reg.braxnu.com:5000/medyk-lab
