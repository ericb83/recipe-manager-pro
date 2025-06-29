"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  ChefHat,
  Plus,
  Search,
  Calendar,
  BookOpen,
  Settings,
  LogOut,
  Clock,
  Users,
  Star,
  Filter,
} from "lucide-react";
import {
  getUserRecipes,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  searchRecipes,
  filterRecipes,
  RecipeWithIngredients,
  RecipeFormData,
} from "@/lib/recipes";
import { testSupabaseConnection, getSupabaseConfig } from "@/lib/supabase-test";
import { RecipeForm } from "./RecipeForm";
import { RecipeDetail } from "./RecipeDetail";

export function Dashboard() {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState("recipes");
  const [recipes, setRecipes] = useState<RecipeWithIngredients[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<
    RecipeWithIngredients[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({
    difficulty: "",
    cuisine_type: "",
    dietary_restrictions: [] as string[],
  });

  // Modal states
  const [isRecipeFormOpen, setIsRecipeFormOpen] = useState(false);
  const [isRecipeDetailOpen, setIsRecipeDetailOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] =
    useState<RecipeWithIngredients | null>(null);
  const [editingRecipe, setEditingRecipe] =
    useState<RecipeWithIngredients | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<{
    success: boolean;
    error?: string;
    suggestion?: string;
    message?: string;
  } | null>(null);

  const handleSignOut = async () => {
    await signOut();
  };

  // Test connection and fetch recipes on component mount
  useEffect(() => {
    const initializeApp = async () => {
      // Test Supabase connection first
      const status = await testSupabaseConnection();
      setConnectionStatus(status);

      // Only fetch recipes if connection is successful
      if (status.success) {
        await fetchRecipes();
      }
    };

    initializeApp();
  }, []);

  // Handle search and filtering
  useEffect(() => {
    handleFilterRecipes();
  }, [recipes, searchQuery, selectedFilters]);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const userRecipes = await getUserRecipes();
      setRecipes(userRecipes);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterRecipes = async () => {
    try {
      let filtered = recipes;

      // Apply search
      if (searchQuery.trim()) {
        filtered = await searchRecipes(searchQuery);
      }

      // Apply filters
      if (
        selectedFilters.difficulty ||
        selectedFilters.cuisine_type ||
        selectedFilters.dietary_restrictions.length > 0
      ) {
        const filterOptions = {
          difficulty: selectedFilters.difficulty || undefined,
          cuisine_type: selectedFilters.cuisine_type || undefined,
          dietary_restrictions:
            selectedFilters.dietary_restrictions.length > 0
              ? selectedFilters.dietary_restrictions
              : undefined,
        };
        filtered = await filterRecipes(filterOptions);
      }

      setFilteredRecipes(filtered);
    } catch (error) {
      console.error("Error filtering recipes:", error);
      setFilteredRecipes(recipes);
    }
  };

  const handleCreateRecipe = async (recipeData: RecipeFormData) => {
    try {
      setIsSubmitting(true);
      await createRecipe(recipeData);
      await fetchRecipes(); // Refresh the list
      setIsRecipeFormOpen(false);
    } catch (error) {
      console.error("Error creating recipe:", error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateRecipe = async (recipeData: RecipeFormData) => {
    if (!editingRecipe) return;

    try {
      setIsSubmitting(true);
      await updateRecipe(editingRecipe.id, recipeData);
      await fetchRecipes(); // Refresh the list
      setIsRecipeFormOpen(false);
      setEditingRecipe(null);
    } catch (error) {
      console.error("Error updating recipe:", error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRecipe = async (recipeId: string) => {
    if (!confirm("Are you sure you want to delete this recipe?")) return;

    try {
      await deleteRecipe(recipeId);
      await fetchRecipes(); // Refresh the list
      setIsRecipeDetailOpen(false);
      setSelectedRecipe(null);
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };

  const openAddRecipeForm = () => {
    setEditingRecipe(null);
    setIsRecipeFormOpen(true);
  };

  const openEditRecipeForm = (recipe: RecipeWithIngredients) => {
    setEditingRecipe(recipe);
    setIsRecipeFormOpen(true);
    setIsRecipeDetailOpen(false);
  };

  const openRecipeDetail = (recipe: RecipeWithIngredients) => {
    setSelectedRecipe(recipe);
    setIsRecipeDetailOpen(true);
  };

  const getTotalTime = (recipe: RecipeWithIngredients) => {
    const prep = recipe.prep_time || 0;
    const cook = recipe.cook_time || 0;
    return prep + cook;
  };

  const getDifficultyColor = (difficulty: string | null) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const stats = [
    {
      label: "Total Recipes",
      value: recipes.length.toString(),
      icon: <BookOpen className="h-6 w-6" />,
    },
    { label: "Meal Plans", value: "0", icon: <Calendar className="h-6 w-6" /> },
    {
      label: "Avg Cook Time",
      value:
        recipes.length > 0
          ? `${Math.round(
              recipes.reduce((acc, recipe) => acc + getTotalTime(recipe), 0) /
                recipes.length
            )} min`
          : "0 min",
      icon: <Clock className="h-6 w-6" />,
    },
    {
      label: "Cuisines",
      value: new Set(
        recipes.map((r) => r.cuisine_type).filter(Boolean)
      ).size.toString(),
      icon: <Users className="h-6 w-6" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <ChefHat className="h-8 w-8 text-orange-500 mr-2" />
              <h1 className="text-xl font-bold text-gray-900">
                Recipe Manager Pro
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                Welcome, {user?.user_metadata?.full_name || user?.email}
              </span>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 text-gray-500 hover:text-gray-700"
              >
                <LogOut className="h-5 w-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: "recipes", label: "My Recipes", icon: BookOpen },
              { id: "meal-plans", label: "Meal Plans", icon: Calendar },
              { id: "shopping", label: "Shopping Lists", icon: Search },
              { id: "settings", label: "Settings", icon: Settings },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 text-sm font-medium ${
                  activeTab === tab.id
                    ? "border-orange-500 text-orange-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Connection Status Banner */}
        {connectionStatus && !connectionStatus.success && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <svg
                  className="h-6 w-6 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-red-800 font-medium">
                  Database Connection Issue
                </h3>
                <p className="text-red-700 text-sm mt-1">
                  <strong>Error:</strong> {connectionStatus.error}
                </p>
                <p className="text-red-700 text-sm mt-2">
                  <strong>Solution:</strong> {connectionStatus.suggestion}
                </p>
                <details className="mt-3">
                  <summary className="text-red-700 text-sm cursor-pointer hover:text-red-800">
                    Show debugging info
                  </summary>
                  <div className="mt-2 p-3 bg-red-100 rounded text-xs font-mono">
                    <p>
                      <strong>Supabase URL:</strong> {getSupabaseConfig().url}
                    </p>
                    <p>
                      <strong>Has Anon Key:</strong>{" "}
                      {getSupabaseConfig().hasAnonKey ? "Yes" : "No"}
                    </p>
                    <p>
                      <strong>Has Service Key:</strong>{" "}
                      {getSupabaseConfig().hasServiceKey ? "Yes" : "No"}
                    </p>
                  </div>
                </details>
              </div>
            </div>
          </div>
        )}

        {connectionStatus && connectionStatus.success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <svg
                  className="h-6 w-6 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-green-800 font-medium">
                  Database Connected Successfully
                </p>
                <p className="text-green-700 text-sm">
                  {connectionStatus.message}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "recipes" && (
          <div>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex items-center">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <div className="text-orange-500">{stat.icon}</div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">
                        {stat.label}
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">
                My Recipes
              </h2>
              <div className="flex space-x-3">
                <button
                  onClick={openAddRecipeForm}
                  className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg"
                >
                  <Plus className="h-5 w-5" />
                  <span>Add Recipe</span>
                </button>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search recipes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Recipe List */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  {searchQuery
                    ? `Search Results (${filteredRecipes.length})`
                    : `My Recipes (${recipes.length})`}
                </h3>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                </div>
              ) : (searchQuery ? filteredRecipes : recipes).length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    {searchQuery ? "No recipes found" : "No recipes yet"}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchQuery
                      ? "Try adjusting your search terms."
                      : "Get started by creating your first recipe."}
                  </p>
                  {!searchQuery && (
                    <div className="mt-6">
                      <button
                        onClick={openAddRecipeForm}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700"
                      >
                        <Plus className="-ml-1 mr-2 h-5 w-5" />
                        Add Recipe
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {(searchQuery ? filteredRecipes : recipes).map((recipe) => (
                    <div
                      key={recipe.id}
                      className="px-6 py-4 hover:bg-gray-50 cursor-pointer"
                      onClick={() => openRecipeDetail(recipe)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="text-lg font-medium text-gray-900">
                            {recipe.title}
                          </h4>
                          {recipe.description && (
                            <p className="text-sm text-gray-600 mt-1">
                              {recipe.description}
                            </p>
                          )}
                          <div className="flex items-center space-x-4 mt-2">
                            {recipe.difficulty && (
                              <span
                                className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(
                                  recipe.difficulty
                                )}`}
                              >
                                {recipe.difficulty.charAt(0).toUpperCase() +
                                  recipe.difficulty.slice(1)}
                              </span>
                            )}
                            {getTotalTime(recipe) > 0 && (
                              <span className="text-sm text-gray-500 flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {getTotalTime(recipe)} min
                              </span>
                            )}
                            {recipe.servings && (
                              <span className="text-sm text-gray-500 flex items-center">
                                <Users className="h-4 w-4 mr-1" />
                                {recipe.servings} servings
                              </span>
                            )}
                            {recipe.cuisine_type && (
                              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                                {recipe.cuisine_type}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">
                            {new Date(recipe.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab !== "recipes" && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Calendar className="h-24 w-24 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {activeTab === "meal-plans" && "Meal Plans"}
              {activeTab === "shopping" && "Shopping Lists"}
              {activeTab === "settings" && "Settings"}
            </h3>
            <p className="text-gray-500">This feature is coming soon!</p>
          </div>
        )}
      </main>

      {/* Modals */}
      <RecipeForm
        isOpen={isRecipeFormOpen}
        onClose={() => {
          setIsRecipeFormOpen(false);
          setEditingRecipe(null);
        }}
        onSubmit={editingRecipe ? handleUpdateRecipe : handleCreateRecipe}
        recipe={editingRecipe || undefined}
        isLoading={isSubmitting}
      />

      {selectedRecipe && (
        <RecipeDetail
          recipe={selectedRecipe}
          isOpen={isRecipeDetailOpen}
          onClose={() => {
            setIsRecipeDetailOpen(false);
            setSelectedRecipe(null);
          }}
          onEdit={() => openEditRecipeForm(selectedRecipe)}
          onDelete={() => handleDeleteRecipe(selectedRecipe.id)}
          canEdit={true}
        />
      )}
    </div>
  );
}
