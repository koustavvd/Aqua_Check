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
                       └─────────────────────┘
