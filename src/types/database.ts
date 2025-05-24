export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      recipes: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          instructions: string;
          prep_time: number | null;
          cook_time: number | null;
          servings: number | null;
          difficulty: "easy" | "medium" | "hard" | null;
          cuisine_type: string | null;
          dietary_restrictions: string[] | null;
          image_url: string | null;
          created_by: string;
          created_at: string;
          updated_at: string;
          is_public: boolean;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          instructions: string;
          prep_time?: number | null;
          cook_time?: number | null;
          servings?: number | null;
          difficulty?: "easy" | "medium" | "hard" | null;
          cuisine_type?: string | null;
          dietary_restrictions?: string[] | null;
          image_url?: string | null;
          created_by: string;
          created_at?: string;
          updated_at?: string;
          is_public?: boolean;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          instructions?: string;
          prep_time?: number | null;
          cook_time?: number | null;
          servings?: number | null;
          difficulty?: "easy" | "medium" | "hard" | null;
          cuisine_type?: string | null;
          dietary_restrictions?: string[] | null;
          image_url?: string | null;
          created_by?: string;
          created_at?: string;
          updated_at?: string;
          is_public?: boolean;
        };
      };
      ingredients: {
        Row: {
          id: string;
          recipe_id: string;
          name: string;
          amount: number;
          unit: string;
          notes: string | null;
          order_index: number;
        };
        Insert: {
          id?: string;
          recipe_id: string;
          name: string;
          amount: number;
          unit: string;
          notes?: string | null;
          order_index: number;
        };
        Update: {
          id?: string;
          recipe_id?: string;
          name?: string;
          amount?: number;
          unit?: string;
          notes?: string | null;
          order_index?: number;
        };
      };
      recipe_categories: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          created_at?: string;
        };
      };
      recipe_category_assignments: {
        Row: {
          recipe_id: string;
          category_id: string;
          created_at: string;
        };
        Insert: {
          recipe_id: string;
          category_id: string;
          created_at?: string;
        };
        Update: {
          recipe_id?: string;
          category_id?: string;
          created_at?: string;
        };
      };
      meal_plans: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          start_date: string;
          end_date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          start_date: string;
          end_date: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          start_date?: string;
          end_date?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      meal_plan_recipes: {
        Row: {
          id: string;
          meal_plan_id: string;
          recipe_id: string;
          planned_date: string;
          meal_type: "breakfast" | "lunch" | "dinner" | "snack";
          servings: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          meal_plan_id: string;
          recipe_id: string;
          planned_date: string;
          meal_type: "breakfast" | "lunch" | "dinner" | "snack";
          servings: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          meal_plan_id?: string;
          recipe_id?: string;
          planned_date?: string;
          meal_type?: "breakfast" | "lunch" | "dinner" | "snack";
          servings?: number;
          created_at?: string;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}
