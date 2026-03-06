# Monitoring Agent Usage with OpenTelemetry

Reference: https://github.com/microsoft/vscode-copilot-chat/blob/main/docs/monitoring/agent_monitoring.md

---

## Option 1: File Output (no infra needed)

Add to `.vscode/settings.json`:

```json
{
  "github.copilot.chat.otel.enabled": true,
  "github.copilot.chat.otel.exporterType": "file",
  "github.copilot.chat.otel.outfile": "C:\\Temp\\copilot-otel.jsonl"
}
```

Output is JSON-lines at the specified path. Raw span data with `traceId`/`parentSpanId` for parent-child relationships.

---

## Option 2: Jaeger (visual trace tree)

Requires Docker Desktop running on your workstation.

### First-time setup

```powershell
docker run -d --name jaeger -p 16686:16686 -p 4318:4318 jaegertracing/jaeger:latest
```

- `-d` runs it in the background
- Port `16686` = Jaeger web UI (http://localhost:16686)
- Port `4318` = OTLP HTTP endpoint that Copilot sends traces to

Add to `.vscode/settings.json`:

```json
{
  "github.copilot.chat.otel.enabled": true,
  "github.copilot.chat.otel.otlpEndpoint": "http://localhost:4318"
}
```

### View traces

1. Run any Copilot agent interaction
2. Open http://localhost:16686
3. Select service `copilot-chat` → **Find Traces** → click any trace to see the full span tree

### Start / Stop

Only use `docker run` the **first time**. After that:

```powershell
docker stop jaeger       # stop the container
docker start jaeger      # start it again next time (reuses existing container, no new image)
```

> **Note:** Jaeger's default in-memory storage does not persist traces across restarts. Each `docker start` gives you a clean slate.

### Delete

```powershell
docker stop jaeger                      # stop first
docker rm jaeger                        # remove the container
docker rmi jaegertracing/jaeger:latest  # (optional) remove the downloaded image
```

---

## Option 3: Console (quick debug)

Add to `.vscode/settings.json`:

```json
{
  "github.copilot.chat.otel.enabled": true,
  "github.copilot.chat.otel.exporterType": "console"
}
```

Spans print to VS Code developer console (`Help → Toggle Developer Tools → Console`).

---

## Option 4: Azure Application Insights

Start the OTel Collector:

```powershell
$env:APPLICATIONINSIGHTS_CONNECTION_STRING = "InstrumentationKey=...;IngestionEndpoint=..."
docker compose -f docs/monitoring/docker-compose.yaml up -d
```

Add to `.vscode/settings.json`:

```json
{
  "github.copilot.chat.otel.enabled": true,
  "github.copilot.chat.otel.otlpEndpoint": "http://localhost:4328"
}
```

View in Azure Portal → Application Insights → Transaction search.

---

## Option 5: Langfuse (open-source LLM observability)

```powershell
$env:COPILOT_OTEL_ENABLED = "true"
$env:OTEL_EXPORTER_OTLP_ENDPOINT = "http://localhost:3000/api/public/otel"
$env:OTEL_EXPORTER_OTLP_HEADERS = "Authorization=Basic <base64(public-key:secret-key)>"
$env:COPILOT_OTEL_CAPTURE_CONTENT = "true"
```

Open Langfuse → Traces to see `invoke_agent` traces with nested spans.

---

## Optional: Capture Full Content

By default only metadata is captured (model names, token counts, durations). To include prompts, responses, and tool arguments:

```json
{
  "github.copilot.chat.otel.captureContent": true
}
```

> **Warning**: May include sensitive information. Only enable in trusted environments.

---

## Grafana + Jaeger + Prometheus Dashboards (pierceboggan/copilot-opentelemetry)

Reference: https://github.com/pierceboggan/copilot-opentelemetry

A production-ready accelerator that stands up a full observability stack (OTel Collector → Jaeger + Prometheus + Grafana) with pre-built dashboards for Copilot Chat telemetry. Includes an Azure path (App Insights via Bicep IaC) and a synthetic data seeder for demo purposes.

### Why it matters for this application

This app (`mcaps-copilot-tools`) is a set of MCP servers that Copilot agent mode calls as tools. The OpenTelemetry setup from that repo would let you observe how Copilot interacts with your MCP tools — specifically:

- **Tool Calls by Name** dashboard panel — see which MCP tools (`crm_query`, `get_milestones`, `outlook_search_emails`, etc.) are called most often
- **Agent Invocation Duration** — track how long CRM/Outlook/Teams MCP tool calls take end-to-end
- **LLM Call Duration by Model** — see if model selection affects agent workflow performance
- **Sessions Over Time** — track adoption patterns

In short: this app is the **tool layer** that Copilot calls; that repo is the **observability layer** that tells you how those calls perform, how much they cost, and whether they're being used. It's complementary — not a replacement or dependency.
