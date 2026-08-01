# CV Builder

A modern, ATS-friendly resume builder built with **Next.js**, **TypeScript**, **Tailwind CSS**, and **shadcn/ui**. The application enables users to create professional resumes through an intuitive interface with real-time preview and PDF export, while keeping all personal data on the user's device.

## Overview

CV Builder is designed to help job seekers create resumes that are optimized for Applicant Tracking Systems (ATS). The application focuses on clean layouts, structured content, and a streamlined user experience without requiring user accounts or server-side data storage.

## Features

* ATS-friendly resume templates
* Real-time resume preview
* Professional, responsive interface
* Drag-and-drop section ordering
* Multiple color themes
* Light and dark mode
* PDF export
* Local browser storage with automatic saving
* Import and export resume data as JSON
* Privacy-first architecture with no database

## Technology Stack

* Next.js
* React
* TypeScript
* Tailwind CSS
* shadcn/ui
* React Hook Form
* Zod

## Getting Started

### Prerequisites

* Node.js 20 or later
* npm, pnpm, yarn, or bun

### Installation

Clone the repository:

```bash
git clone https://github.com/your-username/cv-builder.git
```

Navigate to the project directory:

```bash
cd cv-builder
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:3000
```

## Adding UI Components

This project uses **shadcn/ui** for reusable UI components.

To add a component:

```bash
npx shadcn@latest add button
```

Then import it into your application:

```tsx
import { Button } from "@/components/ui/button";
```

## Privacy

CV Builder is designed with privacy in mind. Resume information is stored locally within the user's browser using Local Storage. No personal information is transmitted to or stored on a remote server.

## Roadmap

* Additional ATS-optimized templates
* AI-powered resume recommendations
* Cover letter generation
* Resume quality analysis
* Keyword optimization
* Multi-language support
* Custom typography and layout options

## Contributing

Contributions, feature requests, and bug reports are welcome. Please open an issue to discuss significant changes before submitting a pull request.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
