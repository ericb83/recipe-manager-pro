import { supabase } from "./supabase";
import { Database } from "@/types/database";

export type Recipe = Database["public"]["Tables"]["recipes"]["Row"];
export type RecipeInsert = Database["public"]["Tables"]["recipes"]["Insert"];
export type RecipeUpdate = Database["public"]["Tables"]["recipes"]["Update"];
export type Ingredient = Database["public"]["Tables"]["ingredients"]["Row"];
export type IngredientInsert =
  Database["public"]["Tables"]["ingredients"]["Insert"];

export interface RecipeWithIngredients extends Recipe {
  ingredients: Ingredient[];
}

export interface RecipeFormData {
  title: string;
  description: string;
  instructions: string;
  prep_time: number;
  cook_time: number;
  servings: number;
  difficulty: "easy" | "medium" | "hard";
  cuisine_type: string;
  dietary_restrictions: string[];
  ingredients: {
    name: string;
    amount: number;
    unit: string;
    notes?: string;
  }[];
}

// Get all recipes for the current user
export async function getUserRecipes(): Promise<RecipeWithIngredients[]> {
  const { data: recipes, error: recipesError } = await supabase
    .from("recipes")
    .select(
      `
      *,
      ingredients (*)
    `
    )
    .order("created_at", { ascending: false });

  if (recipesError) {
    console.error("Error fetching recipes:", recipesError);
    throw recipesError;
  }

  return recipes as RecipeWithIngredients[];
}

// Get a single recipe by ID
export async function getRecipe(
  id: string
): Promise<RecipeWithIngredients | null> {
  const { data: recipe, error } = await supabase
    .from("recipes")
    .select(
      `
      *,
      ingredients (*)
    `
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching recipe:", error);
    return null;
  }

  return recipe as RecipeWithIngredients;
}

// Create a new recipe
export async function createRecipe(
  recipeData: RecipeFormData
): Promise<Recipe | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  // Insert the recipe
  const { data: recipe, error: recipeError } = await supabase
    .from("recipes")
    .insert({
      title: recipeData.title,
      description: recipeData.description,
      instructions: recipeData.instructions,
      prep_time: recipeData.prep_time,
      cook_time: recipeData.cook_time,
      servings: recipeData.servings,
      difficulty: recipeData.difficulty,
      cuisine_type: recipeData.cuisine_type,
      dietary_restrictions: recipeData.dietary_restrictions,
      created_by: user.id,
    })
    .select()
    .single();

  if (recipeError) {
    console.error("Error creating recipe:", recipeError);
    throw recipeError;
  }

  // Insert ingredients
  if (recipeData.ingredients.length > 0) {
    const ingredientsToInsert = recipeData.ingredients.map(
      (ingredient, index) => ({
        recipe_id: recipe.id,
        name: ingredient.name,
        amount: ingredient.amount,
        unit: ingredient.unit,
        notes: ingredient.notes || null,
        order_index: index,
      })
    );

    const { error: ingredientsError } = await supabase
      .from("ingredients")
      .insert(ingredientsToInsert);

    if (ingredientsError) {
      console.error("Error creating ingredients:", ingredientsError);
      // Clean up the recipe if ingredients failed
      await supabase.from("recipes").delete().eq("id", recipe.id);
      throw ingredientsError;
    }
  }

  return recipe;
}

// Update a recipe
export async function updateRecipe(
  id: string,
  recipeData: RecipeFormData
): Promise<Recipe | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  // Update the recipe
  const { data: recipe, error: recipeError } = await supabase
    .from("recipes")
    .update({
      title: recipeData.title,
      description: recipeData.description,
      instructions: recipeData.instructions,
      prep_time: recipeData.prep_time,
      cook_time: recipeData.cook_time,
      servings: recipeData.servings,
      difficulty: recipeData.difficulty,
      cuisine_type: recipeData.cuisine_type,
      dietary_restrictions: recipeData.dietary_restrictions,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (recipeError) {
    console.error("Error updating recipe:", recipeError);
    throw recipeError;
  }

  // Delete existing ingredients
  await supabase.from("ingredients").delete().eq("recipe_id", id);

  // Insert new ingredients
  if (recipeData.ingredients.length > 0) {
    const ingredientsToInsert = recipeData.ingredients.map(
      (ingredient, index) => ({
        recipe_id: id,
        name: ingredient.name,
        amount: ingredient.amount,
        unit: ingredient.unit,
        notes: ingredient.notes || null,
        order_index: index,
      })
    );

    const { error: ingredientsError } = await supabase
      .from("ingredients")
      .insert(ingredientsToInsert);

    if (ingredientsError) {
      console.error("Error updating ingredients:", ingredientsError);
      throw ingredientsError;
    }
  }

  return recipe;
}

// Delete a recipe
export async function deleteRecipe(id: string): Promise<void> {
  const { error } = await supabase.from("recipes").delete().eq("id", id);

  if (error) {
    console.error("Error deleting recipe:", error);
    throw error;
  }
}

// Search recipes
export async function searchRecipes(
  query: string
): Promise<RecipeWithIngredients[]> {
  const { data: recipes, error } = await supabase
    .from("recipes")
    .select(
      `
      *,
      ingredients (*)
    `
    )
    .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error searching recipes:", error);
    throw error;
  }

  return recipes as RecipeWithIngredients[];
}

// Filter recipes
export async function filterRecipes(filters: {
  difficulty?: string;
  cuisine_type?: string;
  dietary_restrictions?: string[];
}): Promise<RecipeWithIngredients[]> {
  let query = supabase.from("recipes").select(`
      *,
      ingredients (*)
    `);

  if (filters.difficulty) {
    query = query.eq("difficulty", filters.difficulty);
  }

  if (filters.cuisine_type) {
    query = query.eq("cuisine_type", filters.cuisine_type);
  }

  if (filters.dietary_restrictions && filters.dietary_restrictions.length > 0) {
    query = query.contains(
      "dietary_restrictions",
      filters.dietary_restrictions
    );
  }

  const { data: recipes, error } = await query.order("created_at", {
    ascending: false,
  });

  if (error) {
    console.error("Error filtering recipes:", error);
    throw error;
  }

  return recipes as RecipeWithIngredients[];
}
