import { useState } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { CartProvider, useCart } from "./contexts/CartContext";

import Login from "./components/Login";
import Header from "./components/Header";
import Food from "./components/Food";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import Profile from "./components/Profile";

function AppContent() {
  const { user, loading } = useAuth();
  const { itemCount } = useCart();

  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return <Login />;
  }

  // Logged in UI
  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        cartItemCount={itemCount}
        onCartClick={() => setShowCart(true)}
        onProfileClick={() => setShowProfile(true)}
      />

      <Food />

      {showCart && (
        <Cart
          onClose={() => setShowCart(false)}
          onCheckout={() => {
            setShowCart(false);
            setShowCheckout(true);
          }}
        />
      )}

      {showCheckout && (
        <Checkout
          onClose={() => setShowCheckout(false)}
          onBack={() => {
            setShowCheckout(false);
            setShowCart(true);
          }}
        />
      )}

      {showProfile && (
        <Profile onClose={() => setShowProfile(false)} />
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
