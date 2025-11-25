#!/bin/bash
# Query WiFiVigilante case tags from Supabase

SUPABASE_URL="https://eumqnuyqxcbcnsohpjyh.supabase.co"
SERVICE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1bXFudXlxeGNiY25zb2hwanloIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzA0NjAwOSwiZXhwIjoyMDc4NjIyMDA5fQ.LOE-Ue7ppMRzymEHP2o22AOtN_vqTa2KkdRPfsKnBgY"

curl -s "${SUPABASE_URL}/rest/v1/case_files?select=id,title,tags" \
  -H "apikey: ${SERVICE_KEY}" \
  -H "Authorization: Bearer ${SERVICE_KEY}" | jq '.'
