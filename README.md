# EstateFlow Client

Welcome to the **EstateFlow Client** repository! This is the frontend component of **EstateFlow**, an AI-powered real estate platform designed to streamline property searches, rentals, and purchases. Built with modern web technologies, the client provides a seamless, intuitive user experience for buyers, renters, private sellers, agencies, and administrators.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Usage](#usage)
- [Contributing](#contributing)
- [Links](#links)

## Overview

EstateFlow is an innovative real estate platform that leverages AI to deliver personalized property recommendations, simplify property management, and facilitate secure transactions. The client-side application, hosted at [https://estateflow-beryl.vercel.app](https://estateflow-beryl.vercel.app), provides a responsive and user-friendly interface for interacting with the platform's features, powered by a RESTful API from the [EstateFlow Server](https://github.com/EstateFlow/server).

## Features

- **Property Search & Filters**: Search properties by location, price, type, and more, with geolocation support via Google Maps API.
- **AI-Powered Recommendations**: Get personalized property suggestions using the Gemini Developer API.
- **Wishlist**: Save favorite properties and receive email notifications for updates.
- **Booking & Payments**: Reserve properties and make secure payments via PayPal REST API.
- **Social Sharing**: Share listings on platforms like Facebook, Twitter, and Telegram.
- **Dark/Light Themes**: Toggle between themes for enhanced accessibility.
- **Responsive Design**: Optimized for both desktop and mobile browsers.
- **User Roles**: Supports clients, private sellers, agencies, moderators, and admins with role-based access control.

## Tech Stack

- **Framework**: [React](https://reactjs.org/) for dynamic user interfaces
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) for lightweight state management
- **Routing**: [Tanstack Router](https://tanstack.com/router) for client-side navigation
- **UI Library**: [Shadcn UI](https://ui.shadcn.com/) for accessible components
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) and SCSS for responsive styling
- **Build Tool**: [Vite](https://vitejs.dev/) for fast development and builds
- **Package Manager**: [Bun](https://bun.sh/) for dependency management
- **Deployment**: [Vercel](https://vercel.com/) for seamless deployment
- **APIs**:
  - Google Maps API for location-based features
  - Gemini Developer API for AI recommendations
  - PayPal REST API for payments
  - Google API Auth for authentication

## Usage

- **Browse Properties**: Use the search bar and filters to find properties.
- **Interact with AI Assistant**: Engage with the AI chatbot for recommendations.
- **Manage Listings**: Private sellers and agencies can create/edit listings via the dashboard.
- **Secure Transactions**: Book properties and process payments via PayPal.
- **Customize Experience**: Switch themes/languages for accessibility.

## Contributing

We welcome contributions! To contribute:

1. Fork the repository.
2. Create a branch (`git checkout -b feat/your-feature`).
3. Commit changes (`git commit -m "feat: add feature"`).
4. Push to the branch (`git push origin feat/your-feature`).
5. Open a Pull Request.

Ensure your code follows the project's coding standards and includes tests.

## Links

- **Live Demo**: [https://estateflow-beryl.vercel.app](https://estateflow-beryl.vercel.app)
- **API Documentation**: [https://server-rbdb.onrender.com/api-docs/](https://server-rbdb.onrender.com/api-docs/)
- **Server Repository**: [https://github.com/EstateFlow/server](https://github.com/EstateFlow/server)
- **Report Issues**: [https://github.com/EstateFlow/client/issues](https://github.com/EstateFlow/client/issues)
