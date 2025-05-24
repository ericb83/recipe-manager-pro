-- Enable Row Level Security (RLS)
alter table profiles enable row level security;
alter table recipes enable row level security;
alter table ingredients enable row level security;
alter table recipe_categories enable row level security;
alter table recipe_category_assignments enable row level security;
alter table meal_plans enable row level security;
alter table meal_plan_recipes enable row level security;

-- Create profiles table
create table profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  full_name text,
  avatar_url text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Create recipes table
create table recipes (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  instructions text not null,
  prep_time integer, -- in minutes
  cook_time integer, -- in minutes
  servings integer,
  difficulty text check (difficulty in ('easy', 'medium', 'hard')),
  cuisine_type text,
  dietary_restrictions text[], -- array of dietary restrictions
  image_url text,
  created_by uuid references profiles(id) on delete cascade not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  is_public boolean default false
);

-- Create ingredients table
create table ingredients (
  id uuid default gen_random_uuid() primary key,
  recipe_id uuid references recipes(id) on delete cascade not null,
  name text not null,
  amount numeric not null,
  unit text not null,
  notes text,
  order_index integer not null
);

-- Create recipe categories table
create table recipe_categories (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  description text,
  created_at timestamptz default now() not null
);

-- Create recipe category assignments table (many-to-many)
create table recipe_category_assignments (
  recipe_id uuid references recipes(id) on delete cascade,
  category_id uuid references recipe_categories(id) on delete cascade,
  created_at timestamptz default now() not null,
  primary key (recipe_id, category_id)
);

-- Create meal plans table
create table meal_plans (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  title text not null,
  start_date date not null,
  end_date date not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Create meal plan recipes table
create table meal_plan_recipes (
  id uuid default gen_random_uuid() primary key,
  meal_plan_id uuid references meal_plans(id) on delete cascade not null,
  recipe_id uuid references recipes(id) on delete cascade not null,
  planned_date date not null,
  meal_type text check (meal_type in ('breakfast', 'lunch', 'dinner', 'snack')) not null,
  servings integer not null default 1,
  created_at timestamptz default now() not null
);

-- Create indexes for better performance
create index recipes_created_by_idx on recipes(created_by);
create index recipes_title_idx on recipes using gin(to_tsvector('english', title));
create index ingredients_recipe_id_idx on ingredients(recipe_id);
create index meal_plans_user_id_idx on meal_plans(user_id);
create index meal_plan_recipes_meal_plan_id_idx on meal_plan_recipes(meal_plan_id);
create index meal_plan_recipes_planned_date_idx on meal_plan_recipes(planned_date);

-- Row Level Security Policies

-- Profiles: Users can only see and update their own profile
create policy "Users can view own profile" on profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id);

-- Recipes: Users can see their own recipes and public recipes
create policy "Users can view own recipes" on recipes
  for select using (auth.uid() = created_by);

create policy "Users can view public recipes" on recipes
  for select using (is_public = true);

create policy "Users can insert own recipes" on recipes
  for insert with check (auth.uid() = created_by);

create policy "Users can update own recipes" on recipes
  for update using (auth.uid() = created_by);

create policy "Users can delete own recipes" on recipes
  for delete using (auth.uid() = created_by);

-- Ingredients: Users can manage ingredients of their own recipes
create policy "Users can view ingredients of accessible recipes" on ingredients
  for select using (
    exists (
      select 1 from recipes 
      where recipes.id = ingredients.recipe_id 
      and (recipes.created_by = auth.uid() or recipes.is_public = true)
    )
  );

create policy "Users can insert ingredients to own recipes" on ingredients
  for insert with check (
    exists (
      select 1 from recipes 
      where recipes.id = ingredients.recipe_id 
      and recipes.created_by = auth.uid()
    )
  );

create policy "Users can update ingredients of own recipes" on ingredients
  for update using (
    exists (
      select 1 from recipes 
      where recipes.id = ingredients.recipe_id 
      and recipes.created_by = auth.uid()
    )
  );

