//go:build !js
// +build !js

package main

import (
	"fmt"
	"io"
	"os"
	"strings"

	"github.com/russellsteadman/cmap/internal/cmap"
)

func printHelp() {
	fmt.Printf("Usage: cmap %s\n", cmap.ToolVersion)
	fmt.Print("cmap is a tool for grading concept maps from a Cmap Outline file.\n\n")

	fmt.Println("Options:")
	fmt.Println("  -h, --help\t\t\tShow this help message and exit")
	fmt.Println("  -v, --version\t\t\tShow the version number and exit")
	fmt.Println("  -i, --input\t\t\tThe input file to read from (required)")
	fmt.Println("  -f, --format\t\t\tThe format of the input file (txt, xml)")
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
			fmt.Printf("cmap version %s\n", cmap.ToolVersion)
			return
		} else if arg == "-i" || arg == "--input" {
			if i+1 < len(args) {
				inputFile = args[i+1]
			}
		} else if arg == "-f" || arg == "--format" {
			if i+1 < len(args) {
				if args[i+1] == "xml" {
					cmapInput.Format = 1
				}
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

	cmapOutput, err := cmap.GradeMap(cmapInput)
	if err != nil {
		fmt.Print(err.Error() + "\n\n")
		printHelp()
		return
	}

	fmt.Print("NC: " + fmt.Sprint(cmapOutput.NC) + "\n")
	fmt.Print("NL: " + fmt.Sprint(cmapOutput.NL) + "\n")
	fmt.Print("NUP: " + fmt.Sprint(cmapOutput.NUP) + "\n")
	fmt.Print("HH: " + fmt.Sprint(cmapOutput.HH) + "\n")
	fmt.Print("NCT: " + fmt.Sprint(cmapOutput.NCT) + "\n")

	fmt.Print("Highest Hierarchy: \n\n" + strings.Join(cmapOutput.LongestPath, " > ") + "\n\n")
}
