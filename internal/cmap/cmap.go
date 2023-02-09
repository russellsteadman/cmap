package cmap

import (
	"errors"
	"log"
)

// Node is a node in the cmap
type Node struct {
	Id          int
	Name        []byte
	Connections []*Connections
}

// Connections is a connection between two nodes
type Connections struct {
	Id   int
	Name []byte
	From *Node
	To   *Node
}

// CmapInput is the input of the GradeMap function
type CmapInput struct {
	File   []byte `json:"file"`
	Format int    `json:"format"` // 0 = TXT, 1 = XML
}

// CmapOutput is the output of the GradeMap function
type CmapOutput struct {
	NC          int      `json:"nc"`          // Number of concepts
	NL          int      `json:"nl"`          // Number of links
	HH          int      `json:"hh"`          // Highest hierarchy
	NUP         int      `json:"nup"`         // Number of hierarchies (unique paths)
	NCT         int      `json:"nct"`         // Number of cross-links (total inter and intra)
	LongestPath []string `json:"longestPath"` // Highest hierarchy path
}

func GradeMap(input *CmapInput) (*CmapOutput, error) {
	// Validate input
	if input.File == nil || len(input.File) == 0 {
		return nil, errors.New("missing or empty input file")
	}

	// Create a list of all nodes
	var allNodes []*Node
	var err error

	// Text format
	if input.Format == 0 {
		allNodes, err = parseText(input.File)
	} else if input.Format == 1 {
		allNodes, err = parseXML(input.File)
	} else {
		return nil, errors.New("invalid format")
	}

	if err != nil {
		return nil, err
	}

	// Calculate the number of nodes and connections
	nodeCount := len(allNodes)
	connCount := 0
	for _, node := range allNodes {
		connCount += len(node.Connections)
	}
	connCount /= 2

	// Find longest path
	longestPath := []*Node{}
	numberOfHierarchies := 0

	// Find all nodes that start a chain and traverse them
	for _, node := range allNodes {
		startsChain := true

		for _, conn := range node.Connections {
			if conn.To.Id == node.Id {
				startsChain = false
				break
			}
		}

		if startsChain {
			longestPath, numberOfHierarchies = traverse([]*Node{node})
			break
		}
	}

	// Find the number of end nodes
	endNodes := 0
	for _, node := range allNodes {
		endsChain := true

		for _, conn := range node.Connections {
			if conn.From.Id == node.Id {
				endsChain = false
				break
			}
		}

		if endsChain {
			endNodes++
		}
	}
	log.Println("End nodes", endNodes)

	// Select the dominator node
	// dominator := longestPath[0]

	// Format the longest path as a string list
	longestPathFormatted := []string{}
	for i, node := range longestPath {
		longestPathFormatted = append(longestPathFormatted, string(node.Name))

		if i < len(longestPath)-1 {
			for _, conn := range node.Connections {
				if conn.To == longestPath[i+1] {
					longestPathFormatted = append(longestPathFormatted, string(conn.Name))
					break
				}
			}
		}
	}

	output := &CmapOutput{
		NC:          nodeCount,
		NL:          connCount,
		HH:          len(longestPath),
		NUP:         numberOfHierarchies,
		NCT:         connCount - (nodeCount - 1),
		LongestPath: longestPathFormatted,
	}

	return output, nil
}
