# Trust Wizard

<div align="center">
  <img src="public/trust-logo-master.png" alt="Trust Wizard Logo" width="160">
</div>

## Overview
Trust Wizard is a premium, offline-first Progressive Web App (PWA) engineered strictly for the decentralized administration of personal trusts and complex financial instruments, specifically focusing on the Infinite Banking Concept (IBC) utilizing dividend-paying whole life insurance policies.

It provides an intuitive, high-security dashboard for aggregating multi-policy metrics, simulating collateralized loans, tracking historical dividend crediting, and generating legally sound administrative documents—all without exposing any data to external cloud databases.

## 🛡️ Absolute Privacy model
Unlike standard financial SaaS platforms, **Trust Wizard employs a 100% local-first data architecture.**

All policy numbers, cash values, document metadata, and loan calculations are persisted exclusively within the user's browser via **IndexedDB** (`localforage`). 
- **No Backend:** There is no centralized API, database, or server collecting your information.
- **Complete Ownership:** Your data never leaves your physical device. 

## ✨ Key Features

### 1. Dynamic Multi-Policy Ledger
Dynamically link multiple insurance policies by specifying their specific Issue Date, Base Premium, and Planned Paid-Up Additions. Rather than stagnant cash values, Trust Wizard tracks a chronological ledger of premium payments and Annual Statement True-Ups. The forecasting engine then uses this real-world chronological data to dynamically recalculate your 30-year projections, overarching borrowing capacity, and total trust equity on the fly.

### 2. Collateralized Borrowing Simulator
Model unstructured policy loans against the trust's aggregated cash value. Instantly generate mathematically rigorous amortization schedules and export CSS-styled, print-ready formal loan illustrations for your physical records.

### 3. Historical Dividend Heatmap & S&P 500 Overlay
Visualize 25 years of compounding mutual dividend crediting rates. Anchored directly to the dashboard, this interactive chart contextualizes the non-correlated growth mechanics foundational to Infinite Banking. It allows you to toggle an overlay of S&P 500 historical returns to visually compare the volatility of the market against the guaranteed floor of your trust's whole life assets.

### 4. Dynamic Legal Templates (Crummey Notices)
Ensure your trust gifts remain tax-exempt (under the annual exclusion) by generating formal "Crummey Notice" right-of-withdrawal letters. The integrated generator accepts dynamic inputs and outputs a print-ready, legally worded document complete with signature blocks.

### 5. Document Creation Wizard
Generate, print, and securely scan formal Certifications of Trust via your device camera natively into the IndexedDB Vault without external processing.

### 6. Vault Backup & Restore
Bundle your full Trust `config.json` state and embedded Base64 image files into an encrypted `.zip` archive for secure local backups and instantaneous full-state restorations.

### 7. Emergency Successor Export
Instantly generate a standalone HTML package bundling all portfolio metrics, policies, and embedded trust documents for crucial offline access by successor trustees.

### 8. Annual Compliance Tracker
Track and manually configure required annual Trust upkeep tasks—such as Crummey notices, entity fees, and trustee meetings—using a persistent dashboard widget.

### 9. Multi-Platform Native App & PWA
Trust Wizard is built from the ground up using **Tauri v2** to be published as a native application on **macOS**, **iOS**, and **Android** leveraging lightweight, deeply integrated native WebViews. Additionally, the core Vite single-page application remains a Progressive Web App (PWA), meaning it can be hosted on any free cloud edge network (e.g., Vercel, GitHub Pages) and installed directly via web browsers on any unsupported device for a completely offline experience.

## 🚀 Quick Start (Local Development)

### Prerequisites
- [Node.js](https://nodejs.org/en/) (v16.x or higher recommended)
- Git

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR_GITHUB_USERNAME/trust-wizard.git
   cd trust-wizard
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

### Running the App

**For Web/PWA Development:**
```bash
npm run dev
```
*Navigate to `http://localhost:5173`. Any data you enter will persist locally on your machine.*

**For macOS Native Desktop:**
```bash
npm run tauri dev
```

**For iOS (requires Xcode):**
```bash
npm run tauri ios dev
```

**For Android (requires Android Studio):**
```bash
npm run tauri android dev
```

## 🌩️ Deployment (Free Cloud Hosting)

**Deployment is exclusively allowed via Vercel at the following URL:**
[https://trust-wizard.vercel.app/](https://trust-wizard.vercel.app/)

*Note: Because this app has absolutely no backend, it is incredibly easy and safe to deploy it publicly while maintaining 100% privacy for its users via local IndexedDB storage.*

*Once deployed or visited at the URL above on any device, select "Add to Home Screen" to install it as a native standalone app.*

## Tech Stack
- **Native Wrapper:** Tauri v2 (Rust)
- **Framework:** React + Vite
- **Styling:** Vanilla CSS (Glassmorphism & CSS-Grid)
- **State/Storage:** React Hooks + IndexedDB (`localforage` + `jszip` + `@tauri-apps/plugin-fs`)
- **Data Visualization:** Recharts
- **Icons:** Lucide React

---
*Disclaimer: Trust Wizard is designed for educational and administrative modeling purposes only. It does not constitute formal legal or financial advice.*
