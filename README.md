# Privacy Policy Generator

A modern web application that helps businesses create customized, legally-compliant privacy policies through an intuitive questionnaire flow with real-time document preview.

## Features

- **Dynamic Questionnaire**: Smart branching logic based on your responses about data collection, cookies, and jurisdictions
- **Real-time Preview**: See how your privacy policy updates as you answer questions
- **Compliance Selection**: Select relevant regulations (GDPR, CCPA, etc.) with visual indicators
- **Professional UI**: Clean split-screen layout showing the form and live document preview
- **Export Options**: Download in multiple formats (PDF, DOCX) with version history tracking
- **Legal Compliance**: Ensure your policy meets the latest legal requirements across jurisdictions

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **Backend**: Supabase (Authentication, Database, Edge Functions)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/privacy-policy.git
   cd privacy-policy
   ```

2. Install dependencies
   ```
   npm install
   # or
   yarn install
   ```

3. Set up environment variables
   Create a `.env.local` file in the root directory with the following variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server
   ```
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result

## Project Structure

- `src/app`: Next.js app router and page components
- `src/components`: Reusable UI components
- `src/lib`: Utilities and shared functionality
- `src/types`: TypeScript type definitions
- `src/utils`: Helper functions
- `src/services`: Service layer for API interactions
- `supabase`: Supabase configuration and edge functions

## Deployment

This project is configured for easy deployment on Vercel:

```
npm run build
# or
yarn build
```

Follow the Vercel deployment instructions for Next.js projects.

## License

[MIT](LICENSE)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
