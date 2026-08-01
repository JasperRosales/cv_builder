# CV Builder

## Overview

Build a modern ATS-friendly CV Builder that enables users to create professional resumes through an intuitive, responsive interface. The application should generate clean, recruiter-friendly resumes that can be exported as PDF without requiring users to create an account or store their data on a server.

The application should prioritize privacy by processing all user input locally within the browser. Users may optionally save their progress using Local Storage for convenience.

---

## Target Audience

- Students
- Fresh Graduates
- Professionals
- Job Seekers

---

## Tech Stack

### Frontend

- React
- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui

### Storage

- Browser Local Storage

### PDF

- react-pdf or html2pdf.js

### Deployment

- Vercel

---

## Features

- ATS-Friendly Resume Templates
- Live Resume Preview
- Personal Information
- Work Experience
- Education
- Skills
- Certifications
- Projects
- Languages
- Social Links
- Drag-and-Drop Section Ordering
- Multiple Color Themes
- Light & Dark Mode
- PDF Export
- Local Auto Save
- Import/Export Resume as JSON

---

## Nice-to-Have

- AI Bullet Point Suggestions
- AI Cover Letter Generator
- Resume Template Gallery
- Resume Quality Checklist

---

## Data Storage

No database should be used.

All resume data should remain inside the user's browser using Local Storage unless they explicitly export it.

---

## Goal

Create a fast, privacy-friendly, ATS-focused resume builder that works entirely in the browser.