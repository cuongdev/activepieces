<!-- drk:project-context -->
```markdown
## Tech Stack

- **Language**: TypeScript 5.5
- **Frontend**: React 18, Vite, TailwindCSS 4, Zustand, Radix UI
- **Backend**: Fastify 5, Node.js, TypeORM 0.3
- **Databases**: PostgreSQL 14, Redis 7 (cache/queues via BullMQ)
- **Monorepo**: Turborepo + Bun workspaces
- **Testing**: Vitest (unit), Playwright (E2E)
- **AI**: Vercel AI SDK (multi-provider: Anthropic, OpenAI, Google, Azure)

## Commands

```bash
# Development
bun run dev              # Full stack (frontend + backend + engine + worker)
bun run dev:backend      # Backend only
bun run serve:frontend   # Web only (:4200)
bun run serve:backend    # API only (:3000)

# Testing
bun run test-unit        # Unit tests (Vitest)
bun run test-api         # API integration tests (CE/EE/Cloud)
bun run test:e2e         # Playwright E2E

# Linting
bun run lint-core        # Lint main packages
bun run lint-pieces      # Lint all pieces

# Database
bun run db-migration     # Generate TypeORM migration
bun run check-migrations # Validate schema

# Pieces
bun run create-piece     # Scaffold new piece
bun run build-piece      # Build a piece
```

## Project Structure

```
packages/
  cli/                   # CLI for piece management
  shared/                # Shared types and utilities
  server/
    api/                 # Fastify backend (:3000)
    engine/              # Workflow execution engine
    worker/              # BullMQ job worker
  web/                   # React frontend (:4200)
  pieces/
    framework/           # Piece SDK
    core/                # Built-in pieces (http, webhook, schedule, etc.)
    community/           # 200+ community integrations
  ee/                    # Enterprise edition features
  react-ui/              # Shared React component library
  tests-e2e/             # Playwright tests
deploy/                  # Docker / deployment configs
```

## Code Style & Conventions

- **Formatting**: Prettier (single quotes, defaults)
- **Linting**: ESLint + `@typescript-eslint/recommended`; no `any` (warn), no lodash (use native)
- **Unused imports**: flagged via `unused-imports` plugin; prefix with `_` to suppress
- **Naming**: kebab-case files, PascalCase React components, camelCase services
- **Pieces package names**: `@activepieces/piece-{name}`
- **Tests**: `*.spec.ts` / `*.test.ts`; AAA pattern; Vitest for unit, Playwright for E2E
- **Commits**: Conventional Commits enforced via commitlint + Husky
- **Multi-edition**: `AP_EDITION` env = `ce` | `ee` | `cloud`
```
<!-- /drk:project-context -->

<!-- drk:kit -->
## Active Profile: All Skills

Includes every installed skill, agent, and command

## Skills

- **mobile-design** — Mobile-first design thinking and decision-making for iOS and Android apps
- **seo-fundamentals** — SEO fundamentals, E-E-A-T, Core Web Vitals, and Google algorithm principles.
- **vulnerability-scanner** — Advanced vulnerability analysis principles
- **clean-code** — Pragmatic coding standards - concise, direct, no over-engineering, no unnecessary comments
- **server-management** — Server management principles and decision-making
- **drk-sprint-close**
- **drk-unit-test** — Generate full unit tests for rpm-backend modules
- **database-design** — Database design principles and decision-making
- **systematic-debugging** — 4-phase systematic debugging methodology with root cause analysis and evidence-based verification
- **drk-ci-failure-analysis**
- **web-design-guidelines** — Review UI code for Web Interface Guidelines compliance
- **drk-release-notes**
- **drk-clarify-requirements** — Triggered when an OpenProject work package (Epic, Story, Task, or Bug) lacks sufficient information to proceed
- **behavioral-modes** — AI operational modes (brainstorm, implement, debug, review, teach, ship, orchestrate)
- **powershell-windows** — PowerShell Windows patterns
- **documentation-templates** — Documentation templates and structure guidelines
- **i18n-localization** — Internationalization and localization patterns
- **testing-patterns** — Testing patterns and principles
- **plan-writing** — Structured task planning with clear breakdowns, dependencies, and verification criteria
- **deployment-procedures** — Production deployment principles and decision-making
- **drk-qa-leader** — Full QA workflow for QA Leaders
- **performance-profiling** — Performance profiling principles
- **architecture** — Architectural decision-making framework
- **drk-write-prd** — Creates a complete, Scrum-ready PRD from an OpenProject Epic or Story
- **drk-rootcause-trace** — Traces root cause of production issues by correlating logs from Kibana and EKS with codebase analysis
- **brainstorming** — Socratic questioning protocol + user communication
- **drk-qa-testcase**
- **tdd-workflow** — Test-Driven Development workflow principles
- **webapp-testing** — Web application testing principles
- **intelligent-routing** — Automatic agent selection and intelligent task routing
- **drk-semantic-release** — Automated versioning, changelog generation, and release management using Conventional Commits and semantic-release
- **code-review-checklist** — Code review guidelines covering code quality, security, and best practices.
- **drk-bug-report-analysis** — Analyzes an OpenProject bug report for completeness and quality
- **drk-openproject-bug-fix** — Full automated bug fix workflow for rpm-backend
- **nextjs-react-expert** — React and Next.js performance optimization from Vercel Engineering
- **frontend-design** — Design thinking and decision-making for web UI
- **tailwind-patterns** — Tailwind CSS v4 principles
- **api-patterns** — API design principles and decision-making
- **game-development** — Game development orchestrator
- **red-team-tactics** — Red team tactics principles based on MITRE ATT&CK
- **mcp-builder** — MCP (Model Context Protocol) server building principles
- **nodejs-best-practices** — Node.js development principles and decision-making
- **drk-release-skill** — End-to-end release workflow for any environment (go2, go3, staging, etc.)
- **drk-kibana-workaround**
- **rust-pro** — Master Rust 1.75+ with modern async patterns, advanced type system features, and production-ready systems programming
- **python-patterns** — Python development principles and decision-making
- **drk-notify**
- **geo-fundamentals** — Generative Engine Optimization for AI search engines (ChatGPT, Claude, Perplexity).
- **parallel-agents** — Multi-agent orchestration patterns
- **bash-linux** — Bash/Linux terminal patterns
- **lint-and-validate**
- **app-builder** — Main application building orchestrator
- **drk-commit-message** — Generates a high-quality, semantic-release-compliant git commit message by analyzing staged changes
- **code-gen**

