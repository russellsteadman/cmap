(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[405],{8312:function(e,t,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/",function(){return n(5048)}])},5048:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return T}});var s=n(5893);let a=async()=>{let e=new Go,t=await WebAssembly.instantiateStreaming(fetch("cmap.wasm"),e.importObject);e.run(t.instance)};var r=n(9008),i=n.n(r),o=n(7294),l=n(2293),c=n(155),d=n(9520),h=n(8862),u=n(629),p=n(5478),m=n(3321),x=n(8462),f=n(891),y=n(796),b=n(9953),j=n(5568),g=n(2401),v=n(480),w=n(5071),Z=n(9053),C=n(6565),_=n(5221),k=n(341),E=n(9483),P=n.n(E),S=n(2300);let L=async function(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"xml";if("https://russellsteadman.github.io"!==window.location.origin)return;let n=await P().getItem("consent");if("deny"===n)return;let{txt:s,xml:a}=await fetch("https://dct5owtjmmdul7yulomrlknbcu0amlcc.lambda-url.us-east-1.on.aws/").then(e=>e.json()).catch(e=>{throw console.error(e),Error("Failed to fetch Lambda url")});await fetch("txt"===t?s:a,{method:"PUT",body:(0,S.Jx)(e),headers:{"Content-Type":"txt"===t?"text/plain":"text/xml"}}).catch(e=>{throw console.error(e),Error("Unable to send sample to S3")})},N=(e,t)=>{try{gtag("event","interaction",{interaction_type:e,message:t})}catch(e){console.error("Unable to log event to Google Analytics",e)}},R=(e,t)=>{try{gtag("event","summary_stats",{number_concepts:e,highest_hierarchy:t})}catch(e){console.error("Unable to log event to Google Analytics",e)}};function T(){let[e,t]=(0,o.useState)(""),[n,r]=(0,o.useState)(""),E=(0,o.useRef)(null),[S,T]=(0,o.useState)(),[U,F]=(0,o.useState)(!0),[A,I]=(0,o.useState)(!0);(0,o.useEffect)(()=>{P().getItem("consent").then(e=>{"deny"===e&&I(!1)})},[]);let O=async()=>{let e=await P().getItem("consent")==="deny";e?(await P().setItem("consent","allow"),I(!0),N("consent_accept")):(await P().setItem("consent","deny"),I(!1),N("consent_reject"))},H=e=>{L(e.file,1===e.format?"xml":"txt");let n=JSON.stringify(e),s=window.gradecmap(n),a=JSON.parse(s);a.error?(t(a.message),N("grade_failure",a.message)):(t(""),T(a.data),N("grade_success"),R(a.data.nc,a.data.hh))},G=e=>{var s,a;e.preventDefault(),N("grade_click");let r=(null===(s=E.current)||void 0===s?void 0:s.files)&&(null===(a=E.current)||void 0===a?void 0:a.files[0]);if(!r&&!n)return t("Please select a file or enter a URL.");try{r||new URL(n)}catch(e){return t("Please enter a valid URL (starts with https://).")}if(r){let e=new FileReader;e.onload=()=>{var t,n;let s=null!==(n=null===(t=e.result)||void 0===t?void 0:t.split(",").pop())&&void 0!==n?n:"",a=r.name.split(".").pop();H({file:s,format:"txt"===a?0:1})},e.readAsDataURL(r)}else{let e=n.match(/([0-9A-Z]+\-[0-9A-Z]+\-[0-9A-Z]+)/);if(!e)return t("Please enter a CMAP link.");fetch("https://cmapscloud.ihmc.us/resources/id=".concat(e[0],"?cmd=get.cmap.v3")).then(e=>e.arrayBuffer()).then(e=>{let t=new Blob([e],{type:"application/octet-binary"}),n=new FileReader;n.onload=function(e){var t,s;let a=null!==(s=null===(t=n.result)||void 0===t?void 0:t.split(",").pop())&&void 0!==s?s:"";H({file:a,format:1})},n.readAsDataURL(t)}).catch(e=>{console.error(e),t("Failed to get information from the URL.")})}};return(0,o.useEffect)(()=>{let e=!0;return a().then(()=>{e&&F(!1)}),()=>{e=!1}},[]),(0,s.jsxs)(s.Fragment,{children:[(0,s.jsxs)(i(),{children:[(0,s.jsx)("title",{children:"Concept Map Grader"}),(0,s.jsx)("meta",{name:"description",content:"Concept map grading tool"}),(0,s.jsx)("meta",{name:"viewport",content:"width=device-width, initial-scale=1"})]}),(0,s.jsxs)("main",{children:[(0,s.jsx)(l.Z,{position:"static",children:(0,s.jsx)(c.Z,{children:(0,s.jsx)(d.Z,{children:(0,s.jsx)(h.Z,{variant:"h6",component:"h1",children:"Concept Map Grader"})})})}),(0,s.jsxs)(d.Z,{sx:{py:3},children:[(0,s.jsxs)("p",{children:["You can use either the CmapTools desktop app or the CmapCloud web app to check your score. For desktop app users, select"," ",(0,s.jsx)("b",{children:"Export > Cmap Outline"}),". For web app users, select"," ",(0,s.jsx)("b",{children:"Export to CXL"})," on the left-hand side. Alternatively, web app users can click ",(0,s.jsx)("b",{children:"Open in Cmap Viewer"})," and provide the url without downloading anything."]}),(0,s.jsx)(u.Z,{sx:{py:2,mb:2},children:(0,s.jsx)(d.Z,{children:(0,s.jsxs)("form",{onSubmit:G,children:[(0,s.jsx)("label",{htmlFor:"file"}),(0,s.jsx)(p.Z,{type:"file",fullWidth:!0,inputProps:{accept:".txt,.cxl,.xml"},inputRef:E,id:"file",onChange:e=>{let t=e.target;t.files&&t.files[0]&&r("")},sx:{my:2},label:(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)("code",{children:".cxl"})," file or Concept Map Outline"," ",(0,s.jsx)("code",{children:".txt"})," file"]}),InputLabelProps:{shrink:!0}}),(0,s.jsx)(p.Z,{type:"url",value:n,placeholder:"https://cmapscloud.ihmc.us/...",onChange:e=>{r(e.target.value),E.current&&(E.current.value="")},fullWidth:!0,label:"CmapCloud Concept Map URL",sx:{my:2}}),(0,s.jsx)(m.Z,{variant:"contained",type:"submit",disabled:U,startIcon:(0,s.jsx)(Z.Z,{}),sx:{mt:2},children:"Grade Concept Map"})]})})}),!e&&!!S&&(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)("hr",{}),(0,s.jsx)("h2",{children:"Results"}),(0,s.jsx)(u.Z,{sx:{py:2,mb:2},children:(0,s.jsxs)(d.Z,{children:[(0,s.jsxs)(x.Z,{children:[(0,s.jsxs)(f.ZP,{children:[(0,s.jsx)(y.Z,{children:(0,s.jsx)(C.Z,{})}),(0,s.jsx)(b.Z,{primary:"Number of Concepts (NC): ".concat(S.nc)})]}),(0,s.jsxs)(f.ZP,{children:[(0,s.jsx)(y.Z,{children:(0,s.jsx)(_.Z,{})}),(0,s.jsx)(b.Z,{primary:"Highest Hierarchy (HH): ".concat(S.hh)})]}),(0,s.jsxs)(f.ZP,{children:[(0,s.jsx)(y.Z,{children:(0,s.jsx)(k.Z,{})}),(0,s.jsx)(b.Z,{primary:(0,s.jsxs)(s.Fragment,{children:["Simple Score (NC + 5 \xd7 HH):"," ",S.nc+5*S.hh]})})]})]}),(0,s.jsx)(p.Z,{label:"Highest Hierarchy",multiline:!0,inputProps:{readOnly:!0},fullWidth:!0,sx:{my:2},minRows:4,value:S.longestPath.reduce((e,t,n,s)=>0===n?t:n%2==1?e+"\n	("+t+")":e+" "+t,"")})]})})]}),e&&(0,s.jsxs)(j.Z,{severity:"error",children:[(0,s.jsx)(g.Z,{children:"Error"}),e]}),(0,s.jsxs)(h.Z,{variant:"body2",sx:{mb:1},children:[(0,s.jsx)("b",{children:"Limitations of Testing:"})," This tool is intended to work for human-generated concept maps, where the number of concepts is less than 1,000. Excessively large (> 1,000 node) concept maps may cause the tool to run slowly or crash."]}),(0,s.jsxs)(h.Z,{variant:"body2",sx:{mb:1},children:[(0,s.jsx)("b",{children:"Privacy Notice:"})," This tool collects anonymous data including: telemetry, usage analytics, concept map summary statistics, and, if voluntarily allowed, concept map data. This data is used to improve the tool, drive research, and to provide a better user experience. This tool does not intentionally collect any personally identifiable information."]}),(0,s.jsxs)(h.Z,{variant:"body2",children:[(0,s.jsx)("b",{children:"Consent for Data Collection:"})," By using this tool, you voluntarily consent to the collection of data as described above. You can opt-out of data collection of concept maps by unchecking the box below. This will not affect your ability to use the tool."]}),(0,s.jsx)(v.Z,{control:(0,s.jsx)(w.Z,{checked:A,onChange:O}),label:"I consent to donating my concept maps.",componentsProps:{typography:{variant:"body2"}}}),(0,s.jsxs)(h.Z,{variant:"body2",sx:{mb:1},children:["Please submit"," ",(0,s.jsx)("a",{href:"https://github.com/russellsteadman/cmap/issues/new",target:"_blank",rel:"noreferrer",children:"bugs and accessibility issues"})," ","if you find any. This requires a GitHub account, which is free and easy to set up."]}),(0,s.jsxs)(h.Z,{variant:"body2",children:["Copyright \xa9 2023 The Ohio State University. See"," ",(0,s.jsx)("a",{href:"https://github.com/russellsteadman/cmap/blob/main/LICENSE",target:"_blank",rel:"noreferrer",children:"LICENSE"})," ","file."]})]})]})]})}}},function(e){e.O(0,[633,774,888,179],function(){return e(e.s=8312)}),_N_E=e.O()}]);