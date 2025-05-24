"use client";

import { useState } from "react";
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
} from "lucide-react";

export function Dashboard() {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState("recipes");

  const handleSignOut = async () => {
    await signOut();
  };

  const stats = [
    {
      label: "Total Recipes",
      value: "24",
      icon: <BookOpen className="h-6 w-6" />,
    },
    { label: "Meal Plans", value: "3", icon: <Calendar className="h-6 w-6" /> },
    {
      label: "Cooking Time Saved",
      value: "12h",
      icon: <Clock className="h-6 w-6" />,
    },
    {
      label: "Family Members",
      value: "4",
      icon: <Users className="h-6 w-6" />,
    },
  ];

  const recentRecipes = [
    {
      id: 1,
      title: "Spaghetti Carbonara",
      difficulty: "Medium",
      time: "30 min",
      rating: 4.5,
    },
    {
      id: 2,
      title: "Chicken Tikka Masala",
      difficulty: "Hard",
      time: "45 min",
      rating: 5.0,
    },
    {
      id: 3,
      title: "Caesar Salad",
      difficulty: "Easy",
      time: "15 min",
      rating: 4.2,
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
                <button className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg">
                  <Plus className="h-5 w-5" />
                  <span>Add Recipe</span>
                </button>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search recipes..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Recent Recipes */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Recent Recipes
                </h3>
              </div>
              <div className="divide-y divide-gray-200">
                {recentRecipes.map((recipe) => (
                  <div key={recipe.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">
                          {recipe.title}
                        </h4>
                        <div className="flex items-center space-x-4 mt-1">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              recipe.difficulty === "Easy"
                                ? "bg-green-100 text-green-800"
                                : recipe.difficulty === "Medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {recipe.difficulty}
                          </span>
                          <span className="text-sm text-gray-500">
                            {recipe.time}
                          </span>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-500 ml-1">
                              {recipe.rating}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button className="text-orange-500 hover:text-orange-700 font-medium">
                        View Recipe
                      </button>
                    </div>
                  </div>
                ))}
              </div>
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
    </div>
  );
}
