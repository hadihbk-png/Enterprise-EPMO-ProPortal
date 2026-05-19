# Enterprise EPMO ProPortal

![Status](https://img.shields.io/badge/status-prototype-orange)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-ready-3ECF8E?logo=supabase&logoColor=white)
![Netlify](https://img.shields.io/badge/Netlify-ready-00C7B7?logo=netlify&logoColor=white)
![License](https://img.shields.io/badge/license-private-red)

---

## Executive Summary

**Enterprise EPMO ProPortal** is an AI-assisted Enterprise Programme Management Office (EPMO) / Program & Portfolio Management prototype platform. It provides a unified command interface for programme oversight, portfolio visibility, risk management, stakeholder engagement, and budget tracking — built as a modern single-page application with a dark-themed, enterprise-grade UI.

---

> ## ⚠️ Prototype Disclaimer
>
> **This is a prototype / demonstration platform only.**
>
> - Not intended for production use under any circumstances
> - Contains no real customer, organizational, or personal data
> - All data is mock / demo data generated for demonstration purposes only
> - Authentication and enterprise security controls are **not fully implemented**
> - Role-based access control (RBAC) is **not enforced**
> - This platform is **not production hardened** and has not undergone security review
>
> **Do not use this platform to process, store, or transmit real organizational data.**

---

## Current Capabilities

| Module | Description |
|---|---|
| **Dashboard** | Executive summary view with KPIs, programme health indicators, and activity feed |
| **Program Management** | Programme listing, detail views, and status tracking |
| **Portfolio Visibility** | Portfolio-level aggregation and health overview |
| **Risks & Issues** | RAID register with risk categorization and issue tracking |
| **Stakeholder Management** | Stakeholder directory and engagement tracking |
| **Budget Tracking** | Budget allocation, spend tracking, and variance reporting |
| **Milestones** | Milestone planning and delivery status |
| **Reports** | Programme and portfolio reporting views |
| **Workspace Settings** | Application-level configuration and preferences |

---

## Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18 |
| **Build Tool** | Vite 8 |
| **Styling** | Tailwind CSS |
| **Animations** | Framer Motion |
| **Routing** | React Router DOM |
| **Backend / DB** | Supabase (configured, not fully integrated) |
| **Deployment** | Netlify-ready (`netlify.toml` included) |
| **Icons** | Lucide React |

---

## Known Limitations

This prototype has the following known gaps relative to a production-ready system:

- **No authentication** — the application is publicly accessible with no login gate
- **No RBAC** — all users see all modules with no role-based restrictions
- **No protected admin routes** — administrative views are unguarded
- **Prototype audit logging only** — audit events are not persisted or tamper-proof
- **No CI/CD validation** — no automated pipeline for build, lint, or test gating
- **No automated tests** — no unit, integration, or end-to-end test coverage
- **Not production hardened** — no security headers, no CSP, no penetration testing performed
- **Mock data only** — all displayed data is statically seeded for demonstration

---

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Lint
npm run lint
```

The development server runs at `http://localhost:5173` by default.

---

## Project Structure

```
src/
├── components/       # Shared UI components
│   └── layout/       # AppShell, Sidebar, Header
├── context/          # React context providers
├── pages/            # Route-level page components
└── App.jsx           # Router and top-level layout
```

---

## Deployment

The project includes a `netlify.toml` configuration for direct Netlify deployment. Set the following environment variables in your Netlify dashboard if connecting Supabase:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## Roadmap (Post-Prototype)

- [ ] Authentication (Supabase Auth)
- [ ] Role-based access control
- [ ] CI/CD pipeline with automated testing
- [ ] Production security hardening
- [ ] Real data integration
- [ ] Audit log persistence

---

*Enterprise EPMO ProPortal — Prototype. For demonstration purposes only.*
