#!/bin/bash
mv dist tonalities
scp -r tonalities $1:sherlock/apache/public_html/
