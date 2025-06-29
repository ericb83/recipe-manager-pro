import { supabase } from "./supabase";

export async function testSupabaseConnection() {
  console.log("🔍 Testing Supabase connection...");

  try {
    // Test 1: Basic connection
    console.log("📡 Testing basic connection...");
    const { data, error } = await supabase
      .from("profiles")
      .select("count")
      .limit(1);

    if (error) {
      console.error("❌ Connection failed:", error.message);
      return {
        success: false,
        error: error.message,
        suggestion:
          "Check if your Supabase project is active and your environment variables are correct",
      };
    }

    console.log("✅ Basic connection successful");

    // Test 2: Authentication status
    console.log("🔐 Testing authentication...");
    const { data: authData } = await supabase.auth.getSession();
    console.log(
      "Auth session:",
      authData.session ? "Active" : "No active session"
    );

    // Test 3: Check if tables exist
    console.log("🗄️ Testing table structure...");
    const { data: recipes, error: recipesError } = await supabase
      .from("recipes")
      .select("id")
      .limit(1);

    if (recipesError && recipesError.code === "PGRST116") {
      console.warn("⚠️ Tables may not exist. Run the database schema setup.");
      return {
        success: false,
        error: "Database tables not found",
        suggestion:
          "Run the SQL schema from supabase-schema-fixed.sql in your Supabase dashboard",
      };
    }

    console.log("✅ All tests passed! Supabase is properly configured.");
    return {
      success: true,
      message: "Supabase connection is working properly",
    };
  } catch (error: any) {
    console.error("❌ Unexpected error:", error);

    if (error.message?.includes("fetch")) {
      return {
        success: false,
        error: "Network connectivity issue",
        suggestion:
          "Your Supabase project may be paused or deleted. Check your Supabase dashboard.",
      };
    }

    return {
      success: false,
      error: error.message || "Unknown error",
      suggestion:
        "Check your environment variables and Supabase project status",
    };
  }
}

// Helper function to get current environment info
export function getSupabaseConfig() {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
  };
}
