package cmap

import "bytes"

func parseText(fileText []byte) (nodeList []*Node, err error) {
	// Split file into lines
	fileLines := bytes.Split(bytes.ReplaceAll(fileText, []byte("    "), []byte("\t")), []byte("\n"))

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
				nodeList = append(nodeList, node)
			}
		} else {
			// Set the parent connection for future connections
			parentConn[level] = line
		}
	}

	return nodeList, nil
}
