#!/bin/bash

for file in documents/*.md; do
  node git_api.js "$file"
done

for file in *.html; do
  cp "$file" $HOME/Documents/share_notes/
  mv "$file" documents/
done
