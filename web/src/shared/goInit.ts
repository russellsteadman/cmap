// This file is used to initialize the Go runtime and load the wasm file
const initializeGo = async () => {
  const go = new Go();
  const result = await WebAssembly.instantiateStreaming(
    fetch("cmap.wasm"),
    go.importObject
  );
  go.run(result.instance);
};

export default initializeGo;
