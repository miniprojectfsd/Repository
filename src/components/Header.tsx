import { ShoppingCart, User, LogOut, UtensilsCrossed } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  cartItemCount: number;
  onCartClick: () => void;
  onProfileClick: () => void;
}

export default function Header({ cartItemCount, onCartClick, onProfileClick }: HeaderProps) {
  const { signOut } = useAuth();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
              <UtensilsCrossed className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">FoodHub</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onProfileClick}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Profile"
            >
              <User className="w-5 h-5 text-gray-700" />
            </button>

            <button
              onClick={onCartClick}
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5 text-gray-700" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>

            <button
              onClick={signOut}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Logout"
            >
              <LogOut className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
