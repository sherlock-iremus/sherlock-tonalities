#!/bin/bash
yarn install
rm -rf dist
yarn build
mv dist tonalities
scp -r tonalities $1:sherlock/apache/public_html/
