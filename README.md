# Recipe Manager Pro

A comprehensive web application for organizing, storing, and sharing family recipes with meal planning capabilities.

## 🍳 Features

- **Recipe Management**: Store, organize, and categorize your favorite recipes
- **User Authentication**: Secure sign-up and sign-in with Supabase Auth
- **Recipe Search & Filter**: Find recipes by ingredients, cuisine, or dietary restrictions
- **Meal Planning**: Plan your weekly meals and generate shopping lists
- **Recipe Sharing**: Share recipes with family and friends
- **Mobile Responsive**: Beautiful, modern UI that works on all devices
- **Real-time Data**: Powered by Supabase for real-time updates

## 🚀 Tech Stack

- **Frontend**: Next.js 15 with App Router, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL database, Auth, Real-time, Storage)
- **UI Components**: Custom components with Lucide React icons
- **Styling**: Tailwind CSS for responsive design
- **Deployment**: Vercel (recommended)

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd recipe-manager-pro
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set up Supabase

1. Go to [Supabase](https://supabase.com) and create a new project
2. Wait for the project to be set up (this may take a few minutes)
3. Go to Settings > API to get your project credentials

### 4. Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

Replace the placeholder values with your actual Supabase credentials.

### 5. Set up Database Schema

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `supabase-schema.sql`
4. Run the SQL script to create all tables, policies, and initial data

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📚 Project Structure

```
recipe-manager-pro/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── AuthForm.tsx     # Authentication form
│   │   ├── Dashboard.tsx    # User dashboard
│   │   └── LandingPage.tsx  # Landing page
│   ├── contexts/            # React contexts
│   │   └── AuthContext.tsx  # Authentication context
│   ├── lib/                 # Utility functions
│   │   └── supabase.ts      # Supabase client
│   └── types/               # TypeScript type definitions
│       └── database.ts      # Database types
├── supabase-schema.sql      # Database schema
└── README.md
```

## 🎯 Current Features

### Authentication

- ✅ User registration and login
- ✅ Password reset functionality
- ✅ Protected routes
- ✅ User profile management

### Recipe Management

- ✅ Database schema for recipes and ingredients
- ✅ User interface for recipe dashboard
- 🚧 Recipe creation and editing (coming soon)
- 🚧 Recipe categorization (coming soon)
- 🚧 Image upload (coming soon)

### UI/UX

- ✅ Modern, responsive design
- ✅ Beautiful landing page
- ✅ User dashboard with navigation
- ✅ Loading states and error handling

## 🚧 Upcoming Features

- Recipe creation and editing forms
- Image upload and management
- Advanced search and filtering
- Meal planning calendar
- Shopping list generation
- Recipe sharing functionality
- Nutritional information tracking
- Export recipes to PDF
- Mobile app (Progressive Web App)

## 📱 Database Schema

The application uses the following main tables:

- `profiles` - User profiles and information
- `recipes` - Recipe data including title, instructions, timing
- `ingredients` - Recipe ingredients with amounts and units
- `recipe_categories` - Recipe categorization system
- `meal_plans` - Weekly meal planning
- `meal_plan_recipes` - Assigned recipes to meal plans

All tables include Row Level Security (RLS) policies for data protection.

## 🔒 Security Features

- Row Level Security (RLS) enabled on all tables
- User data isolation
- Secure authentication with Supabase Auth
- Protected API routes
- Input validation and sanitization

## 🎨 Design System

The application uses a cohesive design system with:

- **Primary Color**: Orange (#F97316)
- **Typography**: System fonts with Geist Sans and Geist Mono
- **Components**: Consistent spacing, rounded corners, and hover states
- **Icons**: Lucide React icon library
- **Responsive**: Mobile-first design approach

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

If you encounter any issues or have questions, please create an issue on GitHub.

---

**Recipe Manager Pro** - Transform your cooking experience with organized recipes and smart meal planning! 🍽️
