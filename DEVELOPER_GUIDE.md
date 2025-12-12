# FoodHub - Complete Developer Guide for 5-Person Team

## Overview

A complete food ordering web application with login, food categories, filters, shopping cart, checkout, and email/SMS notifications. Built with React, TypeScript, Tailwind CSS, and Supabase in 30 days.

---

## Part 1: Initial Setup (Day 1)

### Step 1: Clone Repository & Install Dependencies

```bash
# Navigate to your project folder
cd /path/to/your/project

# Install all dependencies
npm install

# This will install:
# - React 18
# - TypeScript
# - Tailwind CSS
# - Supabase client
# - Lucide React icons
```

### Step 2: Verify Environment Variables

Check your `.env` file contains:
```
VITE_SUPABASE_URL=https://uqhtxpghgfconaedxtjl.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

These are already configured. If missing, contact your Supabase admin.

### Step 3: Verify Database is Ready

The database is pre-configured with:
- ✅ `food_items` table with 24 sample food items
- ✅ `orders` table for order management
- ✅ `order_items` table for order details
- ✅ Row Level Security (RLS) policies
- ✅ All necessary indexes

No additional database setup needed.

### Step 4: Test the Application

```bash
# Start development server
npm run dev

# You'll see:
# ➜  Local:   http://localhost:5173/
# ➜  press h to show help

# Open in browser: http://localhost:5173
```

---

## Part 2: Application Architecture

### Directory Structure

```
src/
├── components/              # UI Components (React files)
│   ├── Auth.tsx            # Login/Registration page
│   ├── Header.tsx          # Navigation header with cart icon
│   ├── FoodListing.tsx     # Main food browser with filters
│   ├── Cart.tsx            # Shopping cart sidebar
│   ├── Checkout.tsx        # Order form and payment
│   └── Profile.tsx         # User profile & order history
│
├── contexts/               # State Management (React Context)
│   ├── AuthContext.tsx     # User authentication state
│   └── CartContext.tsx     # Shopping cart state
│
├── lib/                    # Utilities & Configuration
│   └── supabase.ts        # Supabase client initialization
│
├── App.tsx                 # Main application component
├── main.tsx                # React entry point
├── index.css               # Global Tailwind styles
└── vite-env.d.ts          # TypeScript definitions

supabase/
└── functions/
    └── send-order-notification/
        └── index.ts        # Edge Function for notifications
```

### Data Flow Diagram

```
User Login (Auth.tsx)
    ↓
AuthContext (manages session)
    ↓
App.tsx (routes to FoodListing)
    ↓
FoodListing (displays food items from Supabase)
    ↓
Add to Cart → CartContext (stores in localStorage)
    ↓
View Cart (Cart.tsx) → Checkout (Checkout.tsx)
    ↓
Place Order → Save to Supabase
    ↓
Trigger Edge Function → Email/SMS Notifications
    ↓
