//go:build !js
// +build !js

package main

import (
	"fmt"
	"io"
	"os"

	"github.com/russellsteadman/cmap/internal/cmap"
)

const version = "v0.1.0"

func printHelp() {
	fmt.Printf("Usage: cmap %s\n", version)
	fmt.Print("cmap is a tool for generating a cmapulary file from a text file.\n\n")

	fmt.Println("Options:")
	fmt.Println("  -h, --help\t\t\tShow this help message and exit")
	fmt.Println("  -v, --version\t\t\tShow the version number and exit")
	fmt.Println("  -i, --input\t\t\tThe input file to read from (required)")
}

func main() {
	fmt.Print("\033[H\033[2J")

	args := os.Args

	if len(args) < 2 {
		fmt.Print("Missing any arguments\n\n")
		printHelp()
		return
	}

	cmapInput := &cmap.CmapInput{}
	inputFile := ""

	for i, arg := range args {
		if arg == "-h" || arg == "--help" {
			printHelp()
			return
		} else if arg == "-v" || arg == "--version" {
			fmt.Printf("cmap version %s\n", version)
			return
		} else if arg == "-i" || arg == "--input" {
			if i+1 < len(args) {
				inputFile = args[i+1]
			}
		}
	}

	if inputFile == "" {
		fmt.Print("Missing input or output file\n\n")
		printHelp()
		return
	}

	file, err := os.Open(inputFile)
	if err != nil {
		fmt.Printf("Error opening input file: %s\n\n", inputFile)
		printHelp()
		return
	}

	fileBytes, err := io.ReadAll(file)
	file.Close()
	if err != nil {
		fmt.Print("Error reading input file, is it in use elsewhere?\n\n")
		printHelp()
		return
	}

	cmapInput.File = fileBytes

	cmapOutput, err := cmap.CreateSet(cmapInput)
	if err != nil {
		fmt.Print(err.Error() + "\n\n")
		printHelp()
		return
	}

	fmt.Print(string(cmapOutput))
}