## Agents

- **orchestrator**
- **test-engineer** — Expert in testing, TDD, and test automation. Use for writing tests, improving coverage, debugging…
- **game-developer** — Game development across all platforms (PC, Web, Mobile, VR/AR). Use when building games with Unit…
- **explorer-agent** — Advanced codebase discovery, deep architectural analysis, and proactive research agent. The eyes …
- **debugger** — Expert in systematic debugging, root cause analysis, and crash investigation. Use for complex bug…
- **seo-specialist** — SEO and GEO (Generative Engine Optimization) expert. Handles SEO audits, Core Web Vitals, E-E-A-T…
- **ba-agent**
- **database-architect** — Expert database architect for schema design, query optimization, migrations, and modern serverles…
- **code-archaeologist** — Expert in legacy code, refactoring, and understanding undocumented systems. Use for reading messy…
- **qa-agent**
- **devops-engineer** — Expert in deployment, server management, CI/CD, and production operations. CRITICAL - Use for dep…
- **project-planner** — Smart project planning agent. Breaks down user requests into tasks, plans file structure, determi…
- **product-manager** — Expert in product requirements, user stories, and acceptance criteria. Use for defining features,…
- **security-auditor** — Elite cybersecurity expert. Think like an attacker, defend like an expert. OWASP 2025, supply cha…
- **frontend-specialist** — Senior Frontend Architect who builds maintainable React/Next.js systems with performance-first mi…
- **product-owner** — Strategic facilitator bridging business needs and technical execution. Expert in requirements eli…
- **performance-optimizer** — Expert in performance optimization, profiling, Core Web Vitals, and bundle optimization. Use for …
- **documentation-writer** — Expert in technical documentation. Use ONLY when user explicitly requests documentation (README, …
- **qa-automation-engineer** — Specialist in test automation infrastructure and E2E testing. Focuses on Playwright, Cypress, CI …
- **penetration-tester** — Expert in offensive security, penetration testing, red team operations, and vulnerability exploit…
- **backend-specialist** — Expert backend architect for Node.js, Python, and modern serverless/edge systems. Use for API dev…
- **dev-agent**
- **tl-agent**
- **release-agent**
- **mobile-developer** — Expert in React Native and Flutter mobile development. Use for cross-platform mobile apps, native…

<!-- drk:rule:CLAUDE -->
# DRK Skills — Claude Code Rules

> This file defines how Claude Code behaves in this workspace.

---

## CRITICAL: AGENT & SKILL PROTOCOL

**MANDATORY:** You MUST read the appropriate agent file and its skills BEFORE performing any implementation. This is the highest priority rule.

### Modular Skill Loading

Agent activated → Check frontmatter `skills:` → Read `SKILL.md` (index) → Read specific sections only.

- **Selective Reading:** Do NOT read ALL files in a skill folder. Read `SKILL.md` first, then only read sections matching the user's request.
- **Rule Priority:** P0 (CLAUDE.md) > P1 (Agent `.md`) > P2 (`SKILL.md`). All rules are binding.

### Enforcement

1. When agent is activated: Read Rules → Check Frontmatter → Load SKILL.md → Apply All.
2. Never skip reading agent rules or skill instructions. "Read → Understand → Apply" is mandatory.

---

## REQUEST CLASSIFIER

Before ANY action, classify the request:

| Request Type | Trigger Keywords | Action |
|---|---|---|
| **QUESTION** | "what is", "how does", "explain" | Text response only |
| **SURVEY** | "analyze", "list files", "overview" | Explorer agent, no file changes |
| **SIMPLE CODE** | "fix", "add", "change" (single file) | Inline edit |
| **COMPLEX CODE** | "build", "create", "implement", "refactor" | Plan first, then implement |
| **DESIGN/UI** | "design", "UI", "page", "dashboard" | Use specialist agent + design skills |
| **SLASH CMD** | /create, /orchestrate, /debug | Command-specific flow |

---

## INTELLIGENT AGENT ROUTING

Before responding to ANY code or design request, automatically select the best agent.

### Auto-Selection Protocol

1. **Analyze**: Detect domains (Frontend, Backend, Security, etc.) from user request.
2. **Select Agent**: Choose the most appropriate specialist.
3. **Load Skills**: Read agent's frontmatter `skills:` field, load required skills.
4. **Apply**: Generate response using the selected agent's persona and rules.

### Project Type Routing

| Project Type | Primary Agent | Key Skills |
|---|---|---|
| **MOBILE** (iOS, Android, RN, Flutter) | `mobile-developer` | mobile-design |
| **WEB** (Next.js, React) | `frontend-specialist` | frontend-design, nextjs-react-expert |
| **BACKEND** (API, server, DB) | `backend-specialist` | api-patterns, database-design |
| **DEVOPS** (CI/CD, deploy) | `devops-engineer` | deployment-procedures, server-management |

> Mobile + frontend-specialist = WRONG. Mobile = `mobile-developer` ONLY.

---

## TIER 0: UNIVERSAL RULES (Always Active)

### Language Handling

When user's prompt is NOT in English:
1. Internally translate for better comprehension
2. Respond in user's language
3. Code comments and variables remain in English

### Clean Code (Global Mandatory)

ALL code MUST follow `skills/clean-code` rules. No exceptions.

- **Code**: Concise, direct, no over-engineering. Self-documenting.
- **Testing**: Mandatory. Pyramid (Unit > Integration > E2E) + AAA Pattern.
- **Performance**: Measure first. Core Web Vitals standards.

### File Dependency Awareness

Before modifying ANY file:
1. Identify dependent files
2. Update ALL affected files together
3. Run relevant tests

### Read → Understand → Apply

Before coding, answer:
1. What is the GOAL of this agent/skill?
2. What PRINCIPLES must I apply?
3. How does this DIFFER from generic output?

---

## TIER 1: CODE RULES (When Writing Code)

### Socratic Gate

For complex requests, STOP and ASK first:

| Request Type | Strategy | Action |
|---|---|---|
| **New Feature / Build** | Deep Discovery | ASK minimum 3 strategic questions |
| **Code Edit / Bug Fix** | Context Check | Confirm understanding + ask impact |
| **Vague / Simple** | Clarification | Ask Purpose, Users, and Scope |
| **Full Orchestration** | Gatekeeper | STOP subagents until user confirms plan |

**Rules:**
1. If even 1% is unclear, ASK.
2. Wait. Do NOT write code until the user clears the Gate.

### Final Checklist Protocol

When the user says "final checks", "run all tests", or similar:

| Stage | Command | Purpose |
|---|---|---|
| **Manual Audit** | `python .claude/scripts/checklist.py .` | Priority-based project audit |
| **Pre-Deploy** | `python .claude/scripts/checklist.py . --url <URL>` | Full Suite + Performance + E2E |

**Priority Order:** Security → Lint → Schema → Tests → UX → SEO → Lighthouse/E2E

### Available Skill Scripts

Agents and skills can invoke scripts via `python .claude/skills/<skill>/scripts/<script>.py`

| Script | Skill | When to Use |
|---|---|---|
| `security_scan.py` | vulnerability-scanner | Always on deploy |
| `lint_runner.py` | lint-and-validate | Every code change |
| `test_runner.py` | testing-patterns | After logic change |
| `schema_validator.py` | database-design | After DB change |
| `ux_audit.py` | frontend-design | After UI change |
| `seo_checker.py` | seo-fundamentals | After page change |
| `bundle_analyzer.py` | performance-profiling | Before deploy |
| `mobile_audit.py` | mobile-design | After mobile change |

---

## TIER 2: DESIGN RULES

Design rules are in the specialist agents, NOT here.

| Task | Read |
|---|---|
| Web UI/UX | `.claude/agents/frontend-specialist.md` |
| Mobile UI/UX | `.claude/agents/mobile-developer.md` |

---

## QUICK REFERENCE

### Paths

- Agents: `.claude/agents/`
- Skills: `.claude/skills/`
- Commands: `.claude/commands/`
- Scripts: `.claude/scripts/`

### Key Agents

`orchestrator`, `project-planner`, `security-auditor`, `backend-specialist`, `frontend-specialist`, `mobile-developer`, `debugger`, `game-developer`

### Key Skills

`clean-code`, `brainstorming`, `app-builder`, `frontend-design`, `mobile-design`, `plan-writing`, `behavioral-modes`

### Key Scripts

- **Verify**: `.claude/scripts/verify_all.py`, `.claude/scripts/checklist.py`
- **Session**: `.claude/scripts/session_manager.py`
- **Preview**: `.claude/scripts/auto_preview.py`
<!-- /drk:rule:CLAUDE -->

---
*DrKumo Kit — Profile: _default | run `drk sync` to update*
<!-- /drk:kit -->
