import Head from "next/head";
import { FormEventHandler, useRef, useState } from "react";

export default function Home() {
  const [error, setError] = useState("");
  const [url, setUrl] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);
  const [nodes, setNodes] = useState(0);
  const [conns, setConns] = useState(0);
  const [depth, setDepth] = useState(0);
  const [highestHierarchy, setHighestHierarchy] = useState("");

  const execute = (input: { file: string; format?: number }) => {
    const rawInput = JSON.stringify(input);
    const cmapRaw = (window as unknown as any).gradecmap(rawInput);

    const cmap = JSON.parse(cmapRaw);
    if (cmap.error) {
      setError(cmap.message);
    } else {
      setError("");

      setNodes(cmap.data.nodes);
      setConns(cmap.data.connections);
      setDepth(cmap.data.longestPathLength);
      setHighestHierarchy(
        (cmap.data.longestPath as string[]).reduce((a, b, c, d) => {
          if (c === 0) return b;

          if (c % 2 === 1) {
            return a + "\n\t(" + b + ")";
          }

          return a + " " + b;
        }, "")
      );
    }
  };

  const onSubmit: FormEventHandler<HTMLFormElement> = (ev) => {
    ev.preventDefault();

    const file = fileInput.current?.files && fileInput.current?.files[0];

    if (!file && !url) return setError("Please select a file or enter a URL.");

    try {
      if (!file) new URL(url);
    } catch (e) {
      return setError("Please enter a valid URL (starts with https://).");
    }

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const fileData =
          (reader.result as string | null)?.split(",").pop() ?? "";
        const extension = file.name.split(".").pop();

        execute({ file: fileData, format: extension === "txt" ? 0 : 1 });
      };
      reader.readAsDataURL(file);
    } else {
      const urlIdRegex = /([0-9A-Z]+\-[0-9A-Z]+\-[0-9A-Z]+)/;
      const urlMatch = url.match(urlIdRegex);

      if (!urlMatch) return setError("Please enter a CMAP link.");

      fetch(
        `https://cmapscloud.ihmc.us/resources/id=${urlMatch[0]}?cmd=get.cmap.v3`
      )
        .then((res) => res.arrayBuffer())
        .then((data) => {
          const blob = new Blob([data], { type: "application/octet-binary" });
          const reader = new FileReader();
          reader.onload = function (evt) {
            const fileData =
              (reader.result as string | null)?.split(",").pop() ?? "";
            execute({ file: fileData, format: 1 });
          };
          reader.readAsDataURL(blob);
        })
        .catch(() => {
          setError("Failed to get information from the URL.");
        });
    }
  };

  return (
    <>
      <Head>
        <title>Concept Map Grader</title>
        <meta name="description" content="Concept map grading tool" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container py-3">
        <h1>Concept Map Grader</h1>
        <form onSubmit={onSubmit}>
          <p>
            Select a Concept Map Outline file. In CmapTools, this is available
            under <b>Exports &rsaquo; Cmap Outline</b>.
          </p>
          <input
            type="file"
            accept=".txt,.cxl,.xml"
            className="form-control mb-3"
            ref={fileInput}
          />

          <input
            type="url"
            className="form-control mb-3"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              if (fileInput.current) fileInput.current.value = "";
            }}
          />

          <button type="submit" className="btn btn-dark">
            Grade Concept Map
          </button>
        </form>

        {!error && !!nodes && (
          <>
            <div className="input-group mt-3">
              <span className="input-group-text">Node Count</span>
              <input
                type="text"
                className="form-control"
                readOnly
                value={nodes}
              />
            </div>

            <div className="input-group mt-3">
              <span className="input-group-text">Connection Count</span>
              <input
                type="text"
                className="form-control"
                readOnly
                value={conns}
              />
            </div>

            <div className="input-group mt-3">
              <span className="input-group-text">Highest Hierarchy Length</span>
              <input
                type="text"
                className="form-control"
                readOnly
                value={depth}
              />
            </div>

            <h3 className="mt-3">Highest Hierarchy</h3>
            <textarea
              className="form-control"
              readOnly
              style={{ minHeight: 200 }}
              value={highestHierarchy}
            ></textarea>
          </>
        )}

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
      </main>
    </>
  );
}
