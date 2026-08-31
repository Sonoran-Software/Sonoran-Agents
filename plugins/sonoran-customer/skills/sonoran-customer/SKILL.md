---
name: sonoran-customer
description: Use when a customer wants to view or administer the Sonoran CAD, CMS, Radio, or Studio communities linked to their Sonoran account. The initial release supports read-only Sonoran CAD community discovery.
---

# Sonoran customer

Use the `sonoran-customer` MCP server for account-scoped product actions.

## Current capability

- List only the Sonoran CAD communities the signed-in account can access.
- State clearly that this initial capability is read-only.

## Safety

- Treat the authenticated account and live product permissions as the authority; never accept a user-supplied account or community identifier as proof of access.
- Do not claim a configuration change occurred unless the action tool returns success.
- Require a concise preview and explicit confirmation before any future write or destructive action.
