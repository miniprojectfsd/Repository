import { useState, useEffect } from 'react';
import { Plus, MapPin, Flame } from 'lucide-react';
import { supabase, Database } from '../lib/supabase';
import { useCart } from '../contexts/CartContext';

type FoodItem = Database['public']['Tables']['food_items']['Row'];
type Category = 'Home Made' | 'Restaurant Made';
type MealType = 'Meals' | 'Snacks' | 'Dessert';

export default function FoodListing() {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category>('Home Made');
  const [selectedMealType, setSelectedMealType] = useState<MealType | 'All'>('All');
  const { addItem } = useCart();

  useEffect(() => {
    fetchFoodItems();
  }, [selectedCategory, selectedMealType]);

  const fetchFoodItems = async () => {
    setLoading(true);
    let query = supabase
      .from('food_items')
      .select('*')
      .eq('category', selectedCategory)
      .eq('is_available', true)
      .order('created_at', { ascending: false });

    if (selectedMealType !== 'All') {
      query = query.eq('meal_type', selectedMealType);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching food items:', error);
    } else {
      setFoodItems(data || []);
    }
    setLoading(false);
  };

  const handleAddToCart = (item: FoodItem) => {
    addItem(item);
  };

  const categories: Category[] = ['Home Made', 'Restaurant Made'];
  const mealTypes: (MealType | 'All')[] = ['All', 'Meals', 'Snacks', 'Dessert'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Browse Menu</h2>

        <div className="mb-4">
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {mealTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedMealType(type)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedMealType === type
                  ? 'bg-orange-100 text-orange-700 border border-orange-300'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      ) : foodItems.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">No items found in this category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {foodItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden"
            >
              <div className="h-48 bg-gradient-to-br from-orange-200 to-orange-300 flex items-center justify-center">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.food_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-6xl">🍽️</span>
                )}
              </div>

              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.food_name}</h3>

                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <span className="font-medium text-orange-600">{item.hotel_name}</span>
                </div>

                <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
                  <MapPin className="w-4 h-4" />
                  <span>{item.city}</span>
                </div>

                <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span>{item.calories} calories</span>
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{item.description}</p>

                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">
                    ₹{Number(item.price).toFixed(2)}
                  </span>
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
