#!/bin/bash
if git diff --name-only HEAD^ | grep .md; then
  hugo
  git add .
  git commit -m "prepush build"
fi
