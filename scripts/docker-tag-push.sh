#!/bin/bash

REGISTRY="${1:-localhost:5110}"
IMAGES=("brain-api" "brain-ui")

echo "Tagging Docker images for registry: $REGISTRY"
for IMAGE in "${IMAGES[@]}"; do
  docker tag vl/$IMAGE:latest $REGISTRY/vl/$IMAGE:latest || { echo "Tagging failed for $IMAGE"; exit 1; }
done

echo "Pushing Docker images to $REGISTRY"
for IMAGE in "${IMAGES[@]}"; do
  docker push $REGISTRY/vl/$IMAGE:latest || { echo "Push failed for $IMAGE"; exit 1; }
done

echo "All images tagged and pushed successfully."