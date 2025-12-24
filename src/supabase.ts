import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      food_items: {
        Row: {
          id: string;
          food_name: string;
          hotel_name: string;
          city: string;
          description: string;
          calories: number;
          category: 'Home Made' | 'Restaurant Made';
          meal_type: 'Meals' | 'Snacks' | 'Dessert';
          price: number;
          image_url: string;
          is_available: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['food_items']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['food_items']['Insert']>;
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          total_amount: number;
          status: 'pending' | 'confirmed' | 'preparing' | 'delivered' | 'cancelled';
          delivery_address: string;
          phone_number: string;
          email: string;
          notes: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['orders']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['orders']['Insert']>;
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          food_item_id: string;
          quantity: number;
          price_at_purchase: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['order_items']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['order_items']['Insert']>;
      };
    };
  };
};
