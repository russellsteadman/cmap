package cmap

import (
	"encoding/xml"
	"html"
)

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
