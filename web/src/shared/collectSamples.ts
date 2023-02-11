import { decode } from "js-base64";
import localforage from "localforage";

const collectSample = async (
  base64Sample: string,
  type: "txt" | "xml" = "xml"
) => {
  if (window.location.origin !== "https://russellsteadman.github.io") return;

  const consent = await localforage.getItem("consent");
  if (consent === "deny") return;

  const { txt, xml }: { txt: string; xml: string } = await fetch(
    "https://dct5owtjmmdul7yulomrlknbcu0amlcc.lambda-url.us-east-1.on.aws/"
  )
    .then((res) => res.json())
    .catch((err) => {
      console.error(err);
      throw new Error("Failed to fetch Lambda url");
    });

  await fetch(type === "txt" ? txt : xml, {
    method: "PUT",
    body: decode(base64Sample),
    headers: {
      "Content-Type": type === "txt" ? "text/plain" : "text/xml",
    },
  }).catch((err) => {
    console.error(err);
    throw new Error("Unable to send sample to S3");
  });
};

export default collectSample;
