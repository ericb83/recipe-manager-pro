"use client";

import { useState, useEffect } from "react";
import { X, Plus, Minus, Save, Loader2 } from "lucide-react";
import { RecipeFormData, RecipeWithIngredients } from "@/lib/recipes";
import { useToast } from "@/contexts/ToastContext";

interface RecipeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (recipeData: RecipeFormData) => Promise<void>;
  recipe?: RecipeWithIngredients;
  isLoading?: boolean;
}

export function RecipeForm({
  isOpen,
  onClose,
  onSubmit,
  recipe,
  isLoading,
}: RecipeFormProps) {
  const toast = useToast();
  const [formData, setFormData] = useState<RecipeFormData>({
    title: "",
    description: "",
    instructions: "",
    prep_time: 0,
    cook_time: 0,
    servings: 4,
    difficulty: "easy",
    cuisine_type: "",
    dietary_restrictions: [],
    ingredients: [{ name: "", amount: 0, unit: "cup", notes: "" }],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Populate form with recipe data when editing
  useEffect(() => {
    if (recipe) {
      setFormData({
        title: recipe.title,
        description: recipe.description || "",
        instructions: recipe.instructions,
        prep_time: recipe.prep_time || 0,
        cook_time: recipe.cook_time || 0,
        servings: recipe.servings || 4,
        difficulty: recipe.difficulty || "easy",
        cuisine_type: recipe.cuisine_type || "",
        dietary_restrictions: recipe.dietary_restrictions || [],
        ingredients:
          recipe.ingredients.length > 0
            ? recipe.ingredients.map((ing) => ({
                name: ing.name,
                amount: ing.amount,
                unit: ing.unit,
                notes: ing.notes || "",
              }))
            : [{ name: "", amount: 0, unit: "cup", notes: "" }],
      });
    } else {
      // Reset form for new recipe
      setFormData({
        title: "",
        description: "",
        instructions: "",
        prep_time: 0,
        cook_time: 0,
        servings: 4,
        difficulty: "easy",
        cuisine_type: "",
        dietary_restrictions: [],
        ingredients: [{ name: "", amount: 0, unit: "cup", notes: "" }],
      });
    }
    setErrors({});
  }, [recipe, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = "Recipe title is required";
    } else if (formData.title.trim().length < 3) {
      newErrors.title = "Recipe title must be at least 3 characters long";
    } else if (formData.title.trim().length > 100) {
      newErrors.title = "Recipe title must be less than 100 characters";
    }

    // Instructions validation
    if (!formData.instructions.trim()) {
      newErrors.instructions = "Instructions are required";
    } else if (formData.instructions.trim().length < 10) {
      newErrors.instructions =
        "Instructions must be at least 10 characters long";
    }

    // Servings validation
    if (formData.servings <= 0) {
      newErrors.servings = "Servings must be greater than 0";
    } else if (formData.servings > 50) {
      newErrors.servings = "Servings must be 50 or less";
    }

    // Time validation
    if (formData.prep_time < 0) {
      newErrors.prep_time = "Prep time cannot be negative";
    }
    if (formData.cook_time < 0) {
      newErrors.cook_time = "Cook time cannot be negative";
    }

    // Validate ingredients
    const validIngredients = formData.ingredients.filter((ing) =>
      ing.name.trim()
    );
    if (validIngredients.length === 0) {
      newErrors.ingredients = "At least one ingredient is required";
    }

    formData.ingredients.forEach((ingredient, index) => {
      if (ingredient.name.trim()) {
        if (ingredient.amount <= 0) {
          newErrors[`ingredient_${index}_amount`] =
            "Amount must be greater than 0";
        }
        if (!ingredient.unit.trim()) {
          newErrors[`ingredient_${index}_unit`] = "Unit is required";
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error(
        "Form Validation Failed",
        "Please fix the errors below and try again."
      );
      return;
    }

    // Filter out empty ingredients
    const validIngredients = formData.ingredients.filter((ing) =>
      ing.name.trim()
    );

    const recipeData: RecipeFormData = {
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim(),
      instructions: formData.instructions.trim(),
      cuisine_type: formData.cuisine_type.trim(),
      ingredients: validIngredients,
    };

    try {
      await onSubmit(recipeData);
      // Success handling is done in the parent component
    } catch (error: any) {
      // Error handling is done in the parent component, but we can show a fallback
      console.error("Error submitting recipe:", error);
    }
  };

  const handleIngredientChange = (
    index: number,
    field: keyof (typeof formData.ingredients)[0],
    value: string | number
  ) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    setFormData({ ...formData, ingredients: newIngredients });
  };

  const addIngredient = () => {
    setFormData({
      ...formData,
      ingredients: [
        ...formData.ingredients,
        { name: "", amount: 0, unit: "cup", notes: "" },
      ],
    });
  };

  const removeIngredient = (index: number) => {
    if (formData.ingredients.length > 1) {
      const newIngredients = formData.ingredients.filter((_, i) => i !== index);
      setFormData({ ...formData, ingredients: newIngredients });
    }
  };

  const handleDietaryRestrictionChange = (
    restriction: string,
    checked: boolean
  ) => {
    const newRestrictions = checked
      ? [...formData.dietary_restrictions, restriction]
      : formData.dietary_restrictions.filter((r) => r !== restriction);

    setFormData({ ...formData, dietary_restrictions: newRestrictions });
  };

  const dietaryOptions = [
    "Vegetarian",
    "Vegan",
    "Gluten-Free",
    "Dairy-Free",
    "Nut-Free",
    "Low-Carb",
    "Keto",
    "Paleo",
  ];

  const cuisineOptions = [
    "American",
    "Italian",
    "Mexican",
    "Asian",
    "Indian",
    "Mediterranean",
    "French",
    "Thai",
    "Chinese",
    "Other",
  ];

  const commonUnits = [
    "cup",
    "tablespoon",
    "teaspoon",
    "ounce",
    "pound",
    "gram",
    "kilogram",
    "liter",
    "milliliter",
    "piece",
    "clove",
    "pinch",
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            {recipe ? "Edit Recipe" : "Add New Recipe"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recipe Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.title ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter recipe title"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cuisine Type
              </label>
              <select
                value={formData.cuisine_type}
                onChange={(e) =>
                  setFormData({ ...formData, cuisine_type: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Select cuisine type</option>
                {cuisineOptions.map((cuisine) => (
                  <option key={cuisine} value={cuisine}>
                    {cuisine}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              rows={3}
              placeholder="Brief description of the recipe"
            />
          </div>

          {/* Time and Servings */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prep Time (min)
              </label>
              <input
                type="number"
                value={formData.prep_time}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    prep_time: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cook Time (min)
              </label>
              <input
                type="number"
                value={formData.cook_time}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    cook_time: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Servings *
              </label>
              <input
                type="number"
                value={formData.servings}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    servings: parseInt(e.target.value) || 1,
                  })
                }
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.servings ? "border-red-500" : "border-gray-300"
                }`}
                min="1"
              />
              {errors.servings && (
                <p className="text-red-500 text-sm mt-1">{errors.servings}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    difficulty: e.target.value as "easy" | "medium" | "hard",
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          {/* Dietary Restrictions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dietary Restrictions
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {dietaryOptions.map((option) => (
                <label key={option} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.dietary_restrictions.includes(option)}
                    onChange={(e) =>
                      handleDietaryRestrictionChange(option, e.target.checked)
                    }
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                  <span className="text-sm text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Ingredients */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Ingredients *
              </label>
              <button
                type="button"
                onClick={addIngredient}
                className="flex items-center space-x-1 text-orange-600 hover:text-orange-700"
              >
                <Plus className="h-4 w-4" />
                <span className="text-sm">Add Ingredient</span>
              </button>
            </div>
            {errors.ingredients && (
              <p className="text-red-500 text-sm mb-2">{errors.ingredients}</p>
            )}

            <div className="space-y-3">
              {formData.ingredients.map((ingredient, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-12 gap-2 items-end"
                >
                  <div className="md:col-span-4">
                    <input
                      type="text"
                      value={ingredient.name}
                      onChange={(e) =>
                        handleIngredientChange(index, "name", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Ingredient name"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <input
                      type="number"
                      value={ingredient.amount}
                      onChange={(e) =>
                        handleIngredientChange(
                          index,
                          "amount",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                        errors[`ingredient_${index}_amount`]
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Amount"
                      step="0.1"
                      min="0"
                    />
                    {errors[`ingredient_${index}_amount`] && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors[`ingredient_${index}_amount`]}
                      </p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <select
                      value={ingredient.unit}
                      onChange={(e) =>
                        handleIngredientChange(index, "unit", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      {commonUnits.map((unit) => (
                        <option key={unit} value={unit}>
                          {unit}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-3">
                    <input
                      type="text"
                      value={ingredient.notes}
                      onChange={(e) =>
                        handleIngredientChange(index, "notes", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Notes (optional)"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <button
                      type="button"
                      onClick={() => removeIngredient(index)}
                      disabled={formData.ingredients.length === 1}
                      className="p-2 text-red-600 hover:text-red-700 disabled:text-gray-400"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instructions *
            </label>
            <textarea
              value={formData.instructions}
              onChange={(e) =>
                setFormData({ ...formData, instructions: e.target.value })
              }
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                errors.instructions ? "border-red-500" : "border-gray-300"
              }`}
              rows={6}
              placeholder="Step-by-step cooking instructions"
            />
            {errors.instructions && (
              <p className="text-red-500 text-sm mt-1">{errors.instructions}</p>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center space-x-2 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 min-w-[140px] justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>{recipe ? "Update Recipe" : "Create Recipe"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
