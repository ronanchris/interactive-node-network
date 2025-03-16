# Interactive Node Network

An interactive node network visualization with customizable themes and controls, built with React, TypeScript, and Canvas.

## Live Demo

Visit the live demo at: [https://yourusername.github.io/interactive-node-network](https://yourusername.github.io/interactive-node-network)

## Features

- Real-time interactive node network visualization
- Multiple theme variants (default, warm, cool, night, high contrast, neon)
- Customizable colors and network parameters
- Mobile-responsive design
- Performance optimized for smooth animations
- Accessibility features including contrast ratio checking

## Technology Stack

- React 18
- TypeScript 5
- Vite
- Tailwind CSS
- HTML5 Canvas

## Getting Started

### Prerequisites

- Node.js 16.0 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/interactive-node-network.git
cd interactive-node-network
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173/interactive-node-network/`

## Project Structure

```
src/
  components/           # React components
    NodeNetworkWrapper.tsx
    InteractiveNodeNetwork.tsx
  types/               # TypeScript type definitions
  utils/               # Utility functions
  index.css           # Global styles
```

## Documentation

- [Learning Journal](./learning-journal.md) - Documentation of concepts and learnings
- [Project Rules](./RULES.md) - Development guidelines and best practices
- [Session Notes](./SESSIONS.md) - Development session summaries
- [Technical Notes](./NOTES.md) - Technical decisions and architecture

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Deployment

The project is automatically deployed to GitHub Pages using GitHub Actions. Every push to the `main` branch triggers a new deployment.

### Manual Deployment

If you want to deploy manually:

1. Build the project:
```bash
npm run build
```

2. Preview the build locally:
```bash
npm run preview
```

3. The built files will be in the `dist` directory, ready for deployment to any static hosting service.
