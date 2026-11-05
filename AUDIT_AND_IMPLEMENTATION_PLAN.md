# MAVUNO – COMPREHENSIVE ARCHITECTURAL AUDIT & IMPLEMENTATION PLAN

**Target Repository:** `Allen-Otty/Mavuno`  
**Active Branch:** `feature/mavuno-claymorphism-redesign`  
**Lead Architect:** Senior Full-Stack Agritech Developer & Systems Architect  
**Date:** November 2026

---

## 1. Executive Summary & Audit of Existing Codebase

### 1.1 Existing Architecture Inspection
- **Original Prototype:** A single-file HTML/CSS/JS prototype (`Mavuno___Farm_to_plate__Kenya_49315aec.html`) with hardcoded locations (Luanda Township, Kima, Chavakali, Mbale in Vihiga County), basic in-memory global state `S`, and static SVG map path markers.
- **Vite/React Migration:** A React 19 + TypeScript codebase with initial role tabs and basic mock entities.

### 1.2 Identified Gaps & Deficiencies
1. **Location & Administrative Hardcoding:** Location was rigidly tied to Vihiga County. Kenya has 47 counties with distinct agro-ecological zones. Farmers in Kakamega, Nakuru, Kiambu, Uasin Gishu, Kisumu, Machakos, Bungoma, etc., had no way to select their real administrative hierarchy (County → Sub-County → Ward → Village).
2. **Geospatial & Privacy Limitations:** The map was purely illustrative SVG. Real agricultural supply chains require an actual map implementation (OpenStreetMap + Leaflet) with geocoded boundaries, approximate circular geofencing (~150m privacy buffer for unregistered buyers), and unlocked exact GPS pins upon confirmed orders.
3. **Absence of Farm Records Management:** Farmers had only product listings; they lacked a digital farm book (crop cycles, livestock tracking, farm inputs, labour expenses, revenue vs. cost calculations, harvest storage, rainfall observations, and chronological field diary).
4. **Disjointed Climate & Agronomy Service Value Chain:** Climate was represented as a static notice rather than an actionable five-stage service: (1) Observation/Forecast → (2) Processing → (3) Agricultural Advisory → (4) Farmer Dissemination → (5) Field Feedback & Pest Reporting.
5. **UI & Navigation Inconsistencies:** The interface needed a full-fledged enterprise SaaS shell (collapsible sidebar with 11 major modules, top bar with breadcrumbs and notification center, bottom mobile bar) styled with genuine **white claymorphism** (soft white raised cards, inset form inputs, raised green action buttons, no heavy dark borders or jarring shadows).

---

## 2. White Claymorphism Design System Specifications

### 2.1 Color Palette
- **Canvas / Background:** `#ffffff` (Pure Crisp White)
- **Clay Card Surface:** `#ffffff` with subtle border `#edf2ed`
- **Recessed Input Surface:** `#f8fbf8` with border `#e7eee7`
- **Primary Brand Gradient:** `linear-gradient(135deg, #38a957, #21833f)`
- **Secondary Surface:** `linear-gradient(145deg, #ffffff, #f0f7ef)`
- **Accent Yellow/Gold:** `#f59e0b` (Alerts, Pending states)
- **Primary Text:** `#1d2a1f` / `#1f2937` (Dark Charcoal, 4.5:1+ contrast)
- **Secondary Text:** `#526354` / `#6b7280` (Muted Sage Grey)
- **Divider Hairlines:** `#e8efe6`

### 2.2 Reusable CSS Classes
```css
/* Raised clay card */
.clay-card {
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 7px 7px 18px rgba(35, 75, 45, 0.07), -5px -5px 15px rgba(255, 255, 255, 0.95);
  border: 1px solid #edf2ed;
}

/* Recessed form input */
.clay-input {
  background: #f8fbf8;
  border: 1px solid #e7eee7;
  border-radius: 12px;
  box-shadow: inset 3px 3px 7px rgba(35, 75, 45, 0.06), inset -3px -3px 7px #ffffff;
}

/* Raised primary action */
.clay-button {
  background: linear-gradient(135deg, #38a957, #21833f);
  color: white;
  border: none;
  border-radius: 13px;
  box-shadow: 4px 5px 10px rgba(35, 120, 60, 0.18);
}
```

---

## 3. Structural Information Architecture (11 Core Modules)

1. **Dashboard:** Role-tailored metrics, alerts, priority tasks, quick actions.
2. **Marketplace:** Produce listings, quality grades, bulk vs. retail, cart, checkout with M-Pesa escrow simulation, farmer chat.
3. **My Farm / My Business (Section 16 Comprehensive Farm Records):**
   - Farm Profiles & Plots (soil, irrigation, acreage)
   - Crop Production Cycles (planting, inputs, pests, harvests)
   - Livestock Records (breeds, tag IDs, vaccines, milk/eggs yield)
   - Farm Financials (expense ledger, income tracking, net margin)
   - Harvest & Inventory (storage, grading, marketplace connection)
   - Climate & Environmental observations (rainfall log, soil conservation)
   - Agricultural Extension & Training logs (officer visits, field reports)
   - Farm Diary & Photo Evidence (chronological events, reminders)
   - Farm Reports & Analytics (profitability, yield/acre, CSV/print export)
   - Offline Synchronization Engine (pending queue, sync indicator)
4. **Orders & Transactions:** Order pipeline, fulfillment stages, delivery verification OTP, payment escrow records.
5. **Farmers & FPOs:** Producer organization roster, aggregation hubs, member delivery tracking, commission split calculation.
6. **Climate & Agricultural Advisory:** 7-day agro-meteorological forecast, verified alerts, pest & disease advisories, crop calendars, farmer reporting tool.
7. **Maps & Discovery:** Real Leaflet OpenStreetMap with Kenya administrative filters (County → Sub-county → Ward), farm markers, collection points, geofenced privacy buffer.
8. **Training & Extension Services:** Field Farmer Schools (FFS), agronomy barazas, demo plots, extension officer request scheduling.
9. **Communication & Notifications:** WhatsApp alert bridge, direct farmer-buyer messaging, advisory broadcast announcements.
10. **Reports & Analytics:** Production yields, county-level food security data, economic indicators, exportable dossiers.
11. **Administration & Settings:** Role switcher, Kenyan administrative data manager, language preference (English / Kiswahili), privacy & offline storage management.

---

## 4. Implementation Phasing Strategy

- **Stage 1 (Architecture & Administrative Data):**
  - Implement complete Kenya administrative dataset (`kenyaLocations.ts`) covering key agricultural counties with real sub-counties, wards, and villages.
  - Implement Leaflet OpenStreetMap mapping engine with privacy radius and markers.
- **Stage 2 (Design System & Application Shell):**
  - Implement collapsible sidebar navigation, top bar with breadcrumbs and notification center, and mobile navigation.
  - Apply white claymorphism design system to CSS and component library.
- **Stage 3 (Section 16 Farm Records Management System):**
  - Build comprehensive multi-plot farm manager, crop production cycles, livestock herds, financial ledger, harvest inventory, climate diary, and offline-first synchronization engine.
- **Stage 4 (Role-Specific Dashboards):**
  - Build specialized views for Farmer, FPO, County Agricultural Officer, CBF, Transporter (Boda Rider), Buyer, Bulk Institutional Buyer, and Development Partner (NGO).
- **Stage 5 (Quality Assurance & Validation):**
  - Verify all 11 modules, test location dropdown cascades, test offline sync simulation, and run compilation/linting.
