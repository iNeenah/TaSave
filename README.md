# DockerLabs

A Next.js application for managing and reviewing Docker-based cybersecurity machines. Users can sign up, browse machines, mark favorites, create todo lists, and leave reviews.

## Features

- **User Authentication**: Sign up, sign in, and sign out with JWT-based sessions
- **Machine Management**: Browse Docker machines with difficulty levels and metadata
- **Personal Lists**: Mark machines as favorites or add them to your todo list
- **Reviews & Ratings**: Leave reviews and ratings for machines
- **Responsive Design**: Built with Tailwind CSS for mobile and desktop

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT tokens with bcryptjs for password hashing
- **Styling**: Tailwind CSS
- **Server Actions**: For form handling and data mutations

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- PostgreSQL database
- Docker (for running the database)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd dockerlabs
```

2. Install dependencies:

```bash
bun install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

Update the `.env.local` file with your database URL and JWT secret.

4. Set up the database:

```bash
# Start PostgreSQL with Docker
docker-compose up -d

# Run database migrations
bun run db:migrate

# Seed the database with sample data
bun run db:seed
```

5. Start the development server:

```bash
bun run dev
```

The application will be available at `http://localhost:3000`.

## Database Schema

The application uses the following main entities:

- **Users**: User accounts with username and hashed password
- **Machines**: Docker machines with metadata (name, description, difficulty, etc.)
- **Reviews**: User reviews and ratings for machines
- **Favorites**: User's favorite machines
- **Todos**: User's todo list of machines to work on

## API Routes

The application uses Next.js Server Actions for data operations:

- **Authentication**: `/src/lib/actions/auth.ts`
- **Machine Operations**: `/src/lib/actions/machines.ts`

## Pages

- **Home** (`/`): Landing page with feature overview
- **Sign Up** (`/signup`): User registration
- **Sign In** (`/signin`): User login
- **Dashboard** (`/dashboard`): Main machine listing (requires auth)
- **Machine Detail** (`/machines/[id]`): Individual machine page with reviews
- **Favorites** (`/favorites`): User's favorite machines
- **Todos** (`/todos`): User's todo list

## Components

- **MachineCard**: Displays machine information with action buttons
- **ReviewForm**: Form for submitting/updating reviews
- **Navigation**: Main navigation with authentication state

## Development

### Database Commands

```bash
# Generate new migration
bun run db:generate

# Apply migrations
bun run db:migrate

# Push schema changes (dev only)
bun run db:push

# Open Drizzle Studio
bun run db:studio

# Reset and seed database
bun run db:reset
```

### Code Quality

```bash
# Run linting
bun run lint

# Type checking
bun run build
```

## Deployment

1. Build the application:

```bash
bun run build
```

2. Set up production environment variables
3. Deploy to your preferred platform (Vercel, Railway, etc.)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
