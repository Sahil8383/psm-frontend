# PSM Frontend - Platform Management System

A modern, responsive frontend application for the Platform Management System built with Next.js, TypeScript, shadcn/ui, and Redux Toolkit.

## Features

- **Authentication**: Secure login and registration system
- **User Management**: Profile management and settings
- **Responsive Design**: Mobile-first responsive design
- **Modern UI**: Built with shadcn/ui components
- **State Management**: Redux Toolkit for state management

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: Redux Toolkit
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd psm-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── login/             # Login page
│   ├── register/          # Registration page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── layout/           # Layout components
│   │   ├── header.tsx    # Navigation header
│   │   ├── sidebar.tsx   # Sidebar navigation
│   │   └── main-layout.tsx # Main layout wrapper
│   ├── ui/               # shadcn/ui components
│   └── providers.tsx     # Redux provider
└── lib/                  # Utilities and configurations
    ├── hooks.ts          # Redux hooks
    ├── store.ts          # Redux store configuration
    └── slices/           # Redux slices
        ├── authSlice.ts  # Authentication state
        └── uiSlice.ts    # UI state management
```

## Authentication

### Features
- User registration with validation
- Secure login system
- Token-based authentication
- Protected routes
- User profile management

### User Types
- **Landlord**: Property owners
- **Tenant**: Property renters  
- **Both**: Users who can be both landlords and tenants

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Style

This project uses:
- ESLint for code linting
- Prettier for code formatting
- TypeScript for type safety

## Deployment

The application can be deployed to any platform that supports Next.js:

- **Vercel** (recommended)
- **Netlify**
- **AWS Amplify**
- **Self-hosted**

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
