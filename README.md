# Sonoran Agents

Official plugins and agent workflows for Sonoran CAD, CMS, Radio, and supported game integrations.

The repository keeps two distinct products: `sonoran-software` for developers building integrations and `sonoran-customer` for customers administering communities through their Sonoran account.

## Claude Cowork

1. Open **Customize** in the Claude sidebar and select **Plugins**.
2. Select **Add marketplace**.
3. Enter `Sonoran-Software/Sonoran-Agents`.
4. Install the **Sonoran Software** plugin.

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

## Updates

The plugin checks the hosted Sonoran release metadata once per active conversation and only displays a notice when a newer release is available. Claude marketplaces also support background updates.

Force an update in Claude Code:

```text
/plugin marketplace update sonoran-software
/plugin update sonoran-software@sonoran-software
/reload-plugins
```

Force an update in Codex:

```text
codex plugin marketplace upgrade sonoran-software
codex plugin add sonoran-software@sonoran-software
```

Restart Codex or ChatGPT and begin a new conversation after updating.

## Developer plugin

- Search current Sonoran product and API documentation.
- Install and configure official game resources.
- Inspect official integration repositories.
- Build custom integrations for Sonoran products.
- Preview and create supported Sonoran CAD API actions with confirmation safeguards.

It connects to the Sonoran documentation and developer-action MCPs. API credentials are requested only when a tool requires them and must never be committed to source control.

## Customer plugin

The separate customer plugin signs users in with their Sonoran account. Its first release provides read-only discovery of the CAD communities they can access. Administrative tools will require live product permissions and explicit confirmation.

## Availability

The GitHub marketplaces in this repository support direct installation in Claude Cowork, Claude Code, and Codex. Public discovery in the universal ChatGPT and Codex plugin directory requires a separate OpenAI submission and review.

## License

This repository is licensed under the [PolyForm Noncommercial License 1.0.0](LICENSE).
