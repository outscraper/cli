# Outscraper Businesses Starter

This template shows how to fetch business records from the Outscraper Business Data API.

## Setup

```bash
npm install
cp .env.example .env
```

Set `OUTSCRAPER_API_KEY` in `.env`, then run:

```bash
npm start -- --country US --cities "New York" --types "restaurant"
```

You can also pass a query, but structured filters are usually more reliable:

```bash
node businesses-list.js --query "restaurants in New York"
```
