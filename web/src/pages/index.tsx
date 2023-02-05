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
      </Head>
      <main className="container py-3">
        <h1>Concept Map Grader</h1>

        <p>
          You can use either the CmapTools desktop app or the CmapCloud web app
          to check your score. For desktop app users, select{" "}
          <b>Export &gt; Cmap Outline</b>. For web app users, select{" "}
          <b>Export to CXL</b> on the left-hand side. Alternatively, web app
          users can click <b>Open in Cmap Viewer</b> and provide the url without
          downloading anything.
        </p>

        <form onSubmit={onSubmit}>
          <label htmlFor="file">
            <code>.cxl</code> file or Concept Map Outline <code>.txt</code> file
          </label>
          <input
            type="file"
            accept=".txt,.cxl,.xml"
            className="form-control mb-3"
            ref={fileInput}
            id="file"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setUrl("");
              }
            }}
          />

          <label htmlFor="url">CmapCloud Concept Map URL</label>
          <input
            type="url"
            className="form-control mb-3"
            value={url}
            placeholder="https://cmapscloud.ihmc.us/..."
            id="url"
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
            <hr />

            <h3>Results</h3>
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

            <h4 className="mt-3">Highest Hierarchy</h4>
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

        <p className="text-muted small mt-3">
          Privacy Notice: Your concept map information does <b>not</b> leave
          your device. Clicking <i>Grade Concept Map</i> will not submit your
          concept map for grading. If you use the CmapCloud URL option, the
          concept map is downloaded to your device and then graded.
        </p>

        <p className="text-muted small mt-3">
          Please submit{" "}
          <a
            href="https://github.com/russellsteadman/cmap/issues/new"
            target="_blank"
            rel="noreferrer"
          >
            bugs and accessibility issues
          </a>{" "}
          if you find any. This requires a GitHub account, which is free and
          easy to set up.
        </p>

        <p className="text-muted small">
          Copyright &copy; 2023 The Ohio State University. See{" "}
          <a
            href="https://github.com/russellsteadman/cmap/blob/main/LICENSE"
            target="_blank"
            rel="noreferrer"
          >
            LICENSE
          </a>{" "}
          file.
        </p>
      </main>
    </>
  );
}
