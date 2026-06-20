# Formify Studio ✦ Visual & Code Dynamic Form Builder

Formify Studio is an enterprise-grade, local-first visual form engine and generation IDE built on Next.js 15. It bridges the gap between visual layout designers and raw JSON configurations, allowing developers and designers to build, theme, and synchronize responsive form components in real-time.

![Formify Studio Cover](https://github.com/user-attachments/assets/81d1e147-b1f3-4b98-9e0b-4abe9427a6f0)

---

## 🚀 Key Features

- **Bi-Directional Live Sync**: Modify schemas visually via the drag-and-drop property builder, or code directly in the advanced JSON editor (powered by CodeMirror) with real-time validation.
- **WebRTC Serverless Collaboration**: Connect and sync workspace schemas in real-time directly between browsers without any intermediate database lag.
- **Tailwind & CSS Variable Styling**: Customize borders, layout grids, shadows, button sizes, and typography weights on the fly.
- **5 Workspace Layout Themes**:
  - **Light**: Crisp, clean, high-contrast.
  - **Dark**: Low-light slate mode.
  - **Corporate**: Sleek professional layout.
  - **Midnight**: Elegant deep blue space tone.
  - **Matrix**: Developer terminal green font interface.
- **Redesigned Clean Settings Panel**: Personalize workspace settings, scale typography font styles (Geist Sans, Geist Mono, Georgia) from `0.8x` to `1.5x` with instant preview.
- **Local-First Data Sandbox**: Form schema changes and submissions log entries are persisted privately in the browser's LocalStorage. Export logs directly to CSV or JSON formats.

---

## 🛠️ Technology Stack

- **Core Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **UI & Iconography**: [Tailwind CSS](https://tailwindcss.com/) & [Lucide React](https://lucide.dev/)
- **State Management**: React Hooks (Local-First Sync)
- **Collaborative Sync**: [PeerJS](https://peerjs.com/) (WebRTC Data Channels)
- **Schema Validation**: AJV Schema Validator

---

## 💻 Setup & Installation

### Prerequisites

- **Node.js** (>= 18.x)
- **NPM** (>= 7.x)

### Installation Guide

1. **Clone the repository**:
   ```bash
   git clone https://github.com/utkarsh-1912/formify-json.git
   cd formify-json
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open your browser and visit `http://localhost:3000/`.

---

## 📦 Production Deployment

To compile the application into an optimized, production-ready static bundle:

1. **Build the production build**:
   ```bash
   npm run build
   ```

2. **Serve the production bundle**:
   You can run the build server locally using a static server:
   ```bash
   npm run start
   ```

---

## 📄 Example JSON Schema

Formify schemas use a highly structured, validatable JSON configuration layout. 

```json
{
  "formTitle": "Project Requirements Survey",
  "formDescription": "Please fill out this survey about your project needs",
  "fields": [
    {
      "id": "name",
      "type": "text",
      "label": "Full Name",
      "required": true,
      "placeholder": "Enter your full name"
    },
    {
      "id": "email",
      "type": "email",
      "label": "Email Address",
      "required": true,
      "placeholder": "you@example.com",
      "validation": {
        "pattern": "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
        "message": "Please enter a valid email address"
      }
    },
    {
      "id": "companySize",
      "type": "select",
      "label": "Company Size",
      "required": true,
      "options": [
        { "value": "1-50", "label": "1-50 employees" },
        { "value": "51-200", "label": "51-200 employees" },
        { "value": "201-1000", "label": "201-1000 employees" }
      ]
    }
  ]
}
```

---

## 🔒 Security & Privacy

Formify Studio values user privacy. By prioritizing a **local-first** approach:
- All form configuration and builder data is kept in the user's browser sandbox.
- WebRTC peer connections are direct browser-to-browser channels without standard backend log pipelines.
- Data export configurations (JSON/CSV) run strictly client-side.
