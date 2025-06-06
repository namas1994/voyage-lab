#!/bin/bash

# Load environment variables from .env file if it exists
if [ -f ../.env ]; then
    echo "Loading environment variables from .env file"
    export $(grep -v '^#' ../.env | xargs)
elif [ -f ./.env ]; then
    echo "Loading environment variables from .env file"
    export $(grep -v '^#' ./.env | xargs)
fi

REGISTRY_TYPE=${1:-localhost}  # Options: local, gcr, localhost
PROJECT_ID=${GCP_PROJECT_ID}
LOCATION=${GCP_LOCATION}  # Default location if not provided


echo registry type: $REGISTRY_TYPE
# Set image prefix based on registry type
if [ "$REGISTRY_TYPE" = "gcr" ] && [ -n "$PROJECT_ID" ]; then
    # Check for required environment variables
    if [ -z "$PROJECT_ID" ]; then
        echo "ERROR: GCP_PROJECT_ID environment variable is not set. Required for gcr registry type."
        echo "Please set GCP_PROJECT_ID in your .env file or pass it as an argument."
        exit 1
    fi
    
    if [ -z "$LOCATION" ]; then
        echo "ERROR: GCP_LOCATION environment variable is not set. Required for gcr registry type."
        echo "Please set GCP_LOCATION in your .env file or pass it as an argument."
        exit 1
    fi
    PREFIX="${LOCATION}-docker.pkg.dev/$PROJECT_ID"
    echo "Using GCR registry location: $LOCATION & project: $PROJECT_ID"
elif [ "$REGISTRY_TYPE" = "localhost" ]; then
    PREFIX="localhost:5110"
    echo "Using localhost registry: $PREFIX"
else
    echo "Invalid registry type or missing PROJECT_ID. Using default local registry."
    exit 1
fi

# Set complete image names - fixed concatenation
API_IMAGE="${PREFIX}/vl/brain-api:latest"
UI_IMAGE="${PREFIX}/vl/brain-ui:latest"

# Build the images
docker build -t $API_IMAGE -f Dockerfile --target brain-api . || { echo "Docker build failed for brain-api"; exit 1; }
docker build -t $UI_IMAGE -f Dockerfile --target brain-ui . || { echo "Docker build failed for brain-ui"; exit 1; }
echo "Docker images built successfully: $API_IMAGE and $UI_IMAGE"

# Optional push based on registry type
if [ "$REGISTRY_TYPE" = "gcr" ] || [ "$REGISTRY_TYPE" = "localhost" ]; then
    read -p "Do you want to push these images? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker push $API_IMAGE
        docker push $UI_IMAGE
        echo "Images pushed successfully to $PREFIX"
    else
        echo "Push skipped. To push manually, run:"
        echo "docker push $API_IMAGE"
        echo "docker push $UI_IMAGE"
    fi
fi
