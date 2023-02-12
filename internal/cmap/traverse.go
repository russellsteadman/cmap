package cmap

// Recursive descent to find longest path
func traverse(path []*Node) ([]*Node, int) {
	// Get the last node in the path
	node := path[len(path)-1]

	// Find all possible paths from the current node
	options := [][]*Node{}
	isEndNode := true
	endsCount := 0
	for _, conn := range node.Connections {
		if conn.From == node {
			// Check if the node is already in the path to avoid loops
			isAlreadyInPath := false
			for _, nodeInPath := range path {
				if nodeInPath == conn.To {
					isAlreadyInPath = true
					break
				}
			}

			// If the node is already in the path, skip it
			if isAlreadyInPath {
				// TODO: Should this be counted as an end node?
				continue
			}

			// If the node is not already in the path, add it to the path and continue
			isEndNode = false
			pathOption, endsVisited := traverse(append(path, conn.To))
			endsCount += endsVisited
			options = append(options, pathOption)
		}
	}

	// Find the longest path option
	for _, option := range options {
		if len(option) > len(path) {
			path = option
		}
	}

	// If the node is an end node, increment the end node count
	if isEndNode {
		endsCount++
	}

	// Return the longest path and the end node count
	return path, endsCount
}
