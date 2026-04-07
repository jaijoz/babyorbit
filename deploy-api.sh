#!/usr/bin/env bash
set -euo pipefail

PROJECT_ID="${PROJECT_ID:-babyorbit}"
REGION="${REGION:-us-east4}"
SERVICE_NAME="${SERVICE_NAME:-babyorbit-api}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
STAGE_DIR="${STAGE_DIR:-/tmp/babyorbit-api-src}"

cd "$SCRIPT_DIR"

rm -rf "$STAGE_DIR"
mkdir -p "$STAGE_DIR/orbit_coordinator"

cp -R "$SCRIPT_DIR/orbit_coordinator"/* "$STAGE_DIR/orbit_coordinator/"
cp "$SCRIPT_DIR/orbit_coordinator/requirements.txt" "$STAGE_DIR/requirements.txt"

gcloud run deploy "$SERVICE_NAME" \
  --source="$STAGE_DIR" \
  --project="$PROJECT_ID" \
  --region="$REGION" \
  --allow-unauthenticated \
  --port=8080 \
  --env-vars-file="$SCRIPT_DIR/env.cloudrun.yaml"
