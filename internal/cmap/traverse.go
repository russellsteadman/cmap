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

	if isEndNode {
		endsCount++
	}

	return path, endsCount
}
