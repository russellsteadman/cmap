//go:build js
// +build js

package main

import (
	"encoding/json"
	"syscall/js"

	"github.com/russellsteadman/cmap/internal/cmap"
)

func sendData(data interface{}) string {
	jsonText, err := json.Marshal(struct {
		Error   bool        `json:"error"`
		Version string      `json:"version"`
		Data    interface{} `json:"data"`
	}{false, cmap.ToolVersion, data})
	if err != nil {
		return sendError(err.Error())
	}
	return string(jsonText)
}

func sendError(text string) string {
	jsonText, err := json.Marshal(struct {
		Error   bool   `json:"error"`
		Version string `json:"version"`
		Message string `json:"message"`
	}{true, cmap.ToolVersion, text})
	if err != nil {
		return "{\"error\":true,\"version\":\"" + cmap.ToolVersion + "\",\"message\":\"Unable to encode error\"}"
	}
	return string(jsonText)
}

func main() {
	js.Global().Set("gradecmap", js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		if len(args) != 1 {
			return sendError("Invalid number of arguments")
		}

		rawInput := args[0].String()

		input := &cmap.CmapInput{}
		err := json.Unmarshal([]byte(rawInput), input)
		if err != nil {
			return sendError("Unable to decode input")
		}

		cmap, err := cmap.GradeMap(input)
		if err != nil {
			return sendError(err.Error())
		}

		return sendData(cmap)
	}))

	<-make(chan bool)
}