create policy "Users can delete ingredients of own recipes" on ingredients
  for delete using (
    exists (
      select 1 from recipes 
      where recipes.id = ingredients.recipe_id 
      and recipes.created_by = auth.uid()
    )
  );

-- Recipe categories: Everyone can view, authenticated users can use
create policy "Anyone can view recipe categories" on recipe_categories
  for select using (true);

-- Recipe category assignments: Users can manage categories for their own recipes
create policy "Users can view recipe categories of accessible recipes" on recipe_category_assignments
  for select using (
    exists (
      select 1 from recipes 
      where recipes.id = recipe_category_assignments.recipe_id 
      and (recipes.created_by = auth.uid() or recipes.is_public = true)
    )
  );

create policy "Users can assign categories to own recipes" on recipe_category_assignments
  for insert with check (
    exists (
      select 1 from recipes 
      where recipes.id = recipe_category_assignments.recipe_id 
      and recipes.created_by = auth.uid()
    )
  );

create policy "Users can remove categories from own recipes" on recipe_category_assignments
  for delete using (
    exists (
      select 1 from recipes 
      where recipes.id = recipe_category_assignments.recipe_id 
      and recipes.created_by = auth.uid()
    )
  );

-- Meal plans: Users can only manage their own meal plans
create policy "Users can view own meal plans" on meal_plans
  for select using (auth.uid() = user_id);

create policy "Users can insert own meal plans" on meal_plans
  for insert with check (auth.uid() = user_id);

create policy "Users can update own meal plans" on meal_plans
  for update using (auth.uid() = user_id);

create policy "Users can delete own meal plans" on meal_plans
  for delete using (auth.uid() = user_id);

-- Meal plan recipes: Users can only manage recipes in their own meal plans
create policy "Users can view recipes in own meal plans" on meal_plan_recipes
  for select using (
    exists (
      select 1 from meal_plans 
      where meal_plans.id = meal_plan_recipes.meal_plan_id 
      and meal_plans.user_id = auth.uid()
    )
  );

create policy "Users can add recipes to own meal plans" on meal_plan_recipes
  for insert with check (
    exists (
      select 1 from meal_plans 
      where meal_plans.id = meal_plan_recipes.meal_plan_id 
      and meal_plans.user_id = auth.uid()
    )
  );

create policy "Users can update recipes in own meal plans" on meal_plan_recipes
  for update using (
    exists (
      select 1 from meal_plans 
      where meal_plans.id = meal_plan_recipes.meal_plan_id 
      and meal_plans.user_id = auth.uid()
    )
  );

create policy "Users can remove recipes from own meal plans" on meal_plan_recipes
  for delete using (
    exists (
      select 1 from meal_plans 
      where meal_plans.id = meal_plan_recipes.meal_plan_id 
      and meal_plans.user_id = auth.uid()
    )
  );

-- Insert some default recipe categories
insert into recipe_categories (name, description) values
  ('Appetizers', 'Small dishes served before the main course'),
  ('Main Courses', 'Primary dishes for lunch or dinner'),
  ('Desserts', 'Sweet treats and after-meal dishes'),
  ('Beverages', 'Drinks and liquid refreshments'),
  ('Breakfast', 'Morning meal dishes'),
  ('Lunch', 'Midday meal dishes'),
  ('Dinner', 'Evening meal dishes'),
  ('Snacks', 'Light foods eaten between meals'),
  ('Vegetarian', 'Dishes without meat'),
  ('Vegan', 'Dishes without any animal products'),
  ('Gluten-Free', 'Dishes without gluten'),
  ('Low-Carb', 'Dishes with reduced carbohydrates'),
  ('Quick & Easy', 'Simple dishes that can be prepared quickly'),
  ('Comfort Food', 'Hearty, satisfying dishes'),
  ('Healthy', 'Nutritious and balanced dishes');

-- Create updated_at trigger function
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create triggers to automatically update updated_at
create trigger update_profiles_updated_at
  before update on profiles
  for each row execute function update_updated_at();

create trigger update_recipes_updated_at
  before update on recipes
  for each row execute function update_updated_at();

create trigger update_meal_plans_updated_at
  before update on meal_plans
  for each row execute function update_updated_at(); 