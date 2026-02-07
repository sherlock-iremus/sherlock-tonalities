#!/bin/bash
yarn build
scp -r tonalities $1:infra/apache/public_html/
rm -rf tonalities