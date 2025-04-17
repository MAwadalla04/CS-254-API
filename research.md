# Technical Research: Building a Full-Stack Serverless App with Cloudflare

This document explores the architectural decisions and technical concepts used in creating a serverless, edge-deployed web application with Cloudflare’s suite of tools: **Pages**, **Workers**, and **D1**.

---

## 1. Edge Computing and Serverless Architecture

**Edge computing** refers to executing logic geographically closer to the end user, reducing latency. Cloudflare Workers provide a **JavaScript V8 isolate-based runtime** that executes scripts at over 300+ data centers globally.

### Benefits:
- Ultra-low latency response time
- High scalability (no cold starts)
- Built-in isolation (sandboxed per request)

---

## 2. Cloudflare Workers

Cloudflare Workers are deployed using **Wrangler**, a CLI tool. They use a fetch-based API model similar to the standard Web API, which enables writing backend logic using native browser-style APIs.

### Key Concepts:
- **`fetch(request)`**: Entry point for all requests
- **Environment Bindings**: D1 databases, KV, and secrets can be injected via `wrangler.toml`
- **Durable Objects**: Not used in this project, but designed for consistent stateful coordination

---

## 3. D1 SQL: Serverless SQLite

D1 is Cloudflare’s serverless SQL database built on **SQLite** and distributed at the edge. While still in beta, it provides transactional SQL capabilities that can be queried within Workers.

### Why D1?
- Serverless: No setup, provisioning, or connection pooling
- Compatible with SQL syntax and SQLite tools
- Integrated with Worker environment bindings

### Limitations (as of 2025):
- Writes are slower than reads due to replication consistency
- Size and query limits still apply for production workloads
- Not as performant for large-scale analytical queries

---

## 4. Cloudflare Pages

Cloudflare Pages provides static hosting with Git integration. It’s optimized for JAMstack and can integrate seamlessly with Workers through [Functions](https://developers.cloudflare.com/pages/functions/) or traditional Worker routes.

### Features:
- Automatic builds from GitHub
- Edge routing
- Asset caching
- Free SSL + CDN

---

## 5. Project Architecture

```text
   [User]
     ↓
 [Cloudflare Pages]
     ↓
 [Frontend JS/HTML/CSS]
     ↓           ↘
 [POST /api/comment]  [GET /api/count]
     ↓                  ↓
 [Cloudflare Worker]
     ↓
 [D1 SQL: comments, site_visits]
