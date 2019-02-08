#!/bin/bash
if git diff --name-only HEAD | grep .md; then
  yarn docs:build
  git add .
  git commit -m "prepush build"
fi