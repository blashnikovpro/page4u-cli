# page4u-cli

Deploy and manage landing pages from your terminal. Built-in lead tracking, analytics, and WhatsApp integration.

```bash
npm install -g page4u-cli
```

## Quick Start

```bash
# Authenticate with your API key
page4u login

# Deploy a landing page
page4u deploy ./my-page.html --name my-business

# ✓ Page deployed!
#   URL:  https://page4u.ai/pages/my-business
#   Slug: my-business
```

Get your API key at [page4u.ai/dashboard/settings](https://page4u.ai/dashboard/settings).

## Commands

### `page4u deploy <path>`

Deploy an HTML file or an entire directory (auto-zipped).

```bash
# Single HTML file
page4u deploy index.html

# Directory (zips automatically, finds index.html)
page4u deploy ./my-site/

# With options
page4u deploy ./site --name bakery --locale he --whatsapp 972501234567
```

| Option | Description |
|--------|-------------|
| `--name <slug>` | Custom URL slug (auto-generated if omitted) |
| `--locale <he\|en>` | Page language, default: `he` |
| `--whatsapp <phone>` | WhatsApp number for contact button |

### `page4u list`

View all your deployed pages.

```bash
page4u list
page4u list --status published
page4u list --json              # JSON output for scripting
```

### `page4u leads <slug>`

View leads captured from a page's contact form.

```bash
page4u leads my-business
page4u leads my-business --limit 100 --json
```

### `page4u analytics <slug>`

View page event analytics — views, clicks, form submissions.

```bash
page4u analytics my-business
page4u analytics my-business --from 2025-01-01 --to 2025-01-31

# ℹ Analytics for "my-business" (2025-01-01 to 2025-01-31)
#
#   Total Events     1,247
#   Page Views       892
#   Button Clicks    156
#   WhatsApp Clicks  89
#   Phone Clicks     42
#   Email Clicks     18
#   Form Submits     50
```

### `page4u delete <slug>`

Delete a deployed page (with confirmation).

```bash
page4u delete old-page
page4u delete old-page --force   # Skip confirmation
```

### `page4u login`

```bash
page4u login                         # Interactive prompt
page4u login --key p4u_abc123...     # Non-interactive (CI/CD)
page4u login --api-url https://...   # Custom API endpoint
```

### `page4u whoami`

Check your authentication status.

### `page4u logout`

Remove stored credentials from `~/.page4u/config.json`.

## CI/CD

Use environment variables for automation pipelines:

```bash
export PAGE4U_API_KEY=p4u_your_key_here
export PAGE4U_API_URL=https://page4u.ai  # optional

page4u deploy ./dist --name my-site
```

## Configuration

Credentials are stored in `~/.page4u/config.json` with `600` permissions (owner-only read/write).

Environment variables `PAGE4U_API_KEY` and `PAGE4U_API_URL` override the config file.

## Requirements

- Node.js >= 18

## License

MIT
