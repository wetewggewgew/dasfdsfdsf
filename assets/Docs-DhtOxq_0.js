import{r as p,j as e,z as w,o as v}from"./index-BIdctloV.js";import{P as k}from"./PublicPage-VGOXgMTX.js";import{C as d,P as N,B as c}from"./ui-KiaQ_j4C.js";import{C as S}from"./check-Cpwn2AZT.js";import"./Socials-D6eGPPAe.js";import"./arrow-right-pjV-Q9S-.js";import"./chevron-down-CWUZdks-.js";const u=[["start","Quick start"],["auth","Authentication"],["chat","Model request"],["params","Parameters"],["stream","Streaming"],["fallback","Fallback models"],["attachments","Attachments"],["farm","Farm jobs"],["agents","Agents and webhooks"],["datasets","Datasets"],["errors","Errors"],["limits","Rate limits"],["sdk","Existing SDKs"]],A=["curl","JavaScript","Python"],h={start:{curl:`curl https://api.moreal.ai/v1/messages \\
  -H "Authorization: Bearer $MOREAL_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "openrouter/free",
    "messages": [{"role": "user", "content": "Hello"}]
  }'`,JavaScript:`const res = await fetch("https://api.moreal.ai/v1/messages", {
  method: "POST",
  headers: {
    Authorization: \`Bearer \${process.env.MOREAL_KEY}\`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: "openrouter/free",
    messages: [{ role: "user", content: "Hello" }],
  }),
})

const data = await res.json()
console.log(data.choices[0].message.content)`,Python:`import os, requests

res = requests.post(
    "https://api.moreal.ai/v1/messages",
    headers={"Authorization": f"Bearer {os.environ['MOREAL_KEY']}"},
    json={
        "model": "openrouter/free",
        "messages": [{"role": "user", "content": "Hello"}],
    },
    timeout=60,
)

print(res.json()["choices"][0]["message"]["content"])`},auth:{curl:`# The key goes in the header, never in the query string:
# query strings end up in server logs and browser history
curl https://api.moreal.ai/v1/models \\
  -H "Authorization: Bearer $MOREAL_KEY"`,JavaScript:`// In the browser the key must not be in the bundle.
// Call your own endpoint, and keep the key on the server.
const res = await fetch("/api/ask", {
  method: "POST",
  body: JSON.stringify({ prompt }),
})`,Python:`import os
KEY = os.environ["MOREAL_KEY"]        # from the environment, not from the source

headers = {"Authorization": f"Bearer {KEY}"}`},chat:{curl:`curl https://api.moreal.ai/v1/messages \\
  -H "Authorization: Bearer $MOREAL_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "google/gemma-4-26b-a4b-it:free",
    "system": "Answer briefly, in the language of the question.",
    "messages": [
      {"role": "user", "content": "Why is a composite index faster here?"},
      {"role": "assistant", "content": "Because the first column is filtered on equality."},
      {"role": "user", "content": "And if I also sort by date?"}
    ],
    "temperature": 0.4,
    "max_tokens": 800
  }'`,JavaScript:`const body = {
  model: "google/gemma-4-26b-a4b-it:free",
  system: "Answer briefly, in the language of the question.",
  messages: history.concat({ role: "user", content: question }),
  temperature: 0.4,
  max_tokens: 800,
}

const res = await fetch("https://api.moreal.ai/v1/messages", {
  method: "POST",
  headers: { Authorization: \`Bearer \${key}\`, "Content-Type": "application/json" },
  body: JSON.stringify(body),
})

if (!res.ok) throw new Error(await res.text())
const { choices, usage } = await res.json()`,Python:`body = {
    "model": "google/gemma-4-26b-a4b-it:free",
    "system": "Answer briefly, in the language of the question.",
    "messages": history + [{"role": "user", "content": question}],
    "temperature": 0.4,
    "max_tokens": 800,
}

res = requests.post(URL, headers=headers, json=body, timeout=120)
res.raise_for_status()
answer = res.json()["choices"][0]["message"]["content"]`},stream:{curl:`curl -N https://api.moreal.ai/v1/messages \\
  -H "Authorization: Bearer $MOREAL_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"model":"openrouter/free","stream":true,
       "messages":[{"role":"user","content":"Explain streaming"}]}'`,JavaScript:`const res = await fetch(URL, { method: "POST", headers, body })
const reader = res.body.getReader()
const decoder = new TextDecoder()
let buffer = ""

while (true) {
  const { done, value } = await reader.read()
  if (done) break

  buffer += decoder.decode(value, { stream: true })
  const lines = buffer.split("\\n")
  buffer = lines.pop()                     // the tail may be a half line

  for (const line of lines) {
    if (!line.startsWith("data: ")) continue
    const payload = line.slice(6)
    if (payload === "[DONE]") return
    const piece = JSON.parse(payload).choices[0].delta?.content
    if (piece) process.stdout.write(piece)
  }
}`,Python:`with requests.post(URL, headers=headers, json={**body, "stream": True},
                   stream=True, timeout=300) as res:
    for line in res.iter_lines(decode_unicode=True):
        if not line or not line.startswith("data: "):
            continue
        payload = line[6:]
        if payload == "[DONE]":
            break
        delta = json.loads(payload)["choices"][0]["delta"]
        print(delta.get("content", ""), end="", flush=True)`},fallback:{curl:`# A list instead of one model: the next one is used when the first fails
curl https://api.moreal.ai/v1/messages \\
  -H "Authorization: Bearer $MOREAL_KEY" \\
  -d '{
    "models": [
      "nvidia/nemotron-3-ultra-550b-a55b:free",
      "google/gemma-4-26b-a4b-it:free",
      "openrouter/free"
    ],
    "messages": [{"role": "user", "content": "Summarise this ticket"}]
  }'`,JavaScript:`// Order matters: the first entry is the primary model.
// Keep openrouter/free last — it picks whatever is alive.
const body = {
  models: [primary, ...fallbacks, "openrouter/free"],
  messages,
}

// The answer says which model actually replied
const data = await (await fetch(URL, { method: "POST", headers, body: JSON.stringify(body) })).json()
console.log("answered by", data.model)`,Python:`body = {
    "models": [primary, *fallbacks, "openrouter/free"],
    "messages": messages,
}

data = requests.post(URL, headers=headers, json=body, timeout=120).json()
print("answered by", data["model"])`},attachments:{curl:`curl https://api.moreal.ai/v1/messages \\
  -H "Authorization: Bearer $MOREAL_KEY" \\
  -d '{
    "model": "google/gemma-4-26b-a4b-it:free",
    "messages": [{
      "role": "user",
      "content": [
        {"type": "text", "text": "What part is on the photo?"},
        {"type": "image_url", "image_url": {"url": "data:image/png;base64,iVBORw0..."}}
      ]
    }]
  }'`,JavaScript:`// An image goes inline as a data URL. Check the model reads images first:
// text-only models return 400 on an image part.
const content = [
  { type: "text", text: "What part is on the photo?" },
  { type: "image_url", image_url: { url: dataUrl } },
]

// A PDF goes as a file part
content.push({ type: "file", file: { filename: "spec.pdf", file_data: pdfDataUrl } })`,Python:`import base64

with open("part.png", "rb") as f:
    data_url = "data:image/png;base64," + base64.b64encode(f.read()).decode()

content = [
    {"type": "text", "text": "What part is on the photo?"},
    {"type": "image_url", "image_url": {"url": data_url}},
]`},farm:{curl:`curl https://api.moreal.ai/v1/farm/jobs \\
  -H "Authorization: Bearer $MOREAL_KEY" \\
  -d '{
    "kind": "batch",
    "gpu": "1xL40S",
    "night": true,
    "input": "ds-02",
    "prompt": "Describe the product from the photo in two sentences"
  }'`,JavaScript:`const job = await post("/v1/farm/jobs", {
  kind: "batch",
  gpu: "1xL40S",
  night: true,                 // wait for the low-rate window
  input: datasetId,
  prompt,
})

// Poll until it finishes; a webhook is better for long jobs
let state = job.state
while (state === "queued" || state === "run") {
  await new Promise((r) => setTimeout(r, 5000))
  state = (await get(\`/v1/farm/jobs/\${job.id}\`)).state
}`,Python:`job = post("/v1/farm/jobs", {
    "kind": "batch",
    "gpu": "1xL40S",
    "night": True,
    "input": dataset_id,
    "prompt": prompt,
})

while (state := get(f"/v1/farm/jobs/{job['id']}")["state"]) in ("queued", "run"):
    time.sleep(5)`},agents:{curl:`# Trigger an agent from your own service
curl https://api.moreal.ai/v1/agents/ag-01/run \\
  -H "Authorization: Bearer $MOREAL_KEY" \\
  -d '{"input": {"ticket": 4821}}'`,JavaScript:`// Receiving our webhook. Check the signature before parsing the body,
// answer 200 immediately and do the work in a queue: if you take longer
// than a couple of seconds we assume you are down and retry.
import { createHmac, timingSafeEqual } from "node:crypto"

app.post("/hooks/moreal", (req, res) => {
  const signature = req.header("X-Moreal-Signature")
  const expected = createHmac("sha256", process.env.HOOK_SECRET)
    .update(req.rawBody)
    .digest("hex")

  if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    return res.sendStatus(403)
  }

  res.sendStatus(200)
  queue.push(JSON.parse(req.rawBody))
})`,Python:`import hmac, hashlib

@app.post("/hooks/moreal")
def hook(request):
    expected = hmac.new(SECRET.encode(), request.data, hashlib.sha256).hexdigest()
    if not hmac.compare_digest(request.headers["X-Moreal-Signature"], expected):
        return "", 403

    queue.put(request.json)      # heavy work goes to the queue
    return "", 200`},datasets:{curl:`curl https://api.moreal.ai/v1/datasets \\
  -H "Authorization: Bearer $MOREAL_KEY" \\
  -F "file=@reviews.csv" \\
  -F "name=Marketplace reviews"`,JavaScript:`const form = new FormData()
form.append("file", file)
form.append("name", "Marketplace reviews")

const ds = await fetch("https://api.moreal.ai/v1/datasets", {
  method: "POST",
  headers: { Authorization: \`Bearer \${key}\` },   // no Content-Type: the browser sets the boundary
  body: form,
})`,Python:`with open("reviews.csv", "rb") as f:
    ds = requests.post(
        "https://api.moreal.ai/v1/datasets",
        headers=headers,
        files={"file": f},
        data={"name": "Marketplace reviews"},
    ).json()`},errors:{curl:`{
  "error": {
    "code": 429,
    "type": "rate_limit",
    "message": "Free tier limit reached: 20 requests per minute",
    "retry_after": 37
  }
}`,JavaScript:`async function ask(body, attempt = 0) {
  const res = await fetch(URL, { method: "POST", headers, body: JSON.stringify(body) })
  if (res.ok) return res.json()

  const { error } = await res.json()

  // 429 and 5xx are worth retrying, the rest are not: a wrong key
  // stays wrong however many times you ask
  if ((res.status === 429 || res.status >= 500) && attempt < 4) {
    const wait = error.retry_after ? error.retry_after * 1000 : 2 ** attempt * 1000
    await new Promise((r) => setTimeout(r, wait))
    return ask(body, attempt + 1)
  }

  throw new Error(\`\${error.type}: \${error.message}\`)
}`,Python:`for attempt in range(5):
    res = requests.post(URL, headers=headers, json=body, timeout=120)
    if res.ok:
        break
    err = res.json()["error"]
    if res.status_code == 429 or res.status_code >= 500:
        time.sleep(err.get("retry_after", 2 ** attempt))
        continue
    raise RuntimeError(f"{err['type']}: {err['message']}")`},sdk:{curl:`# The API speaks the OpenAI dialect, so the official clients work.
# Only the base URL changes.
export OPENAI_BASE_URL=https://api.moreal.ai/v1
export OPENAI_API_KEY=$MOREAL_KEY`,JavaScript:`import OpenAI from "openai"

const client = new OpenAI({
  baseURL: "https://api.moreal.ai/v1",
  apiKey: process.env.MOREAL_KEY,
})

const answer = await client.chat.completions.create({
  model: "openrouter/free",
  messages: [{ role: "user", content: "Hello" }],
})`,Python:`from openai import OpenAI

client = OpenAI(base_url="https://api.moreal.ai/v1",
                api_key=os.environ["MOREAL_KEY"])

answer = client.chat.completions.create(
    model="openrouter/free",
    messages=[{"role": "user", "content": "Hello"}],
)`}},f={start:"Create a key in the API keys section. It is shown once — save it right away. Every example below is complete: paste it in and it runs.",auth:"The key identifies the account and carries its limits. Keep one key per integration: if one leaks you revoke it without breaking the rest.",chat:"The request format follows the OpenAI dialect, so any SDK works after changing the base URL. History is sent in full every time — the model has no memory between calls.",params:"Defaults are chosen for a working answer rather than a creative one. Change temperature first; the rest is rarely needed.",stream:"Streaming saves perceived time: the first words appear in 200–400 ms instead of waiting for the whole answer. Save partial text as it arrives — a closed tab should not lose the reply.",fallback:"On OpenRouter the whole chain goes in a single request. With other providers the client walks the list: on a 429 or a missing model it takes the next one.",attachments:"Images and PDFs travel inline as data URLs. Check the model reads images before sending one — a text-only model answers 400.",farm:"A job holds a node for its duration and is billed by the minute. The night flag postpones it to the low-rate window and cuts the price by 55%.",agents:"Three things break webhooks in production: no idempotency, parsing before checking the signature, and slow handlers. All three are covered in the example.",datasets:"A dataset is uploaded once and reused by jobs and chats. CSV, TSV and JSON are parsed on upload: row count and columns are detected automatically.",errors:"Every error carries a machine-readable type and a plain-language message. Show the message to the user as is — it is written for a person.",limits:"Limits are per key, not per account, so one runaway integration cannot starve the rest.",sdk:"Nothing to install from us: the API is OpenAI-compatible. If your language has an OpenAI client, it already works."},E=[["model","string","—","Model identifier. Use models instead for a fallback chain."],["models","string[]","—","Ordered list; the next one answers when the previous fails."],["messages","array","required","Full history. Roles: system, user, assistant."],["system","string","—","Instruction prepended to the conversation."],["temperature","number","0.7","0 for repeatable answers, 1 and above for varied ones."],["max_tokens","number","1024","Upper bound for the answer, not a target length."],["stream","boolean","false","Server-Sent Events instead of one response."],["stop","string[]","—","Up to four sequences that end the answer."],["seed","number","—","Same seed and same input give the same answer where the provider supports it."],["metadata","object","—","Any fields of your own; they come back in the log and the webhook."]],T=[["400","invalid_request","Malformed body, or an image sent to a text-only model"],["401","bad_key","The key is wrong or revoked"],["402","balance","The provider requires a top-up for this model"],["404","no_model","The model left the free tier — refresh the list"],["413","too_large","The attachment exceeds what the model accepts"],["429","rate_limit","Too many requests; retry_after says how long to wait"],["500","internal","Our fault. Retry with backoff"],["502","provider","The provider is down; the fallback chain takes over"]],O=[["Requests per minute","20","600","1,200","2,000+"],["Requests per day","200","unlimited","unlimited","unlimited"],["Tokens per minute","40k","400k","800k","2M+"],["Concurrent farm jobs","—","4","10","40"],["GPU-hours included","—","20","80 pooled","by agreement"],["Seats","1","1","5","unlimited"],["Attachment size","6 MB","12 MB","25 MB","100 MB"],["Dataset storage","1 GB","500 GB","2 TB","20 TB"]];function M({go:n}){const[i,g]=p.useState("JavaScript"),[y,m]=p.useState(null),b=(t,r)=>{var s;(s=navigator.clipboard)==null||s.writeText(r),m(t),setTimeout(()=>m(null),1400),v("Copied")},x=({id:t})=>{var s,a;const r=((s=h[t])==null?void 0:s[i])||((a=h[t])==null?void 0:a.curl);return r?e.jsxs("div",{style:{position:"relative"},children:[e.jsx("pre",{className:"code",children:r}),e.jsx("button",{className:"btn btn-sm code-copy",onClick:()=>b(t,r),children:y===t?e.jsxs(e.Fragment,{children:[e.jsx(S,{size:12})," Copied"]}):e.jsxs(e.Fragment,{children:[e.jsx(w,{size:12})," Copy"]})})]}):null};return e.jsx(k,{go:n,title:"Documentation",lead:"The API speaks the OpenAI dialect: only the address and the key change. Everything needed for an integration is on this page — no sign-up required to read it.",children:e.jsxs("div",{className:"docs",children:[e.jsxs("nav",{className:"docs-nav","aria-label":"Sections",children:[u.map(([t,r])=>e.jsx("a",{href:"#/docs",onClick:s=>{var a;s.preventDefault(),(a=document.getElementById("s-"+t))==null||a.scrollIntoView({behavior:"smooth",block:"start"})},children:r},t)),e.jsx("div",{className:"docs-lang",children:A.map(t=>e.jsx("button",{className:`chip ${i===t?"on":""}`,onClick:()=>g(t),children:t},t))})]}),e.jsxs("div",{className:"docs-body",children:[e.jsxs(d,{children:[e.jsx("h2",{className:"h2",style:{marginBottom:10},children:"Endpoints"}),e.jsx("div",{className:"tbl-wrap",children:e.jsxs("table",{className:"tbl",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Method"}),e.jsx("th",{children:"Path"}),e.jsx("th",{children:"What it does"})]})}),e.jsxs("tbody",{children:[e.jsxs("tr",{children:[e.jsx("td",{className:"mono",children:"POST"}),e.jsx("td",{className:"mono",children:"/v1/messages"}),e.jsx("td",{className:"muted",children:"Ask a model, streaming optional"})]}),e.jsxs("tr",{children:[e.jsx("td",{className:"mono",children:"GET"}),e.jsx("td",{className:"mono",children:"/v1/models"}),e.jsx("td",{className:"muted",children:"Live model list with prices"})]}),e.jsxs("tr",{children:[e.jsx("td",{className:"mono",children:"POST"}),e.jsx("td",{className:"mono",children:"/v1/farm/jobs"}),e.jsx("td",{className:"muted",children:"Queue a job on the farm"})]}),e.jsxs("tr",{children:[e.jsx("td",{className:"mono",children:"GET"}),e.jsx("td",{className:"mono",children:"/v1/farm/jobs/:id"}),e.jsx("td",{className:"muted",children:"Job state and result"})]}),e.jsxs("tr",{children:[e.jsx("td",{className:"mono",children:"GET"}),e.jsx("td",{className:"mono",children:"/v1/farm/nodes"}),e.jsx("td",{className:"muted",children:"Node status"})]}),e.jsxs("tr",{children:[e.jsx("td",{className:"mono",children:"POST"}),e.jsx("td",{className:"mono",children:"/v1/datasets"}),e.jsx("td",{className:"muted",children:"Upload a dataset"})]}),e.jsxs("tr",{children:[e.jsx("td",{className:"mono",children:"POST"}),e.jsx("td",{className:"mono",children:"/v1/agents/:id/run"}),e.jsx("td",{className:"muted",children:"Trigger an agent"})]})]})]})})]}),u.map(([t,r])=>e.jsxs(d,{id:"s-"+t,style:{marginTop:16},children:[e.jsxs("div",{className:"row",style:{marginBottom:10},children:[e.jsx("h2",{className:"h2",style:{margin:0},children:r}),e.jsx("span",{className:"spacer",style:{flex:1}}),h[t]&&e.jsx(N,{tone:"line",children:i})]}),f[t]&&e.jsx("p",{className:"muted",style:{fontSize:13.5,lineHeight:1.7,margin:"0 0 14px"},children:f[t]}),e.jsx(x,{id:t}),t==="params"&&e.jsx("div",{className:"tbl-wrap",children:e.jsxs("table",{className:"tbl",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Field"}),e.jsx("th",{children:"Type"}),e.jsx("th",{children:"Default"}),e.jsx("th",{children:"What it changes"})]})}),e.jsx("tbody",{children:E.map(([s,a,o,l])=>e.jsxs("tr",{children:[e.jsx("td",{className:"mono",children:s}),e.jsx("td",{className:"dim",children:a}),e.jsx("td",{className:"mono dim",children:o}),e.jsx("td",{className:"muted",children:l})]},s))})]})}),t==="errors"&&e.jsx("div",{className:"tbl-wrap",style:{marginTop:14},children:e.jsxs("table",{className:"tbl",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Code"}),e.jsx("th",{children:"Type"}),e.jsx("th",{children:"When it happens"})]})}),e.jsx("tbody",{children:T.map(([s,a,o])=>e.jsxs("tr",{children:[e.jsx("td",{className:"mono",children:s}),e.jsx("td",{className:"mono dim",children:a}),e.jsx("td",{className:"muted",children:o})]},s))})]})}),t==="limits"&&e.jsx("div",{className:"tbl-wrap",children:e.jsxs("table",{className:"tbl",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Limit"}),e.jsx("th",{className:"num",children:"Free"}),e.jsx("th",{className:"num",children:"Pro"}),e.jsx("th",{className:"num",children:"Studio"}),e.jsx("th",{className:"num",children:"Enterprise"})]})}),e.jsx("tbody",{children:O.map(([s,a,o,l,j])=>e.jsxs("tr",{children:[e.jsx("td",{children:s}),e.jsx("td",{className:"num mono",children:a}),e.jsx("td",{className:"num mono",children:o}),e.jsx("td",{className:"num mono",children:l}),e.jsx("td",{className:"num mono",children:j})]},s))})]})})]},t)),e.jsxs(d,{flat:!0,style:{marginTop:16},children:[e.jsx("h2",{className:"h2",style:{marginBottom:8},children:"Anything missing?"}),e.jsx("p",{className:"muted",style:{fontSize:13.5,lineHeight:1.7,margin:"0 0 14px"},children:"Write to docs@moreal.ai and say what you were trying to do. Questions that come up twice end up on this page."}),e.jsxs("div",{className:"row",children:[e.jsx(c,{size:"sm",onClick:()=>n("api"),children:"Create a key"}),e.jsx(c,{size:"sm",onClick:()=>n("models"),children:"Model list"}),e.jsx(c,{size:"sm",onClick:()=>n("status"),children:"Status"})]})]})]})]})})}export{M as default};
