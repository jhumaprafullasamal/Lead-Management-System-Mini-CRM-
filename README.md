# LeadFlow — Mini CRM

A full-stack Lead Management System built with **React + Tailwind**, **Node.js + Express**, and **PostgreSQL**.

---

## ✨ Features

### Frontend (React + Tailwind)
- **Dashboard** with live stats: total leads, interested, converted, not interested, leads by source, this week's count, conversion rate
- **Add Lead** form with full validation (name, phone, source)
- **Leads list** with search (by name/phone) + filter (by status/source)
- **Status update** dropdown on each card (New → Interested → Converted → Not Interested)
- **Delete** with confirmation UX
- Skeleton loading states, toast notifications, responsive mobile-first layout

### Backend (Node.js + Express)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/leads` | Get all leads (with `?search=`, `?status=`, `?source=`) |
| GET | `/api/leads/stats` | Dashboard aggregate stats |
| POST | `/api/leads` | Create a new lead |
| PUT | `/api/leads/:id` | Update lead status (and optional notes) |
| DELETE | `/api/leads/:id` | Delete a lead |
| GET | `/api/health` | Health check |

### Database (PostgreSQL)
```sql
CREATE TABLE leads (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100)  NOT NULL,
  phone       VARCHAR(20)   NOT NULL,
  source      VARCHAR(20)   NOT NULL CHECK (source IN ('Call','WhatsApp','Field')),
  status      VARCHAR(20)   NOT NULL DEFAULT 'New'
                            CHECK (status IN ('New','Interested','Not Interested','Converted')),
  notes       TEXT,
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);
```
- Auto-updating `updated_at` trigger
- Indexes on `status`, `source`, `created_at`

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd lead-crm
npm run install:all
```

### 2. Database Setup
```bash
# Create the database
psql -U postgres -c "CREATE DATABASE lead_crm;"
# The table is auto-created on first server start
```

### 3. Backend Config
```bash
cd backend
cp .env.example .env
# Edit .env with your PostgreSQL credentials
```

### 4. Run (two terminals)
```bash
# Terminal 1 — Backend
npm run dev:backend   # http://localhost:5000

# Terminal 2 — Frontend
npm run dev:frontend  # http://localhost:3000
```

---

## 📁 Project Structure

```
lead-crm/
├── backend/
│   ├── db/
│   │   └── index.js          # Pool + auto-init schema
│   ├── routes/
│   │   └── leads.js          # All lead routes + validation
│   ├── server.js             # Express app entry
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AddLeadForm.jsx
│   │   │   ├── Badges.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── FilterBar.jsx
│   │   │   └── LeadCard.jsx
│   │   ├── hooks/
│   │   │   └── useLeads.js   # All data-fetching logic
│   │   ├── utils/
│   │   │   └── api.js        # Axios instance
│   │   ├── App.jsx
│   │   ├── index.js
│   │   └── index.css
│   ├── public/index.html
│   ├── tailwind.config.js
│   └── package.json
│
├── package.json              # Root scripts
└── README.md
```

---

## 🎨 Tech Stack
| Layer | Stack |
|-------|-------|
| Frontend | React 18, Tailwind CSS, Axios, react-hot-toast, lucide-react |
| Backend | Node.js, Express, express-validator |
| Database | PostgreSQL, pg (node-postgres) |
| Fonts | Sora (display), DM Sans (body), JetBrains Mono |

---

## 🧪 API Examples

```bash
# Add a lead
curl -X POST http://localhost:5000/api/leads \
  -H "Content-Type: application/json" \
  -d '{"name":"Ravi Sharma","phone":"+91 98765 43210","source":"WhatsApp"}'

# Get all leads
curl http://localhost:5000/api/leads

# Search & filter
curl "http://localhost:5000/api/leads?search=ravi&status=Interested"

# Update status
curl -X PUT http://localhost:5000/api/leads/1 \
  -H "Content-Type: application/json" \
  -d '{"status":"Converted"}'

# Delete
curl -X DELETE http://localhost:5000/api/leads/1

# Stats
curl http://localhost:5000/api/leads/stats
```
