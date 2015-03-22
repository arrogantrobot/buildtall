#!/bin/bash

aws s3 sync . s3://buildtall.com --exclude ".*/*" --exclude "*.sw?" --exclude ".DS_Store" --exclude ".gitignore"
