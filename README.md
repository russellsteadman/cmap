# cmap Grading Tool

cmap is a simple CLI utility that takes a Cmap Outline generated by CmapTools and finds node count, connections, and the highest hierarchy.

## Installation

### Using go

This requires go `1.20+`. Replace `<version>` with the latest tool release (see GitHub releases).

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

Note that these binaries are not signed and will raise "unidentified developer" errors.

## Usage (Command-line)

```sh
cmap --help
```

```txt
Usage: cmap v0.2.1
cmap is a tool for grading concept maps from a Cmap Outline file.

Options:
  -h, --help                    Show this help message and exit
  -v, --version                 Show the version number and exit
  -i, --input                   The input file to read from (required)
  -f, --format                  The format of the input file (txt, xml)
```

## Testing

```sh
go test ./...
```

## License

Copyright 2023 The Ohio State University. Released under an MIT License, see the `LICENSE` file for details.