View Order History (Profile.tsx)
```

---

## Part 3: Feature Implementation Guide

### Feature 1: Authentication (Login & Registration)

**File:** `src/components/Auth.tsx`

**What it does:**
- User can create account (Sign Up)
- User can log in with email/password
- Errors displayed if credentials invalid
- Redirects to food listing after login

**How to test:**
1. Go to http://localhost:5173
2. Click "Sign Up"
3. Enter email: `test@example.com`
4. Enter password: `password123`
5. Click "Create Account"
6. Switch to "Login" tab
7. Log in with same credentials
8. You should see the food listing page

**Key code locations:**
- Authentication logic: `src/contexts/AuthContext.tsx` (lines 35-52)
- UI components: `src/components/Auth.tsx` (lines 40-100)

---

### Feature 2: Browse Food by Category

**File:** `src/components/FoodListing.tsx`

**What it does:**
- Displays two category buttons: "Home Made" and "Restaurant Made"
- Each category fetches different food items from database
- Shows food name, hotel name, city, calories, description, and price
- Orange "Add" button to add items to cart

**How to test:**
1. After login, click "Home Made" (selected by default)
2. See food items from home cooks
3. Click "Restaurant Made" tab
4. See different restaurant food items

**Key code locations:**
- Category selection: `src/components/FoodListing.tsx` (lines 40-60)
- Database query: `src/components/FoodListing.tsx` (lines 21-41)

---

### Feature 3: Filter by Meal Type

**File:** `src/components/FoodListing.tsx`

**What it does:**
- Below category buttons: "All", "Meals", "Snacks", "Dessert" filter buttons
- When clicked, filters food items by meal type
- Highlights selected filter in orange

**How to test:**
1. Select "Home Made" category
2. Click "Meals" filter → See only meal items
3. Click "Snacks" filter → See only snacks
4. Click "Dessert" filter → See only desserts
5. Click "All" → See all items in category

**Key code locations:**
- Filter buttons: `src/components/FoodListing.tsx` (lines 65-85)
- Filter logic: `src/components/FoodListing.tsx` (lines 28-30)

---

### Feature 4: View Food Details

**File:** `src/components/FoodListing.tsx`

**What it does:**
Each food item card shows:
- Hotel Name (orange text)
- City (with location icon)
- Calories (with fire icon)
- Description (2-line preview)
- Price (bold, orange)

**Example food item:**
```
Butter Chicken
Spice Paradise
Mumbai
450 calories
Tender chicken pieces in rich tomato and butter gravy.
Contains chicken, butter, cream, tomatoes, cashews, and aromatic spices.
₹350.00
```

**Key code locations:**
- Card layout: `src/components/FoodListing.tsx` (lines 105-155)
- Database structure: `src/lib/supabase.ts` (lines 11-28)

---

### Feature 5: Shopping Cart

**File:** `src/components/Cart.tsx`

**What it does:**
- Click cart icon in header to open side panel
- Shows all items in cart with quantity
- Can increase/decrease quantity with +/- buttons
- Can remove items with X button
- Shows total price
- "Proceed to Checkout" button

**How to test:**
1. Click "Add" on any food item
2. Click shopping cart icon (top right)
3. See the item in cart
4. Click "+" to increase quantity
5. Click "-" to decrease quantity
6. Click "X" to remove item
7. Watch total price update

**Key code locations:**
- Cart state: `src/contexts/CartContext.tsx` (entire file)
- Cart UI: `src/components/Cart.tsx` (lines 20-100)
- LocalStorage persistence: `src/contexts/CartContext.tsx` (lines 27-30)

---

### Feature 6: Checkout & Order Placement

**File:** `src/components/Checkout.tsx`

**What it does:**
- Form with fields: Email, Phone, Address, Notes
- Shows order summary with all items
- User fills delivery details
- Clicks "Place Order" button
- Order saved to database
- Order items linked to order
- Email & SMS notifications triggered
- Success confirmation shown

**How to test:**
1. Add items to cart
2. Click cart icon → "Proceed to Checkout"
3. Fill in form:
   - Email: your@email.com
   - Phone: +91 9876543210
   - Address: Your complete address
   - Notes: Any special requests (optional)
4. Click "Place Order"
5. See success message with Order ID
6. Check Profile to see order history

**Key code locations:**
- Form submission: `src/components/Checkout.tsx` (lines 27-68)
- Database insert: `src/components/Checkout.tsx` (lines 33-42)
- Notification trigger: `src/components/Checkout.tsx` (lines 48-67)
- Success screen: `src/components/Checkout.tsx` (lines 72-96)

---

### Feature 7: Order History & Profile

**File:** `src/components/Profile.tsx`

**What it does:**
- Click profile icon (top right) to open profile
- Shows all orders user has placed
- Each order shows:
  - Order ID
  - Date & time
  - Status (pending/confirmed/preparing/delivered/cancelled)
  - Items ordered with quantities
  - Total amount
  - Delivery address
  - Contact phone

**How to test:**
1. Place an order (Feature 6)
2. Click profile icon
3. See your order in the list
4. See all order details

**Key code locations:**
- Profile component: `src/components/Profile.tsx` (entire file)
- Database query with relations: `src/components/Profile.tsx` (lines 25-42)

---

### Feature 8: Email & SMS Notifications

**File:** `supabase/functions/send-order-notification/index.ts`

**What it does:**
- When order is placed, Edge Function is triggered
- Function receives order details (email, phone, items, total)
- Creates formatted email message
- Creates SMS message
- Console logs messages (ready for real email/SMS service)

**How to test:**
1. Place an order with email and phone
2. Check browser console (F12)
3. Should see notification logs

**Current Status:**
- ✅ Function deployed and working
- ✅ Email format ready
- ✅ SMS format ready
- ⏳ Needs real email service (Resend/SendGrid)
- ⏳ Needs real SMS service (Twilio)

**Key code locations:**
- Edge Function: `supabase/functions/send-order-notification/index.ts`

---

## Part 4: Database Schema

### Tables

#### food_items
```
- id: UUID (unique identifier)
- food_name: Text (e.g., "Butter Chicken")
- hotel_name: Text (e.g., "Spice Paradise")
- city: Text (e.g., "Mumbai")
- description: Text (e.g., "Tender chicken in butter gravy...")
- calories: Integer (e.g., 450)
- category: Text ('Home Made' or 'Restaurant Made')
- meal_type: Text ('Meals', 'Snacks', or 'Dessert')
- price: Decimal (e.g., 350.00)
- image_url: Text (optional image URL)
- is_available: Boolean (true/false)
- created_at: Timestamp (when created)
```

#### orders
```
- id: UUID (unique order ID)
- user_id: UUID (references auth.users)
- total_amount: Decimal (total price)
- status: Text (pending/confirmed/preparing/delivered/cancelled)
- delivery_address: Text (where to deliver)
- phone_number: Text (contact phone)
- email: Text (contact email)
- notes: Text (optional special requests)
- created_at: Timestamp
- updated_at: Timestamp
```

#### order_items
```
- id: UUID
- order_id: UUID (references orders)
- food_item_id: UUID (references food_items)
- quantity: Integer (how many items)
- price_at_purchase: Decimal (price when ordered)
- created_at: Timestamp
```

### Sample Food Items

24 pre-loaded items including:
- Butter Chicken, Paneer Tikka Masala, Biryani
- Samosa, Pakora, Vada Pav, Pani Puri
- Gulab Jamun, Rasmalai, Kheer
- And more...

---

## Part 5: Development Workflow for Team

### Task Distribution for 5 Developers

**Developer 1: Frontend (UI Components)**
- Modify components in `src/components/`
- Add new UI features
- Update Tailwind styles
- Responsible for: `Auth.tsx`, `Header.tsx`, `Cart.tsx`, `Profile.tsx`

**Developer 2: Food Listing & Filters**
- Modify `src/components/FoodListing.tsx`
- Add new filters
- Optimize database queries
- Add search functionality

**Developer 3: Cart & Checkout**
- Modify `src/contexts/CartContext.tsx`
- Modify `src/components/Checkout.tsx`
- Handle payment integration
- Order validation

**Developer 4: Backend & Database**
- Supabase database management
- Add new tables/fields
- Update RLS policies
- Database optimization

**Developer 5: Integration & Testing**
- End-to-end testing
- Edge Function management
- Performance optimization
- Documentation

### Weekly Workflow

**Monday:**
- Team standup (15 min)
- Assign tasks for the week
- Code review previous week's PRs

**Tuesday-Thursday:**
- 2-hour development blocks
- Daily 30-min sync
- Code changes and testing

**Friday:**
- Merge all PRs to main
- Test full application
- Deploy to staging
- Weekend demo preparation

---

## Part 6: Common Development Tasks

### Adding a New Food Item

```bash
# Connect to Supabase dashboard
# Go to SQL Editor
# Run this query:

