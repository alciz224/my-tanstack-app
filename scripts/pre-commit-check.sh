#!/bin/bash

# Pre-commit check script
# Run this before committing to catch common errors

echo "Running TypeScript checks..."

# Check for TypeScript errors
ERRORS=$(npx tsc --noEmit 2>&1)

if [ -n "$ERRORS" ]; then
  echo "❌ TypeScript errors found:"
  echo "$ERRORS"
  echo ""
  echo "Common fixes:"
  echo "1. Remove unused imports"
  echo "2. Import types from types.ts not mocks.ts"
  echo "3. Add proper types to useState"
  echo ""
  exit 1
fi

echo "✅ TypeScript checks passed"
exit 0