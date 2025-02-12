An application that makes use of DigitalOcean GenAI Platform to generate comprehensive tutorials on any topic. Built with React, TypeScript, and Tailwind CSS.


## Features

- 🤖 AI-powered tutorial generation
- 📝 Markdown rendering support
- 🎨 Beautiful, responsive UI with Tailwind CSS
- 📱 Mobile-friendly design
- 🔄 Tutorial history management
- 🍔 Slide-out sidebar for easy access to past tutorials

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm (v8 or higher)
- [DigitalOcean account](https://www.digitalocean.com/)
- An OpenAI API key

## Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd all-in-one-content-generator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your OpenAI API key:
   ```env
   VITE_OPENAI_API_KEY=your_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

1. Open your browser and navigate to the local development server (usually `http://localhost:5173`)
2. Enter a topic in the input field (e.g., "Building a REST API with Node.js")
3. Click the "Generate" button or press Enter
4. Wait for the AI to generate your tutorial
5. Access your tutorial history through the hamburger menu in the top-left corner

## Project Structure

```
src/
├── App.tsx           # Main application component
├── main.tsx         # Application entry point
├── services/
│   └── openai.ts    # OpenAI API integration
├── types/
│   └── index.ts     # TypeScript type definitions
└── index.css        # Global styles
```

## Development

To start the development server:
```bash
npm run dev
```

To build for production:
```bash
npm run build
```

To preview the production build:
```bash
npm run preview
```

## Best Practices

- Keep your OpenAI API key secure and never commit it to version control
- Use TypeScript for better type safety and developer experience
- Follow the existing code style and formatting
- Write meaningful commit messages
- Test thoroughly before deploying

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

