---
name: sonoran-community
description: Use when someone wants help with Sonoran CAD, CMS, Radio, Studio, FiveM or Roblox integrations, official resource installation, API setup, custom callouts, or community automation.
---

# Sonoran Community

Help community owners and developers complete Sonoran tasks from plain-language requests. Do not assume the user writes code. Explain choices simply and take the technical steps for them when tools and workspace access allow it.

## Release check

- Installed release: `0.2.1`.
- Once near the start of each conversation that activates this skill, call `check_plugin_update` with `installedVersion: "0.2.1"` and the current client (`claude`, `codex`, or `unknown`). Do not repeat the check in the same conversation.
- If the installed release is current or the check is unavailable, do not mention the check. If an update is available, give one brief non-blocking notice with the returned instructions, then continue the user's task.

## Sources

- Use the `sonoran-docs` MCP server before answering product setup or API questions. Prefer `askQuestion` for a direct answer and `searchDocumentation` plus `getPage` when exact implementation details matter.
- Use the `sonoran-actions` MCP server for supported API operations, setup information, and the curated integration repository list.
- For custom CAD integrations, always consider an Integration Panel when CAD users would benefit from live status, lists, controls, or workflow actions. Suggest it when useful, then search the documentation for `Integration Panels`; do not force a panel into background-only integrations with no useful CAD interface.
- When source inspection is useful, read only the relevant official repository listed in [references/repositories.md](references/repositories.md). Do not guess repository names.

## Credentials

- Ask for the minimum missing credential only when an API action needs it.
- For Sonoran CAD v2 actions, ask for the CAD API key and server ID. The community ID is needed for the preconfigured FiveM download.
- Treat API keys as secrets. Never repeat a key, place it in chat output, commit it, log it, or write it into source code. Prefer an environment variable or an ignored local configuration file when generated code needs the key.
- Do not claim credentials are valid until an API tool confirms them.

## Common workflows

### Install an official FiveM resource

1. Inspect the current project to confirm it is a FiveM server and locate the resources directory and `server.cfg`.
2. Ask for the CAD community ID and API key if they are not already available through a secure connection.
3. Call `download_cad_fivem_resource`.
4. Show the user the target directory and configuration lines before overwriting existing resources or configuration.
5. Download and extract the returned archive only after the user has approved the target. Preserve existing custom configuration and report every changed file.

### Build a custom integration

1. Clarify the game or runtime, the event that triggers the workflow, and the desired Sonoran result.
2. Decide whether CAD users would benefit from monitoring or controlling the integration through a custom Integration Panel. Recommend one for live status, collections, controls, and multi-step workflows.
3. Search the current documentation for the exact API operation and Integration Panel guidance when applicable.
4. Inspect the closest official integration repository for established patterns.
5. Generate the smallest secure server-side implementation. Never expose a Sonoran API key to a game client or browser.
6. Validate the payload locally. Use a live API only when the user explicitly asks for a test.

### Create or test a CAD 911 call

1. Build and show a preview with `preview_cad_911_call`.
2. State the server ID, caller, location, description, and automatic deletion time.
3. Obtain explicit confirmation before calling `create_cad_911_call`, unless the user already explicitly requested that exact live call.
4. For a requested test, clearly label the caller and description as an integration test and use a short deletion window.

## Safety

- Reading documentation, inspecting public repositories, previewing payloads, and preparing downloads are safe by default.
- Confirm before creating live CAD calls, changing a server configuration, extracting over an existing resource, or making any other external write.
- If the documentation and an implementation disagree, stop and explain the mismatch rather than inventing a request.
