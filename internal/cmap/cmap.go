package cmap

import (
	"encoding/xml"
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
	Nodes             int      `json:"nodes"`
	Connections       int      `json:"connections"`
	LongestPathLength int      `json:"longestPathLength"`
	LongestPath       []string `json:"longestPath"`
}

type xmlConnection struct {
	XMLName xml.Name `xml:"connection"`
	Id      string   `xml:"id,attr"`
	From    string   `xml:"from-id,attr"`
	To      string   `xml:"to-id,attr"`
}

type xmlConnectionCollapsed struct {
	From  string
	To    string
	Label []byte
}

type xmlConnectionList struct {
	XMLName     xml.Name        `xml:"connection-list"`
	Connections []xmlConnection `xml:"connection"`
}

type xmlLinkingPhrase struct {
	XMLName  xml.Name `xml:"linking-phrase"`
	Id       string   `xml:"id,attr"`
	Label    string   `xml:"label,attr"`
	ParentId string   `xml:"parent-id,attr"`
}

type xmlLinkingPhraseList struct {
	XMLName        xml.Name           `xml:"linking-phrase-list"`
	LinkingPhrases []xmlLinkingPhrase `xml:"linking-phrase"`
}

type xmlConcept struct {
	XMLName  xml.Name `xml:"concept"`
	Id       string   `xml:"id,attr"`
	Label    string   `xml:"label,attr"`
	ParentId string   `xml:"parent-id,attr"`
}

type xmlConceptList struct {
	XMLName  xml.Name     `xml:"concept-list"`
	Concepts []xmlConcept `xml:"concept"`
}

type xmlMap struct {
	XMLName           xml.Name             `xml:"map"`
	ConceptList       xmlConceptList       `xml:"concept-list"`
	LinkingPhraseList xmlLinkingPhraseList `xml:"linking-phrase-list"`
	ConnectionList    xmlConnectionList    `xml:"connection-list"`
}

type xmlCmap struct {
	XMLName xml.Name `xml:"cmap"`
	Map     xmlMap   `xml:"map"`
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

	// Find all nodes that start a chain and traverse them
	for _, node := range allNodes {
		startsChain := true

		for _, conn := range node.Connections {
			if conn.To == node {
				startsChain = false
			}
		}

		if startsChain {
			nodePath, ends := traverse([]*Node{node})
			if len(nodePath) > len(longestPath) {
				longestPath = nodePath
			}
			log.Println("Ends: ", ends)
		}
	}

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
		Connections:       connCount,
		Nodes:             nodeCount,
		LongestPathLength: len(longestPath),
		LongestPath:       longestPathFormatted,
	}

	return output, nil
}
