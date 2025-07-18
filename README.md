# Example Hypergraph App for Academic Fields

A React application demonstrating how to build with [Hypergraph](https://thegraph.com/hypergraph/) - a decentralized knowledge graph platform. This app showcases authentication, public/private spaces, and entity management.

## 🆕 Create a new app using TypeSync

In case you want build an app with your own data types you can follow the guide below.

It will walk you through creating a new, fully-functional React application powered by Hypergraph using our scaffolding tool, TypeSync. In just a few minutes, you'll have a local development environment up and running.

**Prerequisites**

- Node.js >= 22
- pnpm >= 10 (install with `npm install -g pnpm`)

### 1. Install the Hypergraph CLI

First install the Hypergraph CLI.

```bash
npm install -g @graphprotocol/hypergraph-cli@latest
```

When using pnpm you need to v10 or higher

```bash
pnpm install -g @graphprotocol/hypergraph-cli@latest
pnpm approve-builds -g
# select @tailwindcss/oxide, better-sqlite3, and esbuild
```

### 2. Launch TypeSync

TypeSync is a visual tool that helps you define your data schema and then generates a complete starter application based on your design. Launch it with

```bash
hg typesync --open
```

This will start the TypeSync server. You can now access the TypeSync app in your browser at http://localhost:3000.

### 3. Scaffold Your Application

In the TypeSync Studio:

1. Give your new application a name and a short description.
2. Use the visual editor to define your data models (we call them "types"). Pick the type "Academic Field".
3. Then click "Generate App".

TypeSync will create a new directory for your application (e.g., `./my-awesome-app`) containing all the files and dependencies you need.

## 🚀 Quick Start (5 minutes)

```bash
# navigate into the app
cd my-awesome-app

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Visit `http://localhost:5173` to see the app in action!

## 📋 Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Basic knowledge of React and TypeScript

## 🏗️ Project Structure Overview (3 minutes)

```
src/
├── components/          # Reusable UI components
│   ├── navbar.tsx      # Navigation with auth status
│   ├── logout.tsx      # Logout functionality
│   └── ui/             # shadcn/ui components
├── routes/             # TanStack Router pages
│   ├── __root.tsx      # Root layout with auth guards
│   ├── login.tsx       # Authentication page
│   ├── index.tsx       # Home page
│   ├── explore-public-knowledge.tsx  # Public data demo
│   ├── private-space/  # Protected routes
│   └── public-space/   # Public space routes
├── schema.ts           # Entity definitions
├── mapping.ts          # Hypergraph entity mappings
└── main.tsx           # App entry point
```

## 🔧 Configuration Walkthrough (7 minutes)

### 1. Schema Definition (`src/schema.ts`)

Define your data entities using Hypergraph's Entity system:

```typescript
import { Entity, Type } from '@graphprotocol/hypergraph';

export class AcademicField extends Entity.Class<AcademicField>('AcademicField')({
  name: Type.Text,
  description: Type.Text,
}) {}

export class Project extends Entity.Class<Project>('Project')({
  name: Type.Text,
  description: Type.Text,
}) {}
```

**Key Points:**

- Entities are strongly typed TypeScript classes
- `Type.Text` defines text fields (other types: `Type.Number`, `Type.Boolean`, etc.)
- Entity names must match your mapping configuration

### 2. Entity Mapping (`src/mapping.ts`)

Map your entities to Hypergraph type IDs:

```typescript
import { Id } from '@graphprotocol/grc-20';
import type { Mapping } from '@graphprotocol/hypergraph';

export const mapping: Mapping = {
  AcademicField: {
    typeIds: [Id.Id('37d2167f-b64a-4b68-be26-55b3608050e7')],
    properties: {
      name: Id.Id('a126ca53-0c8e-48d5-b888-82c734c38935'),
      description: Id.Id('9b1f76ff-9711-404c-861e-59dc3fa7d037'),
    },
  },
};
```

**Key Points:**

- Maps entity classes to unique UUIDs in the Hypergraph network
- `typeIds` identifies the entity type
- `properties` maps each field to its property UUID
- These IDs are generated when you create entities in the Hypergraph ecosystem

### 3. App Provider Setup (`src/main.tsx`)

Wrap your app with the Hypergraph provider:

```typescript
import { HypergraphAppProvider } from '@graphprotocol/hypergraph-react';
import { mapping } from './mapping';

root.render(
  <HypergraphAppProvider mapping={mapping}>
    <RouterProvider router={router} />
  </HypergraphAppProvider>
);
```

**Key Points:**

- `HypergraphAppProvider` provides authentication and query capabilities
- Pass your mapping configuration to connect entities to the network
- Must wrap your entire app for hooks to work

### 4. Authentication Flow (`src/routes/login.tsx`)

Implement Hypergraph authentication:

```typescript
import { useHypergraphApp } from '@graphprotocol/hypergraph-react';

function Login() {
  const { redirectToConnect } = useHypergraphApp();

  const handleLogin = () => {
    redirectToConnect({
      storage: localStorage,
      connectUrl: 'https://hypergraph-connect.vercel.app/',
      successUrl: `${window.location.origin}/authenticate-success`,
      appId: '93bb8907-085a-4a0e-83dd-62b0dc98e793',
      redirectFn: (url: URL) => {
        window.location.href = url.toString();
      },
    });
  };
}
```

**Key Points:**

- Uses Geo Connect for OAuth-style authentication
- `appId` identifies your app in the Hypergraph network
- `successUrl` handles post-authentication redirect
- Authentication state is managed globally

### 5. Data Querying (`src/routes/explore-public-knowledge.tsx`)

Query entities from public spaces:

```typescript
import { useQuery } from '@graphprotocol/hypergraph-react';
import { Project } from '@/schema';

function ExplorePublicKnowledge() {
  const { data: projects, isPending } = useQuery(Project, {
    mode: 'public',
    space: 'b2565802-3118-47be-91f2-e59170735bac',
    first: 40,
  });

  return (
    <div>
      {projects.map((project) => (
        <div key={project.id}>
          <h3>{project.name}</h3>
          <p>{project.description}</p>
        </div>
      ))}
    </div>
  );
}
```

**Key Points:**

- `useQuery` hook fetches data reactively
- `mode: 'public'` queries public data (no auth required)
- `space` parameter targets specific knowledge spaces
- Results are automatically typed based on your schema

## 🎯 Key Concepts

### Spaces

- **Public Spaces**: Open data anyone can query
- **Private Spaces**: Require authentication and permissions
- Each space has a unique UUID identifier

### Entities

- Strongly typed data structures
- Stored in the decentralized Hypergraph network
- Queried using GraphQL-style syntax

### Authentication

- Handled via Geo Connect (OAuth-like flow)
- Provides access to private spaces and write operations
- State managed globally across the app

## 🔄 Development Workflow

1. **Define Schema**: Create entity classes in `schema.ts`
2. **Update Mapping**: Add entity mappings in `mapping.ts`
3. **Query Data**: Use `useQuery` hook in components
4. **Handle Auth**: Implement login/logout flows
5. **Build UI**: Create React components using the data

## 📝 Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm typecheck` - Run TypeScript checks

## 🔗 Next Steps

1. **Explore the Routes**: Visit different pages to see public vs private data
2. **Modify the Schema**: Add new entities or fields
3. **Create New Queries**: Query different spaces or add filters
4. **Add Mutations**: Implement data creation/updates
5. **Deploy**: Build and deploy to your preferred platform

## 📚 Resources

- [Hypergraph Documentation](https://thegraph.com/hypergraph/)
- [TanStack Router](https://tanstack.com/router)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)

---

**Ready to explore?** Start the dev server and check out the different routes to see Hypergraph in action!
