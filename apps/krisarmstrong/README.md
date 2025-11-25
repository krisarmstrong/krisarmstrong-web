# Kris Armstrong Portfolio

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white) ![License](https://img.shields.io/badge/License-MIT-green) ![Version](https://img.shields.io/badge/Version-0.8.5-blue) ![Status](https://img.shields.io/badge/Status-Active-success)

Professional portfolio website built with React and modern web technologies.

## Description

A dynamic, responsive portfolio website showcasing professional experience, projects, and technical skills. Built with React, Vite, and Tailwind CSS for optimal performance and modern design.

## Features

- Responsive design with Tailwind CSS
- React Router for seamless navigation
- PDF and DOCX document generation capabilities
- Markdown rendering support
- Smooth animations with Framer Motion
- Fast development with Vite

## Tech Stack

- React 19
- Vite 7
- Tailwind CSS 4
- React Router DOM 7
- Framer Motion
- jsPDF & file-saver for document generation

## Installation

```bash
git clone git@github.com:krisarmstrong/krisarmstrong-org.git
cd krisarmstrong-org
npm install
cp .env.example .env
```

## Usage

Development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

## Environment Variables

Define these variables in `.env` before running the app:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_FORMSPREE_ENDPOINT=https://formspree.io/f/your-form-id
VITE_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project
SUPABASE_SERVICE_ROLE_KEY=only-needed-for-local-scripts
```

When a variable is missing the UI falls back to safe defaults (blog data will not load and the contact form is disabled) so nothing is submitted to an invalid destination.

Preview production build:

```bash
npm run preview
```

## Project Structure

- `src/` - React components and application code
- `public/` - Static assets
- `package.json` - Project dependencies and scripts

## License

This project is licensed under the terms specified in the LICENSE file.

## Release & Publishing

Run `npm version <patch|minor|major>` to bump the version, update the README badge, and create a git tag. Afterwards, push with `git push --follow-tags` and deploy the freshly built `dist/` folder.

For the end-to-end checklist (including the shared UI package), see [`docs/publishing.md`](docs/publishing.md).
