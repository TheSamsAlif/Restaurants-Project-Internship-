# Resto POS — patch notes

Scope: the 5 tasks below only. Everything else in the project — architecture,
routes, business logic, database (localStorage) shape, styling elsewhere,
existing components — is untouched. Diff the zip against your original
project folder to see the exact change set; it's small and surgical.

## Before you run it
No `node_modules` are included (none were installed in the sandbox this was
built in, and no new packages were added). From the `pos/` folder:
```
npm install
npm run dev    # or: quasar dev
```

## Task 1 — Login & Registration UI
- `src/css/app.scss`: added a `--surface-glass` / `--surface-glass-border`
  token pair (light + dark) and one new utility class, `.glass-card`. Nothing
  existing in this file was changed — `.surface-card` and every other class
  are byte-identical.
- `src/components/auth/LoginForm.vue`, `RegisterCard.vue`: added the
  `glass-card` class to the auth `<q-card>`, gave the card real padding
  (34px desktop / 26px mobile), and widened the field gap from 4px to 18px
  so filled inputs read as separate controls instead of a merged stack.
  Auth logic, field order, validation rules and the password-eye toggle are
  unchanged.

## Task 2 — English + বাংলা
- New, dependency-free i18n layer (no vue-i18n install needed):
  - `src/i18n/en.js`, `src/i18n/bn.js` — flat dictionaries, UI text only.
    Customer names, invoice numbers, table/seat numbers, prices, dates, item
    and category names, restaurant names are **not** in here — they stay
    data-driven, exactly as the brief asked.
  - `src/stores/locale.js` — a Pinia store mirroring your existing
    `stores/theme.js` pattern, persisted the same way.
  - `src/composables/useI18n.js` — `const { t, locale, setLocale } = useI18n()`.
  - `src/components/common/LanguageSwitcher.vue` — the "EN | বাংলা" control,
    placed in `AppLayout`'s header (desktop) / below it (mobile), and on the
    `AuthPage` (top-right of the card) since login/register happen before
    a language would otherwise be reachable.
- Every page/dialog listed in the brief (Login, Registration, Dashboard nav,
  Orders, Items, Restaurant setup, Invoices/Invoice history, all buttons,
  form labels, empty states, validation & error messages) now reads through
  `t(...)`. `src/utils/validators.js` keeps its exact original function
  signatures — it now resolves its default messages through the same
  composable, so nothing calling it needed to change.
- `src/stores/auth.js`: login/register failure results now also carry a
  `code` (`invalidCredentials`, `emailExists`) alongside the original
  `message` string, so the UI can show the message in the active language.
  The auth logic itself (what counts as success/failure) is unchanged.
- The on-screen invoice slip (`InvoiceSlip.vue`) is bilingual; the
  downloaded/printed invoice text and PDF (`utils/invoice.js`) were left
  exactly as they were, per the "don't change the invoice template" rule.

## Task 3 — Responsive (desktop unchanged)
Existing breakpoints (drawer collapse, bottom tab bar, login/register
hero split) were already in place and untouched. Added, all as
max-width media queries that only apply *below* the existing desktop
layout, so nothing on desktop moved:
- Order screen: menu grid drops to a tighter column size, the sticky order
  ticket becomes static (stacks below the menu) under 1024px.
- Items grid and Restaurant grid: tighter columns / single column on phones.
- Invoice ledger rows: tighter padding and a smaller amount font under
  480px / 360px so the row never overflows.
- Invoice action row (Print/Text/PDF) wraps instead of clipping under 360px.
- Header restaurant name truncates with an ellipsis instead of overflowing
  next to the language switcher on narrow screens.

## Task 4 — Invoice History details
Investigation found this was **already implemented**: clicking an invoice
row (or its chevron) in `InvoicePage.vue` already opens `InvoiceDialog.vue`,
which renders the full `InvoiceSlip.vue` (invoice #, date, customer, phone,
table/seat, every line item with qty/price/amount, subtotal, VAT, total,
status) plus working Print / Text / PDF buttons and Complete/Reopen. No
existing behavior here needed to change.

The one real gap: a completed order's `completedAt` timestamp was already
being saved (`stores/orders.js` → `complete()`) but never shown anywhere.
Added one line to `InvoiceSlip.vue` that displays it for completed orders —
no new data invented, just surfacing what was already stored.

## Task 5 — Table + seat double-booking
`stores/orders.js` has no start/end-time or duration field to compare
(there's no reservation/time-slot model in this project at all), so per the
brief's instruction to use the project's *actual* existing model: a table +
seat is "booked" for exactly as long as an `upcoming` order exists against
it, and free again the moment that order is `completed`. That is the
project's real, existing definition of occupancy — nothing arbitrary added.

- `findActiveBookingConflict()` (new getter) checks table + seat (+ branch,
  when set) against every `upcoming` order.
- `placeOrder()` (existing action) now runs that check **immediately before
  persisting**, not just when the table was first picked, and returns
  `{ ok: false, code: 'conflict', table, seat }` instead of silently
  succeeding when there's a clash. This is the single authoritative check —
  there's no separate backend in this project (Pinia + localStorage
  *is* the data layer), so this is the right place for it.
- `OrderPage.vue` surfaces the rejection as
  `"Table {table}, Seat {seat} is already booked for this time."` /
  `"টেবিল {table}, সিট {seat} এই সময়ের জন্য ইতিমধ্যে বুক করা আছে।"` and does
  **not** place the order. The conflicting existing order is left untouched.
- Booking a *different* table/seat, or the same table/seat once the earlier
  order is completed, is unaffected and still succeeds.
