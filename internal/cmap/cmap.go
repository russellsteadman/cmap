package cmap

import (
	"bytes"
	"errors"
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
	File []byte `json:"file"`
}

// CmapOutput is the output of the GradeMap function
type CmapOutput struct {
	Nodes             int      `json:"nodes"`
	Connections       int      `json:"connections"`
	LongestPathLength int      `json:"longestPathLength"`
	LongestPath       []string `json:"longestPath"`
}

func GradeMap(input *CmapInput) (*CmapOutput, error) {
	// Validate input
	if input.File == nil || len(input.File) == 0 {
		return nil, errors.New("missing or empty input file")
	}

	// Split file into lines
	fileLines := bytes.Split(bytes.ReplaceAll(input.File, []byte("    "), []byte("\t")), []byte("\n"))

	// Creat a list of all nodes
	allNodes := []*Node{}

	// Initialize loop variables
	level := 1
	parentNode := make(map[int]*Node)
	parentConn := make(map[int][]byte)
	nodeUniqueNames := make(map[string]*Node)
	nodeIndex := 0
	connIndex := 0

	for _, rawLine := range fileLines {
		// Get the level of the line
		level = bytes.Count(rawLine, []byte("\t")) + 1
		line := bytes.TrimSpace(rawLine)

		// Skip empty lines
		if len(line) == 0 {
			continue
		}

		// Check if the line is a node or a connection
		isNode := level%2 == 1

		if isNode {
			// Create a new node
			redundantNode := false
			node := &Node{
				Name:        line,
				Connections: []*Connections{},
			}

			// Check if the node already exists
			if _, ok := nodeUniqueNames[string(line)]; ok {
				node = nodeUniqueNames[string(line)]
				redundantNode = true
			} else {
				nodeUniqueNames[string(line)] = node
				node.Id = nodeIndex
				nodeIndex += 1
			}

			// Set the parent node for future connections
			parentNode[level] = node

			if level > 1 {
				// Create a connection between the parent node and the current node
				connIndex += 1
				conn := &Connections{
					Id:   connIndex,
					Name: []byte(parentConn[level-1]),
					From: parentNode[level-2],
					To:   node,
				}

				// Check if the connection already exists
				redundantConn := false
				for _, otherConn := range node.Connections {
					if otherConn.From == conn.From && otherConn.To == conn.To && bytes.Equal(otherConn.Name, conn.Name) {
						redundantConn = true
						break
					}
				}

				if !redundantConn {
					// Add the connection to the current node and the parent node
					node.Connections = append(node.Connections, conn)

					if parentNode[level-2] != nil {
						parentNode[level-2].Connections = append(parentNode[level-2].Connections, conn)
					}
				}
			}

			if !redundantNode {
				// Add the node to the list of all nodes
				allNodes = append(allNodes, node)
			}
		} else {
			// Set the parent connection for future connections
			parentConn[level] = line
		}
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

	// Find all nodes that start a chain and traverse them
	for _, node := range allNodes {
		startsChain := true

		for _, conn := range node.Connections {
			if conn.To == node {
				startsChain = false
			}
		}

		if startsChain {
			nodePath := traverse([]*Node{node})
			if len(nodePath) > len(longestPath) {
				longestPath = nodePath
			}
		}
	}

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
		Connections:       connCount,
		Nodes:             nodeCount,
		LongestPathLength: len(longestPath),
		LongestPath:       longestPathFormatted,
	}

	return output, nil
}

// Recursive descent to find longest path
func traverse(path []*Node) []*Node {
	// Get the last node in the path
	node := path[len(path)-1]

	// Find all possible paths from the current node
	options := [][]*Node{}
	for _, conn := range node.Connections {
		if conn.From == node {
			options = append(options, traverse(append(path, conn.To)))
		}
	}

	// Find the longest path option
	for _, option := range options {
		if len(option) > len(path) {
			path = option
		}
	}

	return path
}
