import initializeGo from "@/shared/goInit";
import Head from "next/head";
import { FormEventHandler, useEffect, useRef, useState } from "react";
import {
  Container,
  Button,
  TextField,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  AlertTitle,
  Typography,
} from "@mui/material";
import GradingIcon from "@mui/icons-material/Grading";
import WorkspacesIcon from "@mui/icons-material/Workspaces";
import LandscapeIcon from "@mui/icons-material/Landscape";
import CalculateIcon from "@mui/icons-material/Calculate";

type CmapOutput = {
  nc: number;
  nl: number;
  hh: number;
  nup: number;
  nct: number;
  longestPath: string[];
};

export default function Home() {
  const [error, setError] = useState("");
  const [url, setUrl] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);
  const [out, setOut] = useState<CmapOutput | undefined>();
  const [loading, setLoading] = useState(true);

  const execute = (input: { file: string; format?: number }) => {
    const rawInput = JSON.stringify(input);
    const cmapRaw = (window as unknown as any).gradecmap(rawInput);

    const cmap = JSON.parse(cmapRaw);
    if (cmap.error) {
      setError(cmap.message);
    } else {
      setError("");
      setOut(cmap.data);
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

  useEffect(() => {
    let attached = true;

    initializeGo().then(() => {
      if (attached) setLoading(false);
    });

    return () => {
      attached = false;
    };
  }, []);

  return (
    <>
      <Head>
        <title>Concept Map Grader</title>
        <meta name="description" content="Concept map grading tool" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <Container sx={{ py: 3 }}>
          <h1>Concept Map Grader</h1>

          <p>
            You can use either the CmapTools desktop app or the CmapCloud web
            app to check your score. For desktop app users, select{" "}
            <b>Export &gt; Cmap Outline</b>. For web app users, select{" "}
            <b>Export to CXL</b> on the left-hand side. Alternatively, web app
            users can click <b>Open in Cmap Viewer</b> and provide the url
            without downloading anything.
          </p>

          <Paper sx={{ py: 2, mb: 2 }}>
            <Container>
              <form onSubmit={onSubmit}>
                <label htmlFor="file"></label>
                <TextField
                  type="file"
                  fullWidth
                  inputProps={{
                    accept: ".txt,.cxl,.xml",
                  }}
                  inputRef={fileInput}
                  id="file"
                  onChange={(e) => {
                    const target = e.target as HTMLInputElement;
                    if (target.files && target.files[0]) {
                      setUrl("");
                    }
                  }}
                  sx={{ my: 2 }}
                  label={
                    <>
                      <code>.cxl</code> file or Concept Map Outline{" "}
                      <code>.txt</code> file
                    </>
                  }
                  InputLabelProps={{ shrink: true }}
                />

                <TextField
                  type="url"
                  value={url}
                  placeholder="https://cmapscloud.ihmc.us/..."
                  onChange={(e) => {
                    setUrl(e.target.value);
                    if (fileInput.current) fileInput.current.value = "";
                  }}
                  fullWidth
                  label="CmapCloud Concept Map URL"
                  sx={{ my: 2 }}
                />

                <Button
                  variant="contained"
                  type="submit"
                  disabled={loading}
                  startIcon={<GradingIcon />}
                  sx={{ mt: 2 }}
                >
                  Grade Concept Map
                </Button>
              </form>
            </Container>
          </Paper>

          {!error && !!out && (
            <>
              <hr />

              <h2>Results</h2>

              <Paper sx={{ py: 2, mb: 2 }}>
                <Container>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <WorkspacesIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={`Number of Concepts (NC): ${out.nc}`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <LandscapeIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={`Highest Hierarchy (HH): ${out.hh}`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CalculateIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={`NC + 5(HH): ${out.nc + 5 * out.hh}`}
                      />
                    </ListItem>
                  </List>

                  <TextField
                    label="Highest Hierarchy"
                    multiline
                    inputProps={{ readOnly: true }}
                    fullWidth
                    sx={{ my: 2 }}
                    minRows={4}
                    value={out.longestPath.reduce((a, b, c, d) => {
                      if (c === 0) return b;

                      if (c % 2 === 1) {
                        return a + "\n\t(" + b + ")";
                      }

                      return a + " " + b;
                    }, "")}
                  />
                </Container>
              </Paper>
            </>
          )}

          {error && (
            <Alert severity="error">
              <AlertTitle>Error</AlertTitle>
              {error}
            </Alert>
          )}

          <Typography variant="body2" sx={{ mb: 1 }}>
            <b>Privacy Notice:</b> This tool collects anonymous data including:
            telemetry, usage analytics, concept map summary statistics, and, if
            voluntarily allowed, concept map data. This data is used to improve
            the tool, drive research, and to provide a better user experience.
            This tool does not intentionally collect any personally identifiable
            information.
          </Typography>

          <Typography variant="body2" sx={{ mb: 1 }}>
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
          </Typography>

          <Typography variant="body2">
            Copyright &copy; 2023 The Ohio State University. See{" "}
            <a
              href="https://github.com/russellsteadman/cmap/blob/main/LICENSE"
              target="_blank"
              rel="noreferrer"
            >
              LICENSE
            </a>{" "}
            file.
          </Typography>
        </Container>
      </main>
    </>
  );
}