INSERT INTO food_items (
  food_name, hotel_name, city, description,
  calories, category, meal_type, price
) VALUES (
  'Pizza Margherita',
  'Italian Corner',
  'Mumbai',
  'Classic pizza with tomatoes, mozzarella, and basil',
  480,
  'Restaurant Made',
  'Meals',
  450.00
);
```

### Modifying Component Styles

```typescript
// In any component file, use Tailwind classes
<div className="bg-orange-500 text-white px-4 py-2 rounded-lg">
  Your content here
</div>

// Common Tailwind classes:
// bg-[color]-[shade]: background color
// text-[color]-[shade]: text color
// px-[size], py-[size]: padding
// rounded-[size]: border radius
// hover:bg-[color]: hover effects
```

### Adding a New Filter

```typescript
// In src/components/FoodListing.tsx

// 1. Add new filter type (line 8)
type FilterType = 'Vegetarian' | 'Non-Veg' | 'Vegan';

// 2. Add state (line 14)
const [selectedFilter, setSelectedFilter] = useState<FilterType>('Vegetarian');

// 3. Add to database query (line 35)
query = query.eq('dietary_type', selectedFilter);

// 4. Add UI buttons (similar to lines 65-85)
```

### Creating a New Component

```bash
# Create new file in src/components/
# Example: src/components/MyNewComponent.tsx

# Template:
import { useAuth } from '../contexts/AuthContext';

interface MyComponentProps {
  prop1: string;
  onAction: () => void;
}

