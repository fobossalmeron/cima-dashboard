# Cima Dashboard

## Table of Contents

- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Development Guidelines](#development-guidelines)
  - [Import Conventions](#import-conventions)
  - [Code Style](#code-style) (TODO)
  - [Testing Guidelines](#testing-guidelines) (TODO)
  - [Git Workflow](#git-workflow) (TODO)

## Architecture

### Service Architecture

#### Folder Structure

```
/services
  /dashboard
    - dashboard.service.ts
    - dashboard-sync.service.ts
  /repsly
    - repsly.service.ts
    - repsly-auth.service.ts
  /products
    - product.service.ts
    - product-metrics.service.ts
  /forms
    - form.service.ts
    - form-template.service.ts

/controllers
  /dashboard
    - dashboard.controller.ts
    - dashboard-sync.controller.ts
  /repsly
    - repsly.controller.ts
  /products
    - product.controller.ts
  /forms
    - form.controller.ts

/app/api
  /dashboard
    /route.ts
    /sync/route.ts
  /repsly
    /route.ts
    /auth/route.ts
  /products
    /route.ts
  /forms
    /route.ts
```

#### Principles and Conventions

1. **Context Organization**

   - Services are organized by business domain or context
   - Related services working with the same model or logic are grouped in the same folder
   - Each service has a single, clear responsibility

2. **Third-Party Services**

   - Services that interact with external APIs have their own folder
   - Authentication and operations responsibilities are separated
   - Example: `/services/repsly` for all Repsly-related services

3. **Controllers**

   - Act as intermediaries between endpoints and services
   - Handle data validation and response transformation
   - Do not contain business logic

4. **Endpoints**

   - Located in `/app/api`
   - Each endpoint corresponds to a public service function
   - Handle HTTP communication and serialization/deserialization

5. **Data Flow**
   ```
   Frontend -> Controller -> Service -> Database/External API
   ```

#### Implementation Example

```typescript
// /services/repsly/repsly.service.ts
export class RepslyService {
  static async exportForm(id: string): Promise<string> {
    // Business logic
  }
}

// /controllers/repsly/repsly.controller.ts
export class RepslyController {
  static async exportForm(id: string): Promise<ApiResponse> {
    try {
      const data = await RepslyService.exportForm(id)
      return { success: true, data }
    } catch (error) {
      return { success: false, error }
    }
  }
}

// /app/api/repsly/forms/[id]/export/route.ts
export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  return RepslyController.exportForm(params.id)
}
```

#### Benefits

1. **Separation of Concerns**

   - Each layer has a clear responsibility
   - Facilitates testing and maintenance
   - Improves code reusability

2. **Security**

   - Services are never accessed directly from the frontend
   - Data validation and sanitization at each layer
   - Centralized authentication handling

3. **Maintainability**

   - Clear and predictable structure
   - Easy to extend and modify
   - Better code organization

4. **Scalability**
   - Easy to add new services
   - Ability to reuse logic between services
   - Better dependency management

## Development Guidelines

### Import Conventions

We follow a specific order for organizing imports in our TypeScript/React files:

```typescript
// 1. React and external libraries
import React from 'react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

// 2. UI Components (shadcn)
import { Button, Card } from '@/components/ui'

// 3. Custom components
import { CustomComponent } from '@/components'

// 4. Hooks and contexts
import { useAuth } from '@/lib/contexts'

// 5. Utilities and types
import { cn } from '@/lib/utils'
import type { MyType } from '@/types'

// 6. Styles (if any)
import './styles.css'
```

Within each group:

- Type imports (`type`) go at the end of the group
- Named imports come before default imports
- Maintain alphabetical order within each group

This organization helps with:

- Better code readability
- Clear dependency structure
- Easier maintenance
- Consistent code style across the project

### Code Style (TODO)

- Add coding standards
- Add naming conventions
- Add file organization guidelines

### Testing Guidelines (TODO)

- Add testing strategy
- Add testing tools and setup
- Add testing best practices

### Git Workflow (TODO)

- Add branching strategy
- Add commit message conventions
- Add PR guidelines

## Getting Started

(TODO: Add installation and setup instructions)
