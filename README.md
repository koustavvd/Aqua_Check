# AquaCheck 💧

### Tripura Groundwater Risk Assessment & Pre-Drilling Advisory Platform

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9.4-199900?logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-AI-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?logo=vercel&logoColor=white)](https://vercel.com/)

---

## 🌐 Live Demo

**https://aqua-check-nu.vercel.app/**

## 📦 Repository

**https://github.com/koustavvd/Aqua_Check**

---

## 📌 Overview

**AquaCheck** is an interactive hydrogeological decision-support platform focused on groundwater assessment and pre-drilling planning across **Tripura, India**.

The platform brings together geospatial visualization, groundwater monitoring information, hydrogeological indicators, deterministic analysis, and AI-assisted advisory generation into a single interface.

The core idea is to move beyond a simple groundwater-location question:

> **"Can I find groundwater here?"**

toward a more useful pre-drilling question:

> **"What groundwater conditions, risks, and drilling considerations should I understand before drilling?"**

AquaCheck is designed to make groundwater information easier to explore and interpret for landowners, engineers, drillers, researchers, and decision-makers.

---

# 🎯 Problem

Groundwater-dependent users often face uncertainty before constructing a borewell.

A drilling decision can depend on several factors, including:

- Groundwater levels
- Seasonal water-level variation
- Local geological conditions
- Recharge potential
- Extraction pressure
- Aquifer characteristics
- Borewell construction requirements
- Water-quality considerations

These factors may be distributed across different datasets and technical sources, making them difficult to interpret for non-specialists.

This creates a practical problem:

> **Important groundwater information may exist, but it is not always easy to convert that information into a practical pre-drilling decision.**

AquaCheck attempts to simplify this workflow through a single interactive, map-driven platform.

---

# 💡 Solution

AquaCheck combines four major layers:

### 1. Geospatial Exploration

Users can explore groundwater monitoring locations through an interactive map and inspect station-level information.

### 2. Hydrogeological Assessment

The platform evaluates groundwater-related indicators and produces a composite vulnerability score to provide a simplified risk-oriented view.

### 3. Pre-Drilling Advisory

The system transforms available hydrogeological information into practical drilling considerations such as:

- Rig selection
- Borehole diameter
- Casing material
- Target aquifer horizon
- Screen placement
- Water-quality considerations
- Sanitary sealing

### 4. AI-Assisted Interpretation

Google Gemini can provide contextual advisory content based on the hydrogeological information available to the application.

A deterministic rules engine is also available so that the core assessment workflow does not depend entirely on a generative AI service.

---

# 🚀 Key Features

## 🗺️ Interactive Hydrogeological Map

A Leaflet-based GIS interface allows users to explore groundwater monitoring and telemetry locations across Tripura.

Users can:

- Navigate the map
- Explore monitoring locations
- Select stations
- Inspect station information
- Apply location-based filtering

---

## 📍 Station Dossier

The station interface provides a structured view of available hydrogeological information for a selected monitoring location.

This allows users to move from a regional overview toward station-level assessment.

---

## 📊 Aquifer Vulnerability Score

AquaCheck presents a composite vulnerability indicator on a **0–100 scale**.

The assessment considers factors including:

- Depth to water table
- Seasonal fluctuation
- Recharge potential
- Extraction pressure

The score is intended as a **decision-support indicator**, not as a guaranteed prediction of groundwater availability or well yield.

---

## 🛠️ Pre-Drilling Advisory

The platform generates practical pre-drilling considerations.

### Drilling

- Suggested drilling rig approach
- Borehole diameter considerations
- Geological and aquifer targeting considerations

### Borewell Construction

- Casing material considerations
- Screen placement considerations
- Borehole construction factors
- Sanitary sealing

### Water Quality

- Iron considerations
- Turbidity considerations
- Filtration considerations

### Contractor Checklist

The system also provides questions that users can consider before engaging a drilling contractor.

The objective is to support a more informed drilling decision rather than relying only on an initial contractor estimate.

---

# 🤖 Dual Advisory Architecture

AquaCheck uses two complementary advisory paths.

## AI Advisory

The application integrates Google's Gemini API through the Google Gen AI SDK.

The AI layer can provide contextual interpretation of the hydrogeological information available to the application.

## Deterministic Logic Engine

The project also contains a local rules-based hydrogeological logic layer.

This provides:

- Fast calculations
- Predictable outputs
- A fallback path when Gemini is unavailable
- Reduced dependency on an external AI service

This architecture separates **deterministic assessment logic** from **AI-assisted interpretation**.

---

# 🌐 Multilingual Interface

AquaCheck supports:

- 🇬🇧 English
- 🇮🇳 বাংলা (Bengali)
- 🇮🇳 हिन्दी (Hindi)

The project includes a dedicated language context and translation layer for the user interface and advisory content.

---

# 📈 Regional Comparison

The platform includes district-level comparison functionality for examining groundwater-related conditions across Tripura.

The dashboard supports comparisons involving indicators such as:

- Water-table conditions
- Seasonal variation
- Extraction categories
- Relative groundwater stress

---

# 🧭 Geographic Coverage

The application is designed around the eight districts of Tripura:

| District |
|---|
| West Tripura |
| Sepahijala |
| Khowai |
| Gomati |
| South Tripura |
| Dhalai |
| Unakoti |
| North Tripura |

The project dataset includes monitoring-station information associated with Tripura's groundwater context.

---

# 🏗️ System Architecture

```text
                         ┌──────────────────────┐
                         │        USER          │
                         │  Map / Search / UI   │
                         └──────────┬───────────┘
                                    │
                                    ▼
                    ┌─────────────────────────────┐
                    │      React Dashboard        │
                    │                             │
                    │  • Hydrogeological Map      │
                    │  • Station Dossier           │
                    │  • Risk Indicator            │
                    │  • Regional Comparison       │
                    │  • Pre-Drilling Advisory     │
                    └──────────────┬──────────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    │                             │
                    ▼                             ▼
        ┌──────────────────────┐      ┌──────────────────────┐
        │ Deterministic Logic  │      │   Gemini AI Layer    │
        │ Hydrogeological      │      │ Contextual Advisory  │
        │ Rules Engine         │      │                      │
        └──────────┬───────────┘      └──────────┬───────────┘
                   │                             │
                   └──────────────┬──────────────┘
                                  ▼
                       ┌─────────────────────┐
                       │ Advisory / Insights │
                       └─────────────────────
                       ```

---

# 📁 Project Structure
                       
🧰 Technology Stack
| Layer              | Technology        |
| ------------------ | ----------------- |
| Frontend           | React 19          |
| Language           | TypeScript        |
| Build Tool         | Vite              |
| Styling            | Tailwind CSS v4   |
| Mapping            | Leaflet           |
| Icons              | Lucide React      |
| Animation          | Motion            |
| Backend            | Node.js + Express |
| TypeScript Runtime | TSX               |
| Bundling           | esbuild           |
| AI Integration     | Google Gen AI SDK |
| Deployment         | Vercel            |

📁 Project Structure

 # 📁 Project Structure

```text
Aqua_Check/
│
├── api/
│   └── advisory.ts                 # Vercel serverless function for AI-assisted advisory
│
├── public/                         # Static assets
│
├── src/
│   ├── components/
│   │   ├── HydroMap.tsx            # Interactive Leaflet hydrogeological map
│   │   ├── LanguageModal.tsx       # Language selector
│   │   ├── Navbar.tsx              # Navigation header
│   │   ├── PreDrillingAdvisory.tsx # Pre-drilling recommendations
│   │   ├── RegionalComparison.tsx  # District-level comparison
│   │   ├── SearchFilter.tsx        # Search and filtering
│   │   ├── StationDossier.tsx      # Station information panel
│   │   └── VulnerabilitySpeedometer.tsx # Vulnerability indicator
│   │
│   ├── context/
│   │   └── LanguageContext.tsx     # Language state management
│   │
│   ├── data/
│   │   └── tripuraData.ts          # Tripura groundwater dataset
│   │
│   ├── i18n/
│   │   └── translations.ts         # English, Bengali and Hindi translations
│   │
│   ├── utils/
│   │   └── hydroLogic.ts           # Deterministic hydrogeological logic
│   │
│   ├── types.ts                    # TypeScript types and interfaces
│   ├── App.tsx                     # Main application component
│   ├── main.tsx                    # React entry point
│   └── index.css                   # Global styles
│
├── .env.example                    # Environment variable template
├── .gitignore                      # Git ignore rules
├── index.html                      # HTML entry point
├── metadata.json                   # Application metadata
├── package.json                    # Dependencies and scripts
├── server.ts                       # Express/Vite server
├── tsconfig.json                   # TypeScript configuration
├── vercel.json                     # Vercel deployment configuration
└── vite.config.ts                  # Vite configuration

---

# 🚀 Getting Started

## Prerequisites

Make sure the following are installed:

- Node.js 18+ or a compatible current version
- npm

---

## 1. Clone the Repository

```bash
git clone https://github.com/koustavvd/Aqua_Check.git
cd Aqua_Check
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Configure Environment Variables

Create a `.env` file in the project root.

```env
GEMINI_API_KEY="your-gemini-api-key"
APP_URL="http://localhost:3000"
```

`GEMINI_API_KEY` is used for the AI-assisted advisory functionality.

**Never commit your actual API key to GitHub.**

---

## 4. Start the Development Server

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:3000
```

---

# 📦 Available Scripts

## Development

```bash
npm run dev
```

Starts the application in development mode.

## Production Build

```bash
npm run build
```

Creates the production build of the application.

## Production Start

```bash
npm start
```

Starts the application using the production configuration.

## Preview

```bash
npm run preview
```

Previews the production frontend build locally.

## Type Checking

```bash
npm run lint
```

Runs TypeScript checking without generating compiled output.

---

# ☁️ Deployment

AquaCheck is configured for deployment on **Vercel**.

The repository includes a `vercel.json` configuration for routing the application and API requests.

## Deploy on Vercel

1. Import the repository into your Vercel account.
2. Select the **Vite** framework preset.
3. Keep the project root as the repository root.
4. Configure the required environment variables.
5. Deploy the project.

For AI-assisted advisories, configure:

```text
GEMINI_API_KEY
```

in the Vercel project environment.

### Live Deployment

**https://aqua-check-nu.vercel.app/**

---

# 🔐 Environment Variables

| Variable | Purpose | Required |
|---|---|---|
| `GEMINI_API_KEY` | Authentication for Gemini AI advisory generation | For AI-assisted advisory |
| `APP_URL` | Base URL used by the application environment | Environment-dependent |

### Security

Never commit:

```text
.env
```

or any file containing a real API key.

Use environment variables for local development and cloud deployment.

---

# 📊 Data & Reference Sources

The project documentation references the following groundwater and engineering sources:

- **Central Ground Water Board (CGWB)**, Ministry of Jal Shakti, Government of India
- **National Water Informatics Centre (NWIC)**
- **Tripura Water and Sanitation Support Organisation (WSSO)**
- **IS 2800** — Code of Practice for Tube Well Construction
- **IS 12818** — UPVC Pipes for Well Casing

These references provide contextual hydrogeological and engineering guidance for the project's decision-support workflow.

---

# ⚠️ Important Disclaimer

AquaCheck is a **decision-support and informational platform**.

Its outputs should not be interpreted as:

- A guarantee of groundwater availability
- A guarantee of borewell success
- A guarantee of well yield
- A replacement for professional hydrogeological investigation
- A substitute for field verification
- A substitute for applicable government permissions or regulations

Actual groundwater conditions can vary significantly depending on local geology, seasonal conditions, aquifer characteristics, recharge, extraction, and other site-specific factors.

Professional hydrogeological and engineering assessment should be performed before major drilling decisions.

---

# 🏆 Hackathon Project

AquaCheck was developed as a **24-hour hackathon project** focused on groundwater assessment and pre-drilling decision support.

The project combines:

```text
Geospatial Visualization
        +
Hydrogeological Indicators
        +
Deterministic Analysis
        +
AI-Assisted Advisory
        +
Multilingual UX
```

The objective was to demonstrate how groundwater information can be transformed into a more accessible and practical pre-drilling workflow.

---

# 👥 Team Project

AquaCheck was developed collaboratively as a hackathon project.

This repository is a personal repository of the team's project for portfolio, documentation, and further development purposes.

Individual contributions should be represented accurately when describing the project in resumes, portfolios, presentations, and interviews.

---

# 🔮 Future Development

Potential future improvements include:

- Live groundwater telemetry integration
- Historical groundwater trend analysis
- More detailed spatial interpolation
- Additional aquifer and geological datasets
- Site-specific geophysical data integration
- Improved uncertainty estimation
- User-defined drilling scenarios
- Field-data feedback integration
- Expanded regional coverage
- More advanced hydrogeological modelling

---

# 📌 Why AquaCheck?

AquaCheck is built around a practical pre-drilling question:

> **Before drilling, what do we know about the groundwater system and what risks should we consider?**

Instead of presenting groundwater information as isolated datasets, the platform attempts to connect:

```text
Location
   ↓
Groundwater Information
   ↓
Hydrogeological Assessment
   ↓
Risk Interpretation
   ↓
Pre-Drilling Advisory
```

This makes AquaCheck an exploratory decision-support platform rather than simply a groundwater visualization tool.

---

# 📖 Repository Information

**Repository**

https://github.com/koustavvd/Aqua_Check

**Live Application**

https://aqua-check-nu.vercel.app/

---

# 📄 License

This project is intended for educational, research, hackathon, and portfolio purposes.

Third-party libraries and dependencies remain subject to their respective licenses.

---

## Built With

**React · TypeScript · Vite · Tailwind CSS · Leaflet · Node.js · Express · Google Gemini · Vercel**



