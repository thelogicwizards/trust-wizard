# Trust Wizard

<div align="center">
  <img src="public/trust-icon.svg" alt="Trust Wizard Logo" width="120">
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

### 1. Global Multi-Policy Aggregation
Dynamically link multiple insurance policies (specifying the carrier, insured party, cash value, death benefit, and individual interest rate). The engine instantly recalculates global trust equity and overarching borrowing capacity.

### 2. Collateralized Borrowing Simulator
Model unstructured policy loans against the trust's aggregated cash value. Instantly generate mathematically rigorous amortization schedules and export CSS-styled, print-ready formal loan illustrations for your physical records.

### 3. Historical Dividend Heatmap
Visualize 25 years of compounding mutual dividend crediting rates. Anchored directly to the dashboard, this interactive chart contextualizes the non-correlated growth mechanics foundational to Infinite Banking.

### 4. Dynamic Legal Templates (Crummey Notices)
Ensure your trust gifts remain tax-exempt (under the annual exclusion) by generating formal "Crummey Notice" right-of-withdrawal letters. The integrated generator accepts dynamic inputs and outputs a print-ready, legally worded document complete with signature blocks.

### 5. Progressive Web App (PWA) Ready
Trust Wizard is built to be installed natively. Host the static files on any free cloud edge network (e.g., Vercel, GitHub Pages), and "Install" the application directly to your macOS, iOS, Windows, or Android device for a standalone, full-screen experience.

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

3. **Run the development server:**
   ```bash
   npm run dev
   ```
   *Navigate to `http://localhost:5173` in your browser. Any data you enter will persist locally on your machine.*

## 🌩️ Deployment (Free Cloud Hosting)

Because this app has absolutely no backend, it is incredibly easy and safe to deploy it publicly while maintaining 100% privacy for its users.

**Using Vercel (Recommended):**
1. Push this repository to GitHub.
2. Sign in to [Vercel](https://vercel.com).
3. Click "Add New" -> "Project".
4. Import your `trust-wizard` GitHub repository.
5. Click **Deploy**. Vercel will automatically build the Vite project and provide a live URL.

*Once deployed, visit the URL on any device and select "Add to Home Screen" to install it as a native standalone app.*

## Tech Stack
- **Framework:** React + Vite
- **Styling:** Vanilla CSS (Glassmorphism & CSS-Grid)
- **State/Storage:** React Hooks + IndexedDB (`localforage`)
- **Data Visualization:** Recharts
- **Icons:** Lucide React

---
*Disclaimer: Trust Wizard is designed for educational and administrative modeling purposes only. It does not constitute formal legal or financial advice.*
