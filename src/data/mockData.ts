import { AppState } from '@/contexts/AppContext';

export const mockData: AppState = {
  profile: {
    name: 'Ankit',
    phone: '+91 9876543210',
    email: 'ankit@example.com',
    referralCode: 'ANKIT2025'
  },
  liveStatus: [
    { type: 'bus', name: 'Bus #217', status: 'Arriving in 2 mins', location: 'Central Park Stop' },
    { type: 'metro', name: 'Yellow Line', status: 'Next train in 3 mins', location: 'Rajiv Chowk (Platform 2)' },
    { type: 'rrts', name: 'Delhi-Meerut', status: 'On Time', location: 'Sarai Kale Khan Station' },
    { type: 'bus', name: 'Bus #405', status: 'Delayed by 5 mins', location: 'Nehru Place Terminal' },
    { type: 'metro', name: 'Blue Line', status: 'Next train in 1 min', location: 'Noida Electronic City' },
    { type: 'bus', name: 'Bus #729', status: 'Arriving in 8 mins', location: 'Kapashera Border' },
    { type: 'metro', name: 'Violet Line', status: 'Next train in 4 mins', location: 'Kashmere Gate (Platform 5)' },
    { type: 'bus', name: 'Bus #534A', status: 'On Time', location: 'Anand Vihar ISBT' },
    { type: 'metro', name: 'Magenta Line', status: 'Next train in 2 mins', location: 'Hauz Khas (Platform 3)' },
    { type: 'rrts', name: 'Delhi-Alwar', status: 'Scheduled', location: 'INA Station' },
    { type: 'bus', name: 'Bus #181', status: 'Arriving in 1 min', location: 'Nizammudin Rly. Station' },
    { type: 'metro', name: 'Red Line', status: 'Next train in 5 mins', location: 'Dilshad Garden' },
    { type: 'bus', name: 'Bus #971', status: 'Arriving in 6 mins', location: 'Rohini Sector 1' },
    { type: 'metro', name: 'Pink Line', status: 'Next train in 3 mins', location: 'Lajpat Nagar' },
    { type: 'bus', name: 'Bus #355', status: 'On Time', location: 'Meer Vihar' }
  ],
  badges: [
    { icon: 'fa-leaf', color: 'text-green-500', title: 'Eco Warrior' },
    { icon: 'fa-piggy-bank', color: 'text-pink-500', title: 'Super Saver' },
    { icon: 'fa-star', color: 'text-yellow-500', title: 'Daily Commuter' },
    { icon: 'fa-moon', color: 'text-indigo-500', title: 'Night Owl' }
  ],
  coupons: [
    { title: '50% OFF', subtitle: 'On your next 2 Bike rides', provider: 'Rapido' },
    { title: '₹100 OFF', subtitle: 'On Uber Car rentals', provider: 'Uber' },
    { title: 'Free Meal', subtitle: 'With your next Ola ride', provider: 'Ola' }
  ],
  wallet: {
    balance: 1240.50,
    history: [
      { type: 'Added', amount: 2000, date: '2025-09-13', details: 'Added via Card' },
      { type: 'Ride', amount: -150, date: '2025-09-12', details: 'Car to Office' },
      { type: 'Added', amount: 500, date: '2025-09-11', details: 'Added via UPI' },
      { type: 'Ride', amount: -65, date: '2025-09-11', details: 'Bike to Gym' },
      { type: 'Food', amount: -320, date: '2025-09-10', details: 'Dinner at Farzi Cafe' },
      { type: 'Ride', amount: -20, date: '2025-09-10', details: 'Bus to Home' },
      { type: 'Ride', amount: -180, date: '2025-09-08', details: 'Car to Airport' },
      { type: 'Ride', amount: -85, date: '2025-09-07', details: 'Bike to Friend\'s House' },
      { type: 'Food', amount: -450, date: '2025-09-05', details: 'Lunch at Bukhara' },
      { type: 'Ride', amount: -50, date: '2025-09-04', details: 'Metro to Select Citywalk' }
    ]
  },
  tripHistory: [
    { from: 'Home', to: 'Work', mode: 'Car', cost: 150, date: '2025-09-12' },
    { from: 'Work', to: 'Gym', mode: 'Bike', cost: 65, date: '2025-09-11' },
    { from: 'Gym', to: 'Home', mode: 'Bus', cost: 20, date: '2025-09-10' },
    { from: 'Home', to: 'Airport', mode: 'Car', cost: 180, date: '2025-09-08' },
    { from: 'Home', to: 'Friend\'s House', mode: 'Bike', cost: 85, date: '2025-09-07' },
    { from: 'Select Citywalk', to: 'Home', mode: 'Metro', cost: 50, date: '2025-09-04' },
    { from: 'Home', to: 'Work', mode: 'Car', cost: 145, date: '2025-08-28' },
    { from: 'Work', to: 'Lodhi Garden', mode: 'Bike', cost: 70, date: '2025-08-26' }
  ],
  restaurants: [
    { name: 'Indian Accent', cuisine: 'Modern Indian', website: 'https://indianaccent.com/' },
    { name: 'Bukhara', cuisine: 'North Indian', website: 'https://www.itchotels.com/in/en/bukhara-itcmaurya' },
    { name: 'Karim\'s', cuisine: 'Mughlai', website: 'https://karimhoteldelhi.com/' },
    { name: 'Parikrama - The Revolving Restaurant', cuisine: 'Multi-Cuisine', website: 'http://www.parikramarestaurant.com/' },
    { name: 'Saravana Bhavan', cuisine: 'South Indian', website: 'https://saravanabhavan.com/' },
    { name: 'Dum Pukht', cuisine: 'Awadhi', website: 'https://www.itchotels.com/in/en/dumpukht-itcmaurya' },
    { name: 'The Big Chill Cakery', cuisine: 'Desserts', website: 'https://www.zomato.com/ncr/the-big-chill-cakery-khan-market-new-delhi' },
    { name: 'Gulati Restaurant', cuisine: 'North Indian', website: 'https://www.gulatirestaurant.in/' },
    { name: 'Farzi Cafe', cuisine: 'Modern Indian', website: 'https://www.farzicafe.com/' },
    { name: 'Social', cuisine: 'Continental', website: 'https://www.socialoffline.in/' }
  ],
  gyms: [
    { name: 'Cult.fit', offer: 'Free 3-Day Trial Pass', website: 'https://www.cult.fit/' },
    { name: 'Gold\'s Gym', offer: '20% OFF on Annual Plan', website: 'https://goldsgym.in/' },
    { name: 'Anytime Fitness', offer: '15% Discount on Couple Membership', website: 'https://www.anytimefitness.co.in/' },
    { name: 'Fitness First', offer: 'One Complimentary Personal Training Session', website: 'https://www.fitnessfirst.net.in/' },
    { name: 'Olympia Gym', offer: 'Flat 1000 OFF on Quarterly Plan', website: 'https://www.olympiagym.in/' },
    { name: 'The Gym Health Planet', offer: 'Student Discount Available', website: 'https://www.thegym.in/' },
    { name: 'Fluid Fitness', offer: 'Pay for 10 Months, Get 2 Free', website: 'http://www.fluidfitness.in/' },
    { name: 'Red Rocks Gym & Spa', offer: 'Free Spa Session on Enrollment', website: 'https://www.justdial.com/Delhi/Red-Rocks-Gym-Spa-Rohini-Sector-7/011PXX11-XX11-180312181124-E9B7_BZDET' }
  ],
  savingsReport: [
    { date: '2025-09-11', saved: 110, text: 'You saved ₹110 by taking the Bike instead of a Car.' },
    { date: '2025-09-10', saved: 175, text: 'You saved ₹175 by taking the Bus instead of a Car.' },
    { date: '2025-09-08', saved: 95, text: 'You saved ₹95 by taking the Bike instead of a Car.' },
    { date: '2025-09-04', saved: 130, text: 'You saved ₹130 by taking the Metro instead of a Car.' },
    { date: '2025-08-26', saved: 75, text: 'You saved ₹75 by taking the Bike instead of a Car.' }
  ],
  travelSpends: [
    { date: '2025-09-12', mode: 'Car', amount: 150 },
    { date: '2025-09-11', mode: 'Bike', amount: 65 },
    { date: '2025-09-10', mode: 'Bus', amount: 20 },
    { date: '2025-09-08', mode: 'Car', amount: 180 },
    { date: '2025-09-07', mode: 'Bike', amount: 85 }
  ],
  fitness: {
    today: { steps: 8450, distance: 6.2, calories: 350, goal: 10000, co2Saved: 0.8 },
    month1: { steps: 215320, distance: 158.2, calories: 8940, goal: 300000 },
    month2: { steps: 452780, distance: 332.5, calories: 18750, goal: 600000 },
    month3: { steps: 681430, distance: 500.1, calories: 28160, goal: 900000 }
  },
  myPlaces: [
    { id: 'home', label: 'Home', address: 'Sector 15, Noida', icon: 'fa-home' },
    { id: 'work', label: 'Work', address: 'Cyber City, Gurugram', icon: 'fa-briefcase' }
  ],
  notificationSettings: [
    { id: 'ride-updates', label: 'Ride Updates', checked: true },
    { id: 'wallet-transactions', label: 'Wallet Transactions', checked: true },
    { id: 'deals-offers', label: 'Deals & Offers', checked: false },
    { id: 'fitness-reminders', label: 'Fitness Reminders', checked: true }
  ],
  security: {
    twoFactorEnabled: false,
    loggedInDevices: [
      { device: 'iPhone 14 Pro', location: 'Delhi, India', time: 'Active Now', icon: 'fa-mobile-alt' },
      { device: 'MacBook Pro', location: 'Delhi, India', time: '2 hours ago', icon: 'fa-laptop' },
      { device: 'iPad Air', location: 'Mumbai, India', time: '1 day ago', icon: 'fa-tablet-alt' }
    ]
  }
};
