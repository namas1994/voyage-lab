#!/bin/bash

concurrently \
  "pnpm --filter @vl/brain-api watch" \
  "pnpm --filter @vl/brain-ui dev"