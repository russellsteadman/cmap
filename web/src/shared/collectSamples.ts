// This file is used to collect cmap samples from the production site

import { decode } from "js-base64";
import localforage from "localforage";

// Redacted res-meta for the samples
const resMetaRedacted = `<res-meta><dc:title>REDACTED TITLE</dc:title><dc:format>x-cmap/x-storable</dc:format><dc:creator><vcard:FN>REDACTED NAME</vcard:FN><vcard:EMAIL>redacted@example.com</vcard:EMAIL><vcard:Org><vcard:Orgname>REDACTED ORG</vcard:Orgname></vcard:Org></dc:creator><dc:contributor><vcard:FN>REDACTED NAME</vcard:FN><vcard:EMAIL>redacted@example.com</vcard:EMAIL><vcard:Org><vcard:Orgname>REDACTED ORG</vcard:Orgname></vcard:Org></dc:contributor><dc:language>en</dc:language><dc:extent>9999 bytes</dc:extent><dc:source>cmap:1REDACTED-REDACTE-D:uid=00000000-0000-0000-0000-000000000000,ou=users,dc=cmapcloud,dc=ihmc,dc=us:1REDACTED-REDACTE-D</dc:source><dc:identifier>https://cmapscloud.ihmc.us:443/id=1REDACTED-REDACTE-D/REDACTED.cmap?sid=1REDACTED-REDACTE-D</dc:identifier><dc:publisher>REDACTED PUB</dc:publisher><dcterms:modified>2023-01-01T01:00:00-00:00</dcterms:modified><dcterms:created>2023-01-01T01:00:00-00:00</dcterms:created></res-meta>`;

const collectSample = async (
  base64Sample: string,
  type: "txt" | "xml" = "xml"
) => {
  // Only collect samples from the production site
  if (window.location.origin !== "https://russellsteadman.github.io") return;

  // Don't collect samples if the user has denied consent
  const consent = await localforage.getItem("consent");
  if (consent === "deny") return;

  // Fetch the S3 upload url
  const { txt, xml }: { txt: string; xml: string } = await fetch(
    "https://dct5owtjmmdul7yulomrlknbcu0amlcc.lambda-url.us-east-1.on.aws/"
  )
    .then((res) => res.json())
    .catch((err) => {
      console.error(err);
      throw new Error("Failed to fetch Lambda url");
    });

  // Replace the res-meta with a PII redacted version
  let body = decode(base64Sample);
  body = body.replace(/\<res-meta\>(.|\n)*\<\/res-meta\>/gim, resMetaRedacted);

  // Send the sample to S3
  await fetch(type === "txt" ? txt : xml, {
    method: "PUT",
    body,
    headers: {
      "Content-Type": type === "txt" ? "text/plain" : "text/xml",
    },
  }).catch((err) => {
    console.error(err);
    throw new Error("Unable to send sample to S3");
  });
};

export default collectSample;
