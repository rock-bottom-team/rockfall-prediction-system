# Rockfall Prediction System
    SIH project by RockBottom team
    
A light-themed, real-time monitoring and analytics dashboard to predict rockfall risks in mining environments. The app visualizes sensor data, computes risk indicators, and provides role-based dashboards for managers, engineers, and workers.

## Live Demo

- Production: https://v0-remix-of-rockfall-prediction-sy.vercel.app/
- Rename tip: To remove “remix” from the URL, rename the Vercel project or publish a new project with your preferred name (Project Settings → General → Project Name, then Domains).

## Features

- Real-time sensor monitoring (gauges and tables)
- Risk indicators and alerts panel
- Prediction charts and incident trends (Recharts)
- Role-based dashboards (Manager, Engineer, Worker)
- Mine map and simulation views
- Reports page for historical insights
- Accessible, responsive UI built with shadcn/ui and Tailwind CSS v4
- Light theme by default via semantic tokens

## Tech Stack

- Framework: React.js + TypeScript
- UI: Tailwind CSS v4 + shadcn/ui + Radix primitives
- Charts: Recharts
- Theming: Design tokens (bg-background, text-foreground, etc.) with light palette
- State/Patterns: Server Components + client components where needed

## Project Structure

\`\`\`
app/
  layout.tsx         # Root layout, fonts, providers
  page.tsx           # Landing/dashboard entry
  globals.css        # Tailwind v4 + design tokens
components/
  ...                # UI components, dashboards, charts, panels
public/
  ...                # Icons, placeholders, static assets
\`\`\`

Selected components include:
- components/alerts-panel.tsx, live-sensor-gauges.tsx, prediction-chart.tsx, incident-trend-chart.tsx
- Role dashboards: manager-dashboard.tsx, engineer-dashboard.tsx, worker-dashboard.tsx
- Navigation + layout pieces: sidebar.tsx, theme-provider.tsx

## Getting Started (Local)

Prerequisites:
- Node.js 18+ and a package manager (npm, pnpm, or yarn)

Install and run:
\`\`\`bash
# install deps
npm install

# start dev server
npm run dev

# build for production
npm run build

# start production build
npm run start
\`\`\`

Then open http://localhost:3000.

## Environment Variables

This project runs without external services by default. If you add integrations (e.g., databases, APIs), define environment variables:
- Client-side variables must be prefixed with `NEXT_PUBLIC_`.
- Server-only variables can be unprefixed and are accessible in server actions/route handlers.

## Deployment

- One-click deploy on Vercel (Hobby plan is free): Publish from v0 or connect the GitHub repo on Vercel.
- Auto-deploys: After linking to GitHub, every push to the configured branch (e.g., `main`) triggers a new deployment.
- Rename default domain: Vercel Project Settings → General (Project Name), then Settings → Domains to set your preferred default domain.

## Contributing

- Fork the repo and create a feature branch
- Commit with clear messages and open a Pull Request
- Please keep UI components accessible and consistent with existing patterns

## Editing this README

- In GitHub: Edit the `README.md` file in your repository, commit to a branch, and open a PR (or push to `main` if appropriate).
- In v0: Ask v0 to “edit README.md” with your changes, or paste the updated Markdown. v0 will update and sync the repository automatically.

---
Made with Next.js, Tailwind CSS v4, shadcn/ui, and Recharts.
