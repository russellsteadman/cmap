package cmap

import (
	"encoding/xml"
	"html"
)

func parseXML(fileText []byte) (nodeList []*Node, err error) {
	// XML format
	xmlFormat := &xmlCmap{}
	err = xml.Unmarshal(fileText, &xmlFormat)
	if err != nil {
		return nil, err
	}

	// Create a list of all nodes
	nodeList = make([]*Node, len(xmlFormat.Map.ConceptList.Concepts))
	nodeIdMap := make(map[string]*Node)
	linkingPhraseIdMap := make(map[string]string)

	// Create a node for each concept
	for i, concept := range xmlFormat.Map.ConceptList.Concepts {
		node := &Node{
			Id:          i,
			Name:        []byte(concept.Label),
			Connections: []*Connections{},
		}

		nodeList[i] = node
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

	return nodeList, nil
}
