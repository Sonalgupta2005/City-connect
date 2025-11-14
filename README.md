# City Connect - Smart Commute Super App

A comprehensive travel and commute management app that helps users book rides, manage their wallet, track fitness, and save money through smart transportation choices.

## 🚀 Features

### Main Pages
- **Home**: Dashboard with today's snapshot, live transit status, coupons & badges, and an interactive map
- **Plan**: Book private rides (Uber, Ola, Rapido), compare prices, access public transport info, and view CityPass deals
- **Wallet**: Manage balance, view transaction history, upgrade commuter pass
- **Profile**: View personal stats, manage account settings, access activity reports

### Activity Tracking
- **Trip History**: Complete log of all past trips with mode and cost breakdown
- **Savings Report**: Track money saved by choosing eco-friendly transport options
- **Travel Spends**: Analyze spending patterns with customizable time filters
- **Fitness Activity**: Monitor steps, distance, calories burned, and CO2 saved
- **Eco Impact**: View environmental contribution and download achievement certificates

### Account Management
- **Personal Details**: Update profile information
- **My Places**: Save frequently visited locations (Home, Work, etc.)
- **Manage Notifications**: Customize notification preferences
- **Privacy & Security**: Two-factor authentication, device management
- **Invite & Earn**: Referral program to earn rewards

### Features Highlights
- 🌙 Dark mode support
- 📱 Mobile-first responsive design (optimized for 420px width)
- 🎨 Modern gradient UI with smooth animations
- 💾 Context-based state management
- 🔔 Toast notifications for user feedback
- 🗺️ OpenStreetMap integration
- 🎯 Real-time transit status updates

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui
- **Routing**: React Router v6
- **State Management**: React Context API
- **Icons**: Font Awesome 6
- **Notifications**: Sonner

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── SplashScreen.tsx
│   │   ├── BottomNavigation.tsx
│   │   └── MobileLayout.tsx
│   └── ui/                    # shadcn/ui components
├── contexts/
│   └── AppContext.tsx         # Global state management
├── data/
│   └── mockData.ts            # Mock data for the app
├── pages/
│   ├── Home.tsx               # Main home page
│   ├── Plan.tsx               # Ride booking & planning
│   ├── Wallet.tsx             # Wallet management
│   ├── Profile.tsx            # User profile
│   ├── NotFound.tsx           # 404 page
│   └── sub/                   # Sub-pages
│       ├── TransactionHistory.tsx
│       ├── TripHistory.tsx
│       ├── GymOffers.tsx
│       ├── FoodDining.tsx
│       ├── SavingsReport.tsx
│       ├── TravelSpends.tsx
│       ├── FitnessActivity.tsx
│       ├── EcoImpact.tsx
│       ├── PersonalDetails.tsx
│       ├── MyPlaces.tsx
│       ├── ManageNotifications.tsx
│       ├── PrivacySecurity.tsx
│       └── InviteEarn.tsx
├── App.tsx                    # App routing
└── index.css                  # Global styles & design system
```

## 🎨 Design System

The app uses a comprehensive design system defined in `src/index.css`:

- **Primary Color**: Blue gradient (#2563EB to #3B82F6)
- **Semantic Tokens**: Background, foreground, primary, secondary, muted, accent
- **Dark Mode**: Full dark mode support with automatic theme detection
- **Typography**: Inter font family
- **Animations**: Fade-in effects, progress rings, smooth transitions

## 🚦 Getting Started

### Prerequisites
- Node.js & npm installed ([install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating))

### Installation

```sh
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🔄 Converting to MERN Stack

This is currently a React-only frontend. To convert to a full MERN stack:

1. **Set up MongoDB**: Create a database schema for users, trips, transactions, etc.
2. **Create Express API**: Build REST APIs for:
   - User authentication & profile management
   - Wallet operations
   - Trip booking & history
   - Fitness tracking
   - Notification preferences
3. **Replace Context with API calls**: Update `AppContext.tsx` to fetch from backend
4. **Add authentication**: Implement JWT-based auth
5. **Real-time features**: Use Socket.io for live transit updates

## 📱 Key Components

### AppContext
Central state management for:
- User profile data
- Wallet balance & transactions
- Trip history
- Fitness metrics
- Notification settings
- Security preferences

### Mobile-First Design
- Maximum width: 420px
- Bottom navigation for main pages
- Full-screen sub-pages with back navigation
- Smooth page transitions

## 🎯 Future Enhancements

- [ ] Backend API integration
- [ ] Real payment gateway integration (Stripe/Razorpay)
- [ ] Real-time location tracking
- [ ] Push notifications
- [ ] Offline mode support
- [ ] Social features (share trips, challenges)
- [ ] Analytics dashboard

## 📄 License

This project was created as a prototype conversion from HTML to React.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with ❤️ using React, TypeScript, and Tailwind CSS
