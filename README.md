# cmap Tool

cmap is a simple CLI utility that takes a text file and finds the most frequent words.

## Motivation

I wanted an easy way to extract key cmapulary terms from a story in Spanish so I could learn the most common terms.

## Online Version

If you want to try out this tool or use it without installation, try the [experimental web version](https://cmap.docs.russellsteadman.com/experiments/web/). You can use all of the CLI features in your browser without any information leaving your device.

## Installation

### Using go

This requires go `1.19+`. Replace `<version>` with the latest release.

```sh
go install github.com/russellsteadman/cmap@<version>
```

If the `cmap` term is not available in your terminal, make sure your `$GO_PATH/bin` is in your `$PATH`.

### Via releases

Download the executable for your operating system and architecture from releases. You can then move the binary to a location in the path, or just use it locally.

```sh
# For MacOS (darwin)/Linux platforms
chmod +x ./cmap
./cmap --help
```

```bat
:: For Windows platforms
.\cmap --help
```

Note that these binaries are not signed and will raise "unidentified developer" errors. Code signing may be added in the future with enough usage.

## Usage (Command-line)

If you have an `.mobi`, `.epub`, or other format, convert the file into a `.txt` text file. There are many online converters available to do so.

```sh
cmap --help
```

```txt
Usage: cmap v0.2.0
cmap is a tool for generating a cmapulary file from a text file.

Options:
  -h, --help                    Show this help message and exit
  -v, --version                 Show the version number and exit
  -o, --output                  The output file to write to (required)
  -i, --input                   The input file to read from (required)
  -t, --thresh                  The minimum word count to include in the output
  -c, --count                   The maximum number of words to include in the output
  -s, --simple                  Only emit the words, not the counts
  -g, --group                   Group words into # word groups
```

## Examples

Get all words in order of usage:

```sh
cmap -i book.txt -o book-cmap.txt
```

Get top 100 words:

```sh
cmap -i book.txt -o book-cmap.txt -c 100
```

Get words with 10 or more uses:

```sh
cmap -i charlie.txt -o charlie-cmap.txt -t 10
```

Get all words in order of count without additional markup:

```sh
cmap -i charlie.txt -o charlie-cmap.txt -s
```

Get groups of 3 words sorted by usage:

```sh
cmap -i charlie.txt -o charlie-cmap.txt -g 3
```

## License

Open source. Released under an MIT License, see the `LICENSE` file for details.
