package cmap_test

import (
	"testing"

	"github.com/russellsteadman/cmap/internal/cmap"
)

// This is a holder test function to make sure the test package is working
func TestTypes(t *testing.T) {
	t.Log("TestTypes")
	node := cmap.Node{}

	if node.Id != 0 {
		t.Error("Node ID should be unset")
	}
}

// TODO: Unit tests for cmap package
