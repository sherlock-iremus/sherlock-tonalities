#!/bin/bash
vite build
scp -r tonalities $1:sherlock/apache/public_html/
rm -rf tonalities