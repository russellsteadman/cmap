package cmap_test

import (
	"encoding/json"
	"os"
	"path/filepath"
	"regexp"
	"testing"

	"github.com/russellsteadman/cmap/internal/cmap"
)

var cxlRegex = regexp.MustCompile(`\.cxl$`)

// Test this package against the cross-validation samples
func TestCrossValidation(t *testing.T) {
	t.Log("TestTypes")
	wd, err := os.Getwd()
	if err != nil {
		t.Fatal(err)
	}
	cvd := filepath.Join(wd, "../../samples/cross-validate")
	t.Log(cvd)

	files, err := os.ReadDir(cvd)
	if err != nil {
		t.Fatal(err)
	}

	jsonData, err := os.ReadFile(filepath.Join(cvd, "results.json"))
	if err != nil {
		t.Fatal(err)
	}

	results := make(map[string]*cmap.CmapOutput)

	err = json.Unmarshal(jsonData, &results)
	if err != nil {
		t.Fatal(err)
	}

	for _, file := range files {
		if !cxlRegex.MatchString(file.Name()) {
			continue
		}
		t.Log(file.Name())

		expected, ok := results[file.Name()]
		if !ok {
			t.Fatal("Missing expected result for", file.Name())
		}
		expectsError := expected.NC == -1

		// Load the file
		fileContents, err := os.ReadFile(filepath.Join(cvd, file.Name()))
		if err != nil {
			t.Fatal(err)
		}

		// Use the file contents to create a new cmap
		cmapInput := &cmap.CmapInput{
			Format: 1,
			File:   fileContents,
		}
		out, err := cmap.GradeMap(cmapInput)
		if err != nil && !expectsError {
			t.Error("Fails when not expected")
			t.Fatal(err)
		} else if err == nil && expectsError {
			t.Fatal("Succeeds when not expected")
		} else if expectsError {
			continue
		}

		// The validation tool excludes the main concept node
		if out.NC != (expected.NC + 1) {
			t.Error("NC does not match:", out.NC, "!=", expected.NC+1)
		}
		if out.HH != (expected.HH + 1) {
			t.Error("HH does not match:", out.HH, "!=", expected.HH+1)
		}
		if out.NUP != expected.NUP {
			t.Error("NUP does not match:", out.NUP, "!=", expected.NUP)
		}
		if out.NCT != expected.NCT {
			t.Error("NCT does not match:", out.NCT, "!=", expected.NCT)
		}
	}

	node := cmap.Node{}

	if node.Id != 0 {
		t.Error("Node ID should be unset")
	}
}

// TODO: Unit tests for cmap package
