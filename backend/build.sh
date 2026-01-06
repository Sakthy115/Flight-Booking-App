#!/bin/bash
# Render build script for backend

echo "Installing Go dependencies..."
go mod download

echo "Building application..."
go build -o main .

echo "Build complete!"
