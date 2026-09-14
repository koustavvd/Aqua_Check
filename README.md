# Aqua Check: Tripura Aquifer Hydrogeological Radar 💧🗺️

An interactive Groundwater & Pre-Drilling Hydrogeological Observatory for the State of Tripura, India. Designed for hydrogeologists, civil engineers, well drillers, and policymakers, Aqua Check maps telemetry stations across all 8 districts of Tripura, provides subsurface lithological diagnostics, calculates aquifer vulnerability scores, and generates pre-drilling advisories.

---

## 🌟 Key Features

- **Interactive GIS Hydro-Radar**: Real-time Leaflet map displaying 118+ Central Ground Water Board (CGWB) monitoring and telemetry stations across all 8 districts of Tripura.
- **District & Lithological Segmentation**: Full coverage for West Tripura, Sepahijala, Khowai, Gomati, South Tripura, Dhalai, Unakoti, and North Tripura, identifying Dupitila, Tipam, and Surma geological formations.
- **Aquifer Vulnerability Speedometer**: Dynamic composite scoring index (0–100) assessing depth to water table, seasonal fluctuation, recharge potential, and extraction pressure.
- **Pre-Drilling Technical Advisory**:
  - Recommended drilling rig type (DTH Hammer, Rotary Mud, or Combination).
  - Recommended borehole diameter and casing materials (UPVC / MS ERW).
  - Target aquifer horizons and optimal slotted screen placement intervals.
  - Iron / turbidity filtration and sanitary sealing requirements.
  - Contractor inquiry checklist to protect landowners from dry wells and collapsed boreholes.
- **Dual-Engine Advisory**:
  - **Gemini AI Engine**: Contextual hydrogeological analysis powered by `@google/genai` (`gemini-2.5-flash`).
  - **Deterministic CGWB Engine**: Instant, zero-latency in-browser hydrogeological calculation fallback for offline or static deployments.
- **Trilingual Localization**: Complete interface and technical advisories available in English, Bengali (বাংলা), and Hindi (हिन्दी), including native numeral formatting.
- **Regional Comparison & Analytics**: Comparative matrix ranking water tables, seasonal drawdowns, and extraction categories (Safe, Semi-Critical, Over-Exploited).

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Motion (`motion/react`)
- **Mapping & Spatial Visualization**: Leaflet, custom CartoDB & OpenStreetMap tile layers, SVG marker pins
- **Icons**: `lucide-react`
- **Backend**: Node.js, Express 4, `tsx`, `esbuild`
- **AI / LLM Integration**: Google Gen AI SDK (`@google/genai`)
- **Serverless / Cloud**: Vercel Serverless Function (`api/advisory.ts`) & Cloud Run full-stack container support

---

## 📁 Project Structure

```text
├── api/
│   └── advisory.ts             # Vercel serverless function for Gemini advisories
├── public/                     # Static assets and icons
├── src/
│   ├── components/
│   │   ├── HydroMap.tsx        # Leaflet hydrogeological map & station pins
│   │   ├── LanguageModal.tsx   # Language selector modal (EN / BN / HI)
│   │   ├── Navbar.tsx          # Navigation header, metrics, and live status
│   │   ├── PreDrillingAdvisory.tsx # Drilling rig & casing recommendations
│   │   ├── RegionalComparison.tsx  # District-level comparative table
│   │   ├── SearchFilter.tsx    # Search, district filter, and status filters
│   │   ├── StationDossier.tsx  # Station hydrogeological telemetry dossier
│   │   └── VulnerabilitySpeedometer.tsx # Visual risk & vulnerability gauge
│   ├── context/
│   │   └── LanguageContext.tsx # React context for trilingual state
│   ├── data/
│   │   └── tripuraData.ts      # CGWB monitoring station dataset for Tripura
│   ├── i18n/
│   │   └── translations.ts     # Trilingual dictionary (EN, BN, HI)
│   ├── types.ts                # TypeScript interfaces for stations and advisories
│   ├── utils/
│   │   └── hydroLogic.ts       # Deterministic CGWB engineering rules engine
│   ├── App.tsx                 # Main application dashboard
│   ├── main.tsx                # React DOM root entry point
│   └── index.css               # Global Tailwind CSS styles
├── metadata.json               # Application metadata and capabilities
├── package.json                # Project dependencies and build scripts
├── server.ts                   # Express server with Vite middleware & Gemini API
├── tsconfig.json               # TypeScript compiler configuration
├── vercel.json                 # Vercel deployment routes and rewrites
└── vite.config.ts              # Vite configuration with Tailwind CSS v4
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or 20+
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/aqua-check-tripura.git
   cd aqua-check-tripura
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the project root:
   ```env
   # Optional: Google Gemini API Key for AI-generated advisories
   GEMINI_API_KEY="your-gemini-api-key"
   ```
   *(Note: If `GEMINI_API_KEY` is not provided, the application seamlessly runs on the deterministic CGWB hydrogeological rules engine without errors).*

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   The app will run at `http://localhost:3000`.

---

## 📦 Build & Deployment

### Production Build
```bash
npm run build
```
This builds the client assets into `dist/` and bundles `server.ts` into a standalone CommonJS backend at `dist/server.cjs`.

### Production Start
```bash
npm start
```

### Vercel Deployment
Aqua Check includes out-of-the-box configuration for Vercel:
- `vercel.json` maps `/api/*` requests to the serverless function in `api/advisory.ts` and routes all other traffic to the static SPA.
- Set the `GEMINI_API_KEY` environment variable in your Vercel Project Settings for live AI advisories.

---

## 📊 Data Sources & Reference Standards

- **Central Ground Water Board (CGWB)**, Ministry of Jal Shakti, Government of India.
- **National Water Informatics Centre (NWIC)** — Dynamic Ground Water Resources of India.
- **Tripura Water and Sanitation Support Organisation (WSSO)**, Drinking Water & Sanitation Department.
- Standard specifications: IS 2800 (Code of practice for tube well construction) & IS 12818 (UPVC pipes for well casing).

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
