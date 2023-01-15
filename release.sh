#!/bin/bash
set -e

npm run build
docker build -t medyk-lab .

# docker run \
#   --rm \
#   -v=$(pwd)/data.json:/opt/data.json \
#   -v=$(pwd)/users.json:/opt/users.json \
#   -e='JWT_SECRET=very-secret' \
#   -p 5173:3000 \
#   --name medyk-lab \
#   medyk-lab

#   # -e='GOOGLE_AUTH_CLIENT_ID=' \
#   # -ti \
