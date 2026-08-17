# Sonoran Agents

Official plugins and agent workflows for Sonoran CAD, CMS, Radio, and supported game integrations.

## Claude Code

Add the marketplace and install the plugin from inside Claude Code:

```text
/plugin marketplace add Sonoran-Software/Sonoran-Agents
/plugin install sonoran-software@sonoran-software
```

## Codex

Add the marketplace and install the plugin:

```text
codex plugin marketplace add Sonoran-Software/Sonoran-Agents
codex plugin add sonoran-software@sonoran-software
```

Restart the ChatGPT desktop app after installation, then begin a new chat so the plugin's skills and MCP tools are loaded.

## What the plugin can do

- Search current Sonoran product and API documentation.
- Install and configure official game resources.
- Inspect official integration repositories.
- Build custom integrations for Sonoran products.
- Preview and create supported Sonoran CAD API actions with confirmation safeguards.

The plugin connects to the Sonoran documentation MCP and the hosted Sonoran actions MCP. API credentials are requested only when a tool requires them and must never be committed to source control.

## Availability

The GitHub marketplaces in this repository support direct installation in Claude Code and Codex. Public discovery in the universal ChatGPT and Codex plugin directory requires a separate OpenAI submission and review.

## License

This repository is licensed under the [PolyForm Noncommercial License 1.0.0](LICENSE).
