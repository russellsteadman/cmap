package cmap

import (
	"bytes"
	"encoding/xml"
	"errors"
	"html"
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
	allNodes := []*Node{}

	// Text format
	if input.Format == 0 {
		// Split file into lines
		fileLines := bytes.Split(bytes.ReplaceAll(input.File, []byte("    "), []byte("\t")), []byte("\n"))

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
	} else if input.Format == 1 {
		// XML format
		xmlFormat := &xmlCmap{}
		err := xml.Unmarshal(input.File, &xmlFormat)
		if err != nil {
			return nil, err
		}

		// Create a list of all nodes
		allNodes = make([]*Node, len(xmlFormat.Map.ConceptList.Concepts))
		nodeIdMap := make(map[string]*Node)
		linkingPhraseIdMap := make(map[string]string)

		// Create a node for each concept
		for i, concept := range xmlFormat.Map.ConceptList.Concepts {
			node := &Node{
				Id:          i,
				Name:        []byte(concept.Label),
				Connections: []*Connections{},
			}

			allNodes[i] = node
			nodeIdMap[concept.Id] = node
		}

		// Create a map entry for each linking phrase
		for _, linkingPhrase := range xmlFormat.Map.LinkingPhraseList.LinkingPhrases {
			linkingPhraseIdMap[linkingPhrase.Id] = linkingPhrase.Label
		}

		// <connection> elements denote both connections and linking phrases
		connCollapsed := []*xmlConnectionCollapsed{}
		linkingPhraseParentMap := make(map[string][]string)
		for _, connection := range xmlFormat.Map.ConnectionList.Connections {
			if _, ok := linkingPhraseIdMap[connection.To]; ok {
				linkingPhraseParentMap[connection.To] = append(linkingPhraseParentMap[connection.To], connection.From)
			}
		}

		for _, connection := range xmlFormat.Map.ConnectionList.Connections {
			if _, ok := linkingPhraseParentMap[connection.From]; ok {
				for _, parent := range linkingPhraseParentMap[connection.From] {
					connCol := &xmlConnectionCollapsed{}
					connCol.From = parent
					connCol.To = connection.To
					connCol.Label = []byte(html.UnescapeString(linkingPhraseIdMap[connection.From]))
					connCollapsed = append(connCollapsed, connCol)
				}
			}
		}

		// Create a connection for each connection
		for i, connCol := range connCollapsed {
			conn := &Connections{
				Id:   i,
				Name: connCol.Label,
				From: nodeIdMap[connCol.From],
				To:   nodeIdMap[connCol.To],
			}

			// Add the connection to the current node and the parent node
			conn.From.Connections = append(conn.From.Connections, conn)
			conn.To.Connections = append(conn.To.Connections, conn)
		}

	} else {
		return nil, errors.New("invalid format")
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
