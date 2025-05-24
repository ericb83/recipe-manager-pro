"use client";

import { useState } from "react";
import {
  ChefHat,
  Clock,
  Users,
  BookOpen,
  Star,
  ArrowRight,
} from "lucide-react";
import { AuthForm } from "./AuthForm";

export function LandingPage() {
  const [showAuth, setShowAuth] = useState(false);

  const features = [
    {
      icon: <BookOpen className="h-8 w-8 text-orange-500" />,
      title: "Recipe Management",
      description:
        "Store, organize, and categorize all your favorite recipes in one place.",
    },
    {
      icon: <Clock className="h-8 w-8 text-orange-500" />,
      title: "Meal Planning",
      description:
        "Plan your weekly meals and generate shopping lists automatically.",
    },
    {
      icon: <Users className="h-8 w-8 text-orange-500" />,
      title: "Family Sharing",
      description:
        "Share recipes with family members and build your family cookbook.",
    },
    {
      icon: <Star className="h-8 w-8 text-orange-500" />,
      title: "Smart Search",
      description:
        "Find recipes by ingredients, cuisine type, or dietary restrictions.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <ChefHat className="h-16 w-16 text-orange-500" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              Recipe Manager
              <span className="text-orange-500"> Pro</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Your family's digital cookbook. Organize recipes, plan meals, and
              create shopping lists all in one beautiful app.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setShowAuth(true)}
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                Get Started Free
                <ArrowRight className="h-5 w-5" />
              </button>
              <button className="border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything you need for family cooking
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From recipe storage to meal planning, Recipe Manager Pro has all
              the tools to make cooking enjoyable again.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-orange-500">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to transform your cooking?
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Join thousands of families who have simplified their meal planning
            with Recipe Manager Pro.
          </p>
          <button
            onClick={() => setShowAuth(true)}
            className="bg-white text-orange-500 hover:bg-gray-100 px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
          >
            Start Your Free Trial
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <ChefHat className="h-8 w-8 text-orange-500 mr-2" />
              <span className="text-xl font-bold">Recipe Manager Pro</span>
            </div>
            <div className="text-gray-400">
              © 2024 Recipe Manager Pro. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      {showAuth && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Welcome</h2>
              <button
                onClick={() => setShowAuth(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <AuthForm />
          </div>
        </div>
      )}
    </div>
  );
}
