#!/bin/bash
if git diff --name-only | grep .md; then
  yarn docs:build
  git add .
fi
