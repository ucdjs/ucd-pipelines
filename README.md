# ucdjs pipelines

A project for managing and running UCD (User-Centered Design) pipelines with a built-in UI for pipeline execution and management.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** `>= 24.13` - [Download Node.js](https://nodejs.org/)
- **pnpm** `>= 10.29.3` - [Installation guide](https://pnpm.io/installation)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/ucdjs/ucdjs-pipelines.git
cd ucdjs-pipelines
```

2. Install dependencies using pnpm:

```bash
pnpm install
```

## Usage

### List Available Pipelines

View all available pipelines in your project:

```bash
pnpm pipelines:list
```

### Run Pipelines

Execute pipelines from the command line:

```bash
pnpm pipelines:run
```

### Run Pipelines with UI

Execute pipelines using the interactive web-based UI:

```bash
pnpm pipelines:run:ui
```

This opens a user-friendly interface where you can:
- Select and configure pipelines
- Monitor execution progress
- View results and logs
