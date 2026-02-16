

# AI-Powered Lead Intelligence System

A modern SaaS dashboard for managing sales leads with AI-generated scores, explainable insights, and personalized outreach — built with mock data as a frontend showcase for a final-year project.

## Layout & Navigation
- **Top navbar** with logo ("LeadIQ" or similar branding), search bar, notification bell, and user avatar/profile dropdown
- **Collapsible left sidebar** with icons and labels for: Dashboard, Leads, Lead Analysis, AI Outreach, Analytics, Settings
- Active route highlighting and smooth collapse to icon-only mini mode

## Pages

### 1. Dashboard (Home)
- **Summary cards**: Total Leads, High-Priority Leads, Conversion Rate, Average Lead Score — each with an icon and trend indicator (↑/↓)
- **Lead Score Distribution chart** (bar or donut chart via Recharts)
- **Recent High-Score Leads table** showing top 5 leads with name, company, score badge (green/yellow/red), and a "View" link

### 2. Leads Page
- **Data table** with columns: Name, Company, Industry, Lead Score (color-coded badge), Status (tag)
- **Search & filter bar** (by industry, score range, status)
- **"Add Lead"** button → opens a dialog/form (Name, Email, Company, Job Role, Industry, Notes)
- **"Import CSV"** button (UI only, no actual upload logic)

### 3. Lead Analysis (Core Page)
- **Lead selector** dropdown to pick a lead
- **Lead profile card** with contact details
- **Large circular/gauge AI Lead Score** display with color coding
- **Priority label** badge: High (green), Medium (yellow), Low (red)
- **Explainable AI section**: card with mock text explaining why the score is what it is (e.g., "Strong engagement signals", "Recent website visits", "Job title matches ICP")

### 4. AI Outreach
- **Lead selector** to choose which lead to generate outreach for
- **Generated email preview** card with Subject line and Body text (mock AI-generated content)
- **"Copy to Clipboard"** and **"Regenerate"** buttons
- Tone selector (Formal / Friendly / Persuasive) for variety

### 5. Analytics
- **Conversion funnel** visualization (Leads → Contacted → Qualified → Converted) using Recharts
- **Lead Score vs. Conversion** scatter or bar chart
- **Summary stats** cards (e.g., best-performing industry, average time to convert)

### 6. Settings
- **Profile section**: Name, email, role (display only)
- **System status**: mock API health indicators, last sync time
- Simple toggle options (e.g., email notifications, dark mode placeholder)

## Design & Style
- Clean, professional SaaS aesthetic with rounded cards and soft shadows
- Color-coded lead scores: Green (70-100), Yellow (40-69), Red (0-39)
- Consistent use of Tailwind + shadcn/ui components (tables, badges, cards, dialogs, tabs)
- Fully responsive — sidebar collapses on mobile, cards stack vertically
- All data is mock/hardcoded — no backend required

