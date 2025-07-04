"use client";

import {
  X,
  Clock,
  Users,
  ChefHat,
  Edit,
  Trash2,
  Printer,
  Share2,
  Heart,
} from "lucide-react";
import { RecipeWithIngredients } from "@/lib/recipes";
import { useToast } from "@/contexts/ToastContext";

interface RecipeDetailProps {
  recipe: RecipeWithIngredients;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  canEdit?: boolean;
}

export function RecipeDetail({
  recipe,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  canEdit = true,
}: RecipeDetailProps) {
  const toast = useToast();

  if (!isOpen) return null;

  const totalTime = (recipe.prep_time || 0) + (recipe.cook_time || 0);

  const handlePrint = () => {
    const printContent = `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #ea5502; margin-bottom: 10px;">${recipe.title}</h1>
        ${
          recipe.description
            ? `<p style="color: #666; margin-bottom: 20px;">${recipe.description}</p>`
            : ""
        }
        
        <div style="display: flex; gap: 20px; margin-bottom: 20px; flex-wrap: wrap;">
          ${
            recipe.prep_time
              ? `<div><strong>Prep:</strong> ${recipe.prep_time} min</div>`
              : ""
          }
          ${
            recipe.cook_time
              ? `<div><strong>Cook:</strong> ${recipe.cook_time} min</div>`
              : ""
          }
          ${
            totalTime > 0
              ? `<div><strong>Total:</strong> ${totalTime} min</div>`
              : ""
          }
          ${
            recipe.servings
              ? `<div><strong>Servings:</strong> ${recipe.servings}</div>`
              : ""
          }
          ${
            recipe.difficulty
              ? `<div><strong>Difficulty:</strong> ${recipe.difficulty}</div>`
              : ""
          }
        </div>

        <h2 style="color: #ea5502; margin-top: 30px;">Ingredients</h2>
        <ul style="margin-bottom: 30px;">
          ${recipe.ingredients
            .sort((a, b) => a.order_index - b.order_index)
            .map(
              (ing) =>
                `<li>${ing.amount} ${ing.unit} ${ing.name}${
                  ing.notes ? ` (${ing.notes})` : ""
                }</li>`
            )
            .join("")}
        </ul>

        <h2 style="color: #ea5502;">Instructions</h2>
        <div style="white-space: pre-line;">${recipe.instructions}</div>
      </div>
    `;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${recipe.title} - Recipe</title>
            <style>
              @media print {
                body { margin: 0; }
                @page { margin: 1in; }
              }
            </style>
          </head>
          <body>${printContent}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
      printWindow.close();
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: recipe.title,
      text: recipe.description || `Check out this recipe: ${recipe.title}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast.success("Recipe Shared!", "Recipe shared successfully.");
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          // Fallback to clipboard
          handleCopyLink();
        }
      }
    } else {
      // Fallback to clipboard
      handleCopyLink();
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link Copied!", "Recipe link copied to clipboard.");
    } catch (error) {
      toast.error("Copy Failed", "Could not copy link to clipboard.");
    }
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

  const formatInstructions = (instructions: string) => {
    // Split by numbers at the start of lines or common separators
    const steps = instructions
      .split(/(?:\d+\.\s*|\n\s*\n|\n-\s*)/g)
      .filter((step) => step.trim().length > 0);

    return steps.length > 1 ? steps : [instructions];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {recipe.title}
            </h1>
            {recipe.description && (
              <p className="text-gray-600">{recipe.description}</p>
            )}
          </div>
          <div className="flex items-center space-x-2 ml-4">
            <button
              onClick={handlePrint}
              className="p-2 text-gray-600 hover:bg-gray-50 rounded-full transition-colors"
              title="Print Recipe"
            >
              <Printer className="h-5 w-5" />
            </button>
            <button
              onClick={handleShare}
              className="p-2 text-gray-600 hover:bg-gray-50 rounded-full transition-colors"
              title="Share Recipe"
            >
              <Share2 className="h-5 w-5" />
            </button>
            {canEdit && (
              <>
                <div className="w-px h-6 bg-gray-300"></div>
                <button
                  onClick={onEdit}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                  title="Edit Recipe"
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  onClick={onDelete}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  title="Delete Recipe"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </>
            )}
            <div className="w-px h-6 bg-gray-300"></div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Close"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Recipe Info Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {recipe.prep_time && recipe.prep_time > 0 && (
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="text-sm text-gray-600">Prep Time</p>
                    <p className="font-semibold text-gray-900">
                      {recipe.prep_time} min
                    </p>
                  </div>
                </div>
              </div>
            )}

            {recipe.cook_time && recipe.cook_time > 0 && (
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <ChefHat className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="text-sm text-gray-600">Cook Time</p>
                    <p className="font-semibold text-gray-900">
                      {recipe.cook_time} min
                    </p>
                  </div>
                </div>
              </div>
            )}

            {totalTime > 0 && (
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="text-sm text-gray-600">Total Time</p>
                    <p className="font-semibold text-gray-900">
                      {totalTime} min
                    </p>
                  </div>
                </div>
              </div>
            )}

            {recipe.servings && (
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="text-sm text-gray-600">Servings</p>
                    <p className="font-semibold text-gray-900">
                      {recipe.servings}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Tags and Metadata */}
          <div className="flex flex-wrap gap-2 mb-6">
            {recipe.difficulty && (
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(
                  recipe.difficulty
                )}`}
              >
                {recipe.difficulty.charAt(0).toUpperCase() +
                  recipe.difficulty.slice(1)}
              </span>
            )}
            {recipe.cuisine_type && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {recipe.cuisine_type}
              </span>
            )}
            {recipe.dietary_restrictions?.map((restriction) => (
              <span
                key={restriction}
                className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
              >
                {restriction}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Ingredients */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Ingredients
              </h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <ul className="space-y-2">
                  {recipe.ingredients
                    .sort((a, b) => a.order_index - b.order_index)
                    .map((ingredient, index) => (
                      <li
                        key={ingredient.id}
                        className="flex items-start space-x-3"
                      >
                        <span className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center mt-0.5">
                          {index + 1}
                        </span>
                        <div className="flex-1">
                          <span className="font-medium">
                            {ingredient.amount} {ingredient.unit}{" "}
                            {ingredient.name}
                          </span>
                          {ingredient.notes && (
                            <p className="text-sm text-gray-600 mt-1">
                              {ingredient.notes}
                            </p>
                          )}
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
            </div>

            {/* Instructions */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Instructions
              </h2>
              <div className="space-y-4">
                {formatInstructions(recipe.instructions).map((step, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white font-bold rounded-full flex items-center justify-center">
                      {index + 1}
                    </span>
                    <p className="text-gray-700 leading-relaxed pt-1">
                      {step.trim()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recipe Image Placeholder */}
          {recipe.image_url && (
            <div className="mt-8">
              <img
                src={recipe.image_url}
                alt={recipe.title}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Recipe Metadata */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:justify-between text-sm text-gray-500">
              <p>Created: {new Date(recipe.created_at).toLocaleDateString()}</p>
              {recipe.updated_at !== recipe.created_at && (
                <p>
                  Updated: {new Date(recipe.updated_at).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
