package cmap

import (
	"bytes"
	"errors"
)

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

	fileLines := bytes.Split(bytes.ReplaceAll(input.File, []byte("    "), []byte("\t")), []byte("\n"))

	allNodes := []*Node{}

	level := 1
	parentNode := make(map[int]*Node)
	parentConn := make(map[int][]byte)
	nodeUniqueNames := make(map[string]*Node)
	connIndex := 0

	for _, rawLine := range fileLines {
		level = bytes.Count(rawLine, []byte("\t")) + 1
		print(level, " ")
		line := bytes.TrimSpace(rawLine)

		if len(line) == 0 {
			continue
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

				redundantConn := false
				for _, otherConn := range node.Connections {
					if otherConn.From == conn.From && otherConn.To == conn.To {
						redundantConn = true
						break
					}
				}

				if !redundantConn {
					node.Connections = append(node.Connections, conn)

					if parentNode[level-2] != nil {
						parentNode[level-2].Connections = append(parentNode[level-2].Connections, conn)
					}
				}
			}

			if !redundantNode {
				allNodes = append(allNodes, node)
			}
		} else {
			parentConn[level] = line
		}
	}

	for i, node := range allNodes {
		node.Id = i
	}

	for i, node := range allNodes {
		print("Node ", string(node.Name), " ", i, " has ", len(node.Connections), " connections\n")

		if string(node.Name) == "Rates" {
			for _, conn := range node.Connections {
				print("  ", string(conn.Name), " ", conn.Id, " ", string(conn.From.Name), " ", string(conn.To.Name), "\n")
			}
		}
	}

	print("There are ", len(allNodes), " nodes\n")

	output := []byte("word,count\n")

	return output, nil
}