export default function MyComponent({ prop1, onAction }: MyComponentProps) {
  return (
    <div className="p-4">
      <h2>{prop1}</h2>
      <button onClick={onAction} className="bg-orange-500 text-white px-4 py-2">
        Click me
      </button>
    </div>
  );
}

# Export from App.tsx when needed
```

---

## Part 7: Testing Checklist

### Authentication Testing
- [ ] Sign up with new email works
- [ ] Login with correct credentials works
- [ ] Login with wrong password shows error
- [ ] Login with non-existent email shows error
- [ ] Logout clears session
- [ ] Page redirects to login if not authenticated

### Food Browsing
- [ ] "Home Made" category shows home-cooked items
- [ ] "Restaurant Made" category shows restaurant items
- [ ] "Meals" filter shows only meals
- [ ] "Snacks" filter shows only snacks
- [ ] "Dessert" filter shows only desserts
- [ ] "All" filter shows everything in category
- [ ] Food details display correctly (name, hotel, city, calories, description, price)

### Shopping Cart
- [ ] Add item to cart increases cart count
- [ ] Cart icon shows item count badge
- [ ] Remove item removes from cart and updates count
- [ ] Increase quantity updates total price
- [ ] Decrease quantity updates total price
- [ ] Cart persists on page refresh

### Checkout
- [ ] Form validation works (all fields required)
- [ ] Order summary shows all items and prices
- [ ] Total price calculated correctly
- [ ] Place order saves to database
- [ ] Success message shows order ID
- [ ] Cart clears after order

### Order History
- [ ] Profile shows all user's orders
- [ ] Order details display correctly
- [ ] Order status shows (pending/confirmed/etc)
- [ ] Item quantities match what was ordered
- [ ] Total amount matches order summary
- [ ] Delivery address displays correctly

### Database
- [ ] 24 food items pre-loaded
- [ ] All categories have items
- [ ] All meal types represented
- [ ] Prices are reasonable
- [ ] Descriptions are informative

---

## Part 8: Troubleshooting

### Issue: Build fails with "Could not resolve"
```bash
# Solution:
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Issue: Login not working
```bash
# Check:
1. .env file has correct Supabase URL and key
2. Supabase Auth is enabled in dashboard
3. Clear browser cache and localStorage
4. Check browser console for errors (F12)
```

### Issue: Food items not loading
```bash
# Check:
1. Supabase connection is working
2. food_items table has data
3. RLS policies allow read access
4. Check browser console for errors

# To manually verify:
# Go to Supabase Dashboard → SQL Editor
# SELECT * FROM food_items LIMIT 5;
```

### Issue: Orders not saving
```bash
# Check:
1. User is authenticated
2. orders table exists
3. RLS policies allow INSERT
4. Checkout form validates correctly
5. Phone number is not empty
```

### Issue: Cart not persisting
```bash
# Solution:
# Check localStorage is enabled in browser
# Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
# Clear localStorage and try again
```

---

## Part 9: Production Deployment

### Before Deploying

```bash
# Run full build
npm run build

# Check for type errors
npm run typecheck

# Run linter
npm run lint

# Test all features manually
npm run dev
```

### Deploy to Vercel (Recommended)

```bash
# 1. Push code to GitHub
git add .
git commit -m "Ready for deployment"
git push origin main

# 2. Go to https://vercel.com
# 3. Connect GitHub repository
# 4. Add environment variables:
#    - VITE_SUPABASE_URL
#    - VITE_SUPABASE_ANON_KEY
# 5. Click "Deploy"
```

### Deploy to Netlify

```bash
# 1. Build the project
npm run build

# 2. Drag and drop `dist` folder to Netlify
# 3. Add environment variables in Netlify dashboard
```

---

## Part 10: Next Steps & Enhancements

### Phase 2 (After 30 days)
- [ ] Real email service (Resend or SendGrid)
- [ ] Real SMS service (Twilio)
- [ ] Payment integration (Stripe or Razorpay)
- [ ] User reviews and ratings
- [ ] Admin dashboard

### Phase 3 (Optional)
- [ ] Real-time order tracking with maps
- [ ] Loyalty points system
- [ ] Promotional codes
- [ ] Recommendation engine
- [ ] Mobile app version

---

## Contact & Support

- **Database Issues**: Check Supabase dashboard
- **Authentication Issues**: Check Auth settings in Supabase
- **Build Issues**: Run `npm install` and `npm run build`
- **Component Issues**: Check React DevTools and browser console

---

**Ready to build? Start with `npm run dev` and begin coding!**
