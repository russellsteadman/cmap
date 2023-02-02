package cmap

import (
	"bytes"
	"errors"
	"regexp"
)

var tabRegex = regexp.MustCompile("\t")
var fourSpacesRegex = regexp.MustCompile("    ")

type Node struct {
	Id          int
	Name        []byte
	Connections []*Connections
}

type Connections struct {
	Id   int
	Name []byte
	From *Node
	To   *Node
}

type CmapInput struct {
	File []byte `json:"file"`
}

func CreateSet(input *CmapInput) ([]byte, error) {
	if input.File == nil || len(input.File) == 0 {
		return nil, errors.New("missing or empty input file")
	}

	tabFileOnly := fourSpacesRegex.ReplaceAll(input.File, []byte("\t"))
	fileLines := bytes.Split(tabFileOnly, []byte("\n"))

	allNodes := []*Node{}

	lastSpaceCount := 0
	spaceCount := 0
	level := 1
	parentNode := make(map[int]*Node)
	parentConn := make(map[int][]byte)
	nodeUniqueNames := make(map[string]*Node)
	connIndex := 0

	for _, line := range fileLines {
		spaceCount = len(tabRegex.FindAll(line, -1))
		line = bytes.TrimSpace(line)

		if len(line) == 0 {
			continue
		} else if spaceCount > lastSpaceCount {
			level += 1
		} else if spaceCount < lastSpaceCount {
			level -= 1
		}

		isNode := level%2 == 1

		if isNode {
			redundantNode := false
			node := &Node{
				Name:        line,
				Connections: []*Connections{},
			}

			if _, ok := nodeUniqueNames[string(line)]; ok {
				node = nodeUniqueNames[string(line)]
				redundantNode = true
			} else {
				nodeUniqueNames[string(line)] = node
			}

			parentNode[level] = node

			if level > 1 {
				// Must create two connections, one for each direction
				connIndex += 1
				conn := &Connections{
					Id:   connIndex,
					Name: []byte(parentConn[level-1]),
					From: parentNode[level-2],
					To:   node,
				}

				node.Connections = append(node.Connections, conn)

				if parentNode[level-2] != nil {
					parentNode[level-2].Connections = append(parentNode[level-2].Connections, conn)
				}
			}

			if !redundantNode {
				allNodes = append(allNodes, node)
			}
		} else {
			parentConn[level] = line
		}

		lastSpaceCount = spaceCount
	}

	for i, node := range allNodes {
		node.Id = i
	}

	for i, node := range allNodes {
		print("Node ", string(node.Name), " ", i, " has ", len(node.Connections), " connections\n")
	}

	print("There are ", len(allNodes), " nodes\n")

	output := []byte("word,count\n")

	return output, nil
}
