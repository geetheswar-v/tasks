# Task Management Frontend (OELP Assignment)

Modern React frontend built with Vite, TypeScript, and Tailwind CSS built as a part of OELP Assignment.

## Features

- **Modern UI**: Clean, table-like interface for task management.
- **Bulk Selection**: Select multiple items for batch actions.
- **Archive View**: Dedicated view for managing archived tasks.
- **Infinite Scroll**: Smooth loading of tasks as you scroll.
- **Real-time Updates**: React Query handles data synchronization.
- **Dark Mode Support**: Styled using Shadcn UI components.

## Setup & Run

We recommend using the scripts provided in the root `scripts/` folder for a unified experience across macOS, Linux, and Windows.

### 1. Install dependencies

```bash
bun install
# or
npm install
```

### 2. Build & Preview

```bash
bun run build
bun run preview
# or
npm run build
npm run preview
```

## Key Components

- **InfiniteList**: Main task container with header and selection logic.
- **ItemCard**: Individual task row with status and actions.
- **FilterBar**: Task filtering by status and archive toggle.
- **CreateItemModal**: Shared modal for creating and editing tasks.

## styling

This project uses **Tailwind CSS** and **Shadcn UI**.
Components are located in `src/components/ui/`.
Global styles are in `src/index.css`.
