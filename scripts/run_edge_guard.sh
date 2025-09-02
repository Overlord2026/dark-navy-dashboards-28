#!/bin/bash

# Test the edge-only guard
echo "Running edge-only security guard..."

if command -v node >/dev/null 2>&1; then
    node scripts/edge_only_guard.js
    exit_code=$?
    
    if [ $exit_code -eq 0 ]; then
        echo "✅ Edge-only guard passed - ready for production"
    else
        echo "❌ Edge-only violations detected - build would fail"
        exit 1
    fi
else
    echo "⚠️  Node.js not available - guard will run during build"
fi