(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[405],{8312:function(e,t,r){(window.__NEXT_P=window.__NEXT_P||[]).push(["/",function(){return r(5048)}])},5048:function(e,t,r){"use strict";r.r(t),r.d(t,{default:function(){return L}});var n=r(5893);let a=async()=>{let e=new Go,t=await WebAssembly.instantiateStreaming(fetch("cmap.wasm"),e.importObject);e.run(t.instance)};var s=r(9008),c=r.n(s),i=r(7294),o=r(2293),l=r(155),d=r(9520),h=r(8862),u=r(629),m=r(5478),p=r(3321),x=r(8462),f=r(891),y=r(796),b=r(9953),g=r(5568),v=r(2401),j=r(480),E=r(5071),w=r(9053),C=r(6565),Z=r(5221),D=r(341),T=r(9483),A=r.n(T),R=r(2300);let _=async function(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"xml";if("https://russellsteadman.github.io"!==window.location.origin)return;let r=await A().getItem("consent");if("deny"===r)return;let{txt:n,xml:a}=await fetch("https://dct5owtjmmdul7yulomrlknbcu0amlcc.lambda-url.us-east-1.on.aws/").then(e=>e.json()).catch(e=>{throw console.error(e),Error("Failed to fetch Lambda url")}),s=(0,R.Jx)(e);await fetch("txt"===t?n:a,{method:"PUT",body:s=s.replace(/\<res-meta\>(.|\n)*\<\/res-meta\>/gim,"<res-meta><dc:title>REDACTED TITLE</dc:title><dc:format>x-cmap/x-storable</dc:format><dc:creator><vcard:FN>REDACTED NAME</vcard:FN><vcard:EMAIL>redacted@example.com</vcard:EMAIL><vcard:Org><vcard:Orgname>REDACTED ORG</vcard:Orgname></vcard:Org></dc:creator><dc:contributor><vcard:FN>REDACTED NAME</vcard:FN><vcard:EMAIL>redacted@example.com</vcard:EMAIL><vcard:Org><vcard:Orgname>REDACTED ORG</vcard:Orgname></vcard:Org></dc:contributor><dc:language>en</dc:language><dc:extent>9999 bytes</dc:extent><dc:source>cmap:1REDACTED-REDACTE-D:uid=00000000-0000-0000-0000-000000000000,ou=users,dc=cmapcloud,dc=ihmc,dc=us:1REDACTED-REDACTE-D</dc:source><dc:identifier>https://cmapscloud.ihmc.us:443/id=1REDACTED-REDACTE-D/REDACTED.cmap?sid=1REDACTED-REDACTE-D</dc:identifier><dc:publisher>REDACTED PUB</dc:publisher><dcterms:modified>2023-01-01T01:00:00-00:00</dcterms:modified><dcterms:created>2023-01-01T01:00:00-00:00</dcterms:created></res-meta>"),headers:{"Content-Type":"txt"===t?"text/plain":"text/xml"}}).catch(e=>{throw console.error(e),Error("Unable to send sample to S3")})},O=(e,t)=>{try{gtag("event","interaction",{interaction_type:e,message:t})}catch(e){console.error("Unable to log event to Google Analytics",e)}},N=(e,t)=>{try{gtag("event","summary_stats",{number_concepts:e,highest_hierarchy:t})}catch(e){console.error("Unable to log event to Google Analytics",e)}};function L(){let[e,t]=(0,i.useState)(""),[r,s]=(0,i.useState)(""),T=(0,i.useRef)(null),[R,L]=(0,i.useState)(),[P,k]=(0,i.useState)(!0),[S,F]=(0,i.useState)(!0);(0,i.useEffect)(()=>{A().getItem("consent").then(e=>{"deny"===e&&F(!1)})},[]);let I=async()=>{let e=await A().getItem("consent")==="deny";e?(await A().setItem("consent","allow"),F(!0),O("consent_accept")):(await A().setItem("consent","deny"),F(!1),O("consent_reject"))},U=e=>{_(e.file,1===e.format?"xml":"txt");let r=JSON.stringify(e),n=window.gradecmap(r),a=JSON.parse(n);a.error?(t(a.message),O("grade_failure",a.message)):(t(""),L(a.data),O("grade_success"),N(a.data.nc,a.data.hh))},M=e=>{var n,a;e.preventDefault(),O("grade_click");let s=(null===(n=T.current)||void 0===n?void 0:n.files)&&(null===(a=T.current)||void 0===a?void 0:a.files[0]);if(!s&&!r)return t("Please select a file or enter a URL.");try{s||new URL(r)}catch(e){return t("Please enter a valid URL (starts with https://).")}if(s){let e=new FileReader;e.onload=()=>{var t,r;let n=null!==(r=null===(t=e.result)||void 0===t?void 0:t.split(",").pop())&&void 0!==r?r:"",a=s.name.split(".").pop();U({file:n,format:"txt"===a?0:1})},e.readAsDataURL(s)}else{let e=r.match(/([0-9A-Z]+\-[0-9A-Z]+\-[0-9A-Z]+)/);if(!e)return t("Please enter a CMAP link.");fetch("https://cmapscloud.ihmc.us/resources/id=".concat(e[0],"?cmd=get.cmap.v3")).then(e=>e.arrayBuffer()).then(e=>{let t=new Blob([e],{type:"application/octet-binary"}),r=new FileReader;r.onload=function(e){var t,n;let a=null!==(n=null===(t=r.result)||void 0===t?void 0:t.split(",").pop())&&void 0!==n?n:"";U({file:a,format:1})},r.readAsDataURL(t)}).catch(e=>{console.error(e),t("Failed to get information from the URL.")})}};return(0,i.useEffect)(()=>{let e=!0;return a().then(()=>{e&&k(!1)}),()=>{e=!1}},[]),(0,n.jsxs)(n.Fragment,{children:[(0,n.jsxs)(c(),{children:[(0,n.jsx)("title",{children:"Concept Map Grader"}),(0,n.jsx)("meta",{name:"description",content:"Concept map grading tool"}),(0,n.jsx)("meta",{name:"viewport",content:"width=device-width, initial-scale=1"})]}),(0,n.jsxs)("main",{children:[(0,n.jsx)(o.Z,{position:"static",children:(0,n.jsx)(l.Z,{children:(0,n.jsx)(d.Z,{children:(0,n.jsx)(h.Z,{variant:"h6",component:"h1",children:"Concept Map Grader"})})})}),(0,n.jsxs)(d.Z,{sx:{py:3},children:[(0,n.jsxs)("p",{children:["You can use either the CmapTools desktop app or the CmapCloud web app to check your score. For desktop app users, select"," ",(0,n.jsx)("b",{children:"Export > Cmap Outline"}),". For web app users, select"," ",(0,n.jsx)("b",{children:"Export to CXL"})," on the left-hand side. Alternatively, web app users can click ",(0,n.jsx)("b",{children:"Open in Cmap Viewer"})," and provide the url without downloading anything."]}),(0,n.jsx)(u.Z,{sx:{py:2,mb:2},children:(0,n.jsx)(d.Z,{children:(0,n.jsxs)("form",{onSubmit:M,children:[(0,n.jsx)("label",{htmlFor:"file"}),(0,n.jsx)(m.Z,{type:"file",fullWidth:!0,inputProps:{accept:".txt,.cxl,.xml"},inputRef:T,id:"file",onChange:e=>{let t=e.target;t.files&&t.files[0]&&s("")},sx:{my:2},label:(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)("code",{children:".cxl"})," file or Concept Map Outline"," ",(0,n.jsx)("code",{children:".txt"})," file"]}),InputLabelProps:{shrink:!0}}),(0,n.jsx)(m.Z,{type:"url",value:r,placeholder:"https://cmapscloud.ihmc.us/...",onChange:e=>{s(e.target.value),T.current&&(T.current.value="")},fullWidth:!0,label:"CmapCloud Concept Map URL",sx:{my:2}}),(0,n.jsx)(p.Z,{variant:"contained",type:"submit",disabled:P,startIcon:(0,n.jsx)(w.Z,{}),sx:{mt:2},children:"Grade Concept Map"})]})})}),!e&&!!R&&(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)("hr",{}),(0,n.jsx)("h2",{children:"Results"}),(0,n.jsx)(u.Z,{sx:{py:2,mb:2},children:(0,n.jsxs)(d.Z,{children:[(0,n.jsxs)(x.Z,{children:[(0,n.jsxs)(f.ZP,{children:[(0,n.jsx)(y.Z,{children:(0,n.jsx)(C.Z,{})}),(0,n.jsx)(b.Z,{primary:"Number of Concepts (NC): ".concat(R.nc)})]}),(0,n.jsxs)(f.ZP,{children:[(0,n.jsx)(y.Z,{children:(0,n.jsx)(Z.Z,{})}),(0,n.jsx)(b.Z,{primary:"Highest Hierarchy (HH): ".concat(R.hh)})]}),(0,n.jsxs)(f.ZP,{children:[(0,n.jsx)(y.Z,{children:(0,n.jsx)(D.Z,{})}),(0,n.jsx)(b.Z,{primary:(0,n.jsxs)(n.Fragment,{children:["Simple Score (NC + 5 \xd7 HH):"," ",R.nc+5*R.hh]})})]})]}),(0,n.jsx)(m.Z,{label:"Highest Hierarchy",multiline:!0,inputProps:{readOnly:!0},fullWidth:!0,sx:{my:2},minRows:4,value:R.longestPath.reduce((e,t,r,n)=>0===r?t:r%2==1?e+"\n	("+t+")":e+" "+t,"")})]})})]}),e&&(0,n.jsxs)(g.Z,{severity:"error",children:[(0,n.jsx)(v.Z,{children:"Error"}),e]}),(0,n.jsxs)(h.Z,{variant:"body2",sx:{mb:1},children:[(0,n.jsx)("b",{children:"Limitations of Testing:"})," This tool is intended to work for human-generated concept maps, where the number of concepts is less than 1,000. Excessively large (> 1,000 node) concept maps may cause the tool to run slowly or crash."]}),(0,n.jsxs)(h.Z,{variant:"body2",sx:{mb:1},children:[(0,n.jsx)("b",{children:"Privacy Notice:"})," This tool collects anonymous data including: telemetry, usage analytics, concept map summary statistics, and, if voluntarily allowed, concept map data. This data is used to improve the tool, drive research, and to provide a better user experience. This tool does not intentionally collect any personally identifiable information."]}),(0,n.jsxs)(h.Z,{variant:"body2",children:[(0,n.jsx)("b",{children:"Consent for Data Collection:"})," By using this tool, you voluntarily consent to the collection of data as described above. You can opt-out of data collection of concept maps by unchecking the box below. This will not affect your ability to use the tool."]}),(0,n.jsx)(j.Z,{control:(0,n.jsx)(E.Z,{checked:S,onChange:I}),label:"I consent to donating my concept maps.",componentsProps:{typography:{variant:"body2"}}}),(0,n.jsxs)(h.Z,{variant:"body2",sx:{mb:1},children:["Please submit"," ",(0,n.jsx)("a",{href:"https://github.com/russellsteadman/cmap/issues/new",target:"_blank",rel:"noreferrer",children:"bugs and accessibility issues"})," ","if you find any. This requires a GitHub account, which is free and easy to set up."]}),(0,n.jsxs)(h.Z,{variant:"body2",children:["Copyright \xa9 2023 The Ohio State University. See"," ",(0,n.jsx)("a",{href:"https://github.com/russellsteadman/cmap/blob/main/LICENSE",target:"_blank",rel:"noreferrer",children:"LICENSE"})," ","file."]})]})]})]})}}},function(e){e.O(0,[633,774,888,179],function(){return e(e.s=8312)}),_N_E=e.O()}]);