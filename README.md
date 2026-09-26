# Restaurant Management with Retail POS (Vue 3 + Quasar)

A complete, production-ready Restaurant POS application built strictly according to the evaluation criteria for the **Vue 3 + Quasar Hands-on Test**.

Built with:
- **Vue 3** (Composition API, `<script setup>`, Single File Components `.vue`)
- **Quasar Framework** (`<q-layout>`, `<q-header>`, `<q-drawer>`, `<q-card>`, `<q-btn>`, `<q-input>`, `<q-select>`, `<q-dialog>`, `<q-chip>`, `<q-badge>`, `<q-tabs>`, `<q-table>`)
- **Pinia** + **Browser Local Storage** for client-side persistence (no backend required)
- **jsPDF** for on-demand PDF invoice generation

---

## 📋 Evaluation Checklist & Implemented Steps

### ✅ Step 1: Authentication Module
- **Login Page**: Default landing route (`/`).
- **Registration Card**: Triggered by clicking "Register" on the login page.
- **In-Place Card Swap**: As strictly mandated by Step 1, registration opens in the **same view as a Card, not a route change**.
- **Fields**: Name, Email, Phone Number, Password, Confirm Password.
- **Validation**: Form field validations and login validation against registered accounts saved in Local Storage.

### ✅ Step 2: My Restaurant Setup Page (After Login)
- **Profile Fields**: Restaurant Name, Logo Upload (converted and previewed as base64 data URL for LS), Address, Phone Number, Branch Name(s).
- **CRUD Operations**: Add, Edit, Delete restaurant profiles.
- **Explicit Navigation Buttons**: Directly links to:
  - 🍽️ **All Items Page** (`/app/items`)
  - 🛒 **Orders Page** (`/app/orders`)
  - 🧾 **Invoice Page** (`/app/invoices`)

### ✅ Step 3: All Items Page
- **Card Format**: All restaurant items are displayed in clean `<q-card>` format.
- **Item Details**: Item Name, Price (formatted with currency), Category badge/chip, and quick Edit / Delete actions.
- **Add New Item**: Modal dialog (`<q-dialog>`) with fields for Name, Category (select or create new), and Price.
- **Local Storage**: Automatically synced and persisted in Local Storage.
- **Search & Filter**: Search by item name and filter by category.
- **Starter Menu**: Includes an option to load a sample starter menu with one click.

### ✅ Step 4: Order Page
- **Item Selection**: Interactive POS item selection cards to quickly add or increment items in the cart.
- **POS Ticket / Cart**:
  - Chosen items with quantity steppers (`+` / `-`), line total calculation, and item removal.
  - Subtotal, VAT/Tax calculation, and Grand Total.
- **Customer & Seating Inputs**:
  - Customer Name
  - Phone Number
  - Table Number
  - Seat Number
- **Submission**: Clicking "Submit Order & View Invoice" saves the order in Local Storage and immediately redirects to the **Invoice Page** with the generated receipt.

### ✅ Step 5: Invoice Page
- **Local Storage Record**: Loads and displays all past and current orders.
- **Separate Sections**:
  - ⏳ **Upcoming Orders (Latest First)**: Active orders waiting to be served.
  - ✅ **Previous Orders (Older Orders)**: Completed orders.
- **Order Actions**:
  - 👁️ **View Invoice**: Opens high-fidelity receipt slip in a `<q-dialog>`.
  - 🖨️ **Print Invoice**: Clean receipt printout via browser printing (`window.print()`).
  - 📥 **Download Invoice**: Download as PDF file (via jsPDF) or as plain formatted text.
  - 🔄 **Status Management**: Easily toggle between "Mark as Completed" and "Move back to Upcoming".

### 🌟 Included Extra Features
- **Theme Switcher**: Instant Dark / Light mode toggle using Quasar's native `$q.dark` system, persisted in Local Storage.
- **Search & Filter**: Full real-time search on menu items and invoices.
- **Fully Responsive**: Optimized for desktop POS screens, tablets, and mobile devices (includes bottom navigation tabs on small screens).

---

## 🚀 Setup & Local Development

```bash
# Install dependencies
npm install

# Start local development server with hot-reload
npm run dev

# Build production bundle for deployment (SPA)
npm run build
```

The production output will be generated in `dist/spa`.

---

## 🌐 Live Demo & Deployment

- **Live URL 1:** [https://rms-restaurant.vercel.app](https://rms-restaurant.vercel.app)
- **Live URL 2:** [https://sams-alif-rms.vercel.app](https://sams-alif-rms.vercel.app)

A `vercel.json` file is included in the root directory:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist/spa",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

Deploy using the Vercel CLI:
```bash
npx vercel
```
Or import this repository directly into your [Vercel Dashboard](https://vercel.com).
