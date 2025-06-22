#!/bin/bash

# BotForge Database Export Script
# This script exports the complete database structure and data

echo "Starting BotForge database export..."

# Export complete database with structure and data
pg_dump $DATABASE_URL > botforge_complete_export.sql

# Export only database structure (schema)
pg_dump --schema-only $DATABASE_URL > botforge_schema_only.sql

# Export only data (no structure)
pg_dump --data-only $DATABASE_URL > botforge_data_only.sql

# Create a custom export with INSERT statements
pg_dump --column-inserts --data-only $DATABASE_URL > botforge_data_inserts.sql

echo "Database exports completed:"
echo "- botforge_complete_export.sql (structure + data)"
echo "- botforge_schema_only.sql (structure only)"
echo "- botforge_data_only.sql (data only)"
echo "- botforge_data_inserts.sql (data with INSERT statements)"

# Display database statistics
echo ""
echo "Database Statistics:"
psql $DATABASE_URL -c "SELECT 
  schemaname as schema,
  tablename as table_name,
  n_tup_ins as inserts,
  n_tup_upd as updates,
  n_tup_del as deletes
FROM pg_stat_user_tables 
ORDER BY tablename;"