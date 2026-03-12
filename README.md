# PantryPal 🏠

**Never forget your Indian groceries again.**

PantryPal helps Indian households track their pantry, predict when items will run out, and order directly through quick commerce apps like Blinkit, Zepto, and BigBasket.

## Features

- **Smart Onboarding** — Choose cuisine (North/South/Pan-Indian), diet, household size → auto-populated grocery list
- **Pantry Tracking** — 4-tap stock check: Full / Have Some / Running Low / Empty
- **Guest Mode** — Temporarily scale quantities when hosting guests
- **Consumption Prediction** — Learns your usage patterns to predict when items run out
- **Shopping List Generation** — Auto-generates order from low/empty items
- **Quick Commerce Integration** — Deep links to Blinkit, Zepto, BigBasket, Swiggy Instamart, JioMart, Amazon Fresh
- **WhatsApp Sharing** — Send list to local kirana store via WhatsApp

## Tech Stack

| Layer | Stack |
|-------|-------|
| Mobile | Expo SDK 51, Expo Router v3, TypeScript, NativeWind v4, Zustand, TanStack React Query |
| Backend | Node.js, Express, MongoDB, Mongoose, JWT, bcrypt |
| AI (V2) | Python + FastAPI, Google Cloud Vision / YOLOv8 |

## Project Structure

```
PantryPal/
├── backend/
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API endpoints
│   ├── services/        # Business logic (prediction, scaling)
│   ├── middleware/       # Auth middleware
│   ├── data/            # Seed data & grocery templates
│   └── server.js        # Express entry point
├── mobile/
│   ├── app/             # Expo Router screens
│   │   ├── (auth)/      # Login, Register
│   │   ├── (onboarding)/ # Household, Grocery Setup, Apps
│   │   └── (tabs)/      # Home, Pantry, Check, Order, Profile
│   ├── components/      # UI primitives & grocery components
│   ├── features/        # Auth, Pantry, Shopping, Household
│   └── lib/             # API client, storage, theme, constants
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB running locally
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator or Android Emulator (or Expo Go on phone)

### Backend

```bash
cd backend
cp .env.example .env     # Edit with your values
npm install
npm run seed             # Populate grocery templates
npm run dev              # Starts on port 5002
```

### Mobile

```bash
cd mobile
npm install
npx expo start           # Scan QR with Expo Go, or press i/a for simulator
```

> **Important:** Update `API_URL` in `mobile/lib/constants.ts` with your machine's local IP address (e.g., `http://192.168.x.x:5002/api`).

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/household` | Update household settings |
| GET | `/api/household/templates` | Get grocery templates |
| POST | `/api/household/apply-template` | Apply template to pantry |
| GET | `/api/pantry` | Get all pantry items |
| GET | `/api/pantry/low` | Get low/empty items |
| POST | `/api/pantry/check` | Submit pantry check |
| POST | `/api/shopping/generate` | Generate shopping list |
| GET | `/api/shopping/:id/deeplinks` | Get app deep links |

## V2 Roadmap

- 📸 AI pantry scanning (camera → stock analysis)
- 🔔 Push notification reminders for pantry checks
- 📊 Consumption analytics dashboard
- 🤖 Smart reorder suggestions based on history
- 🏪 Direct kirana store WhatsApp ordering flow
