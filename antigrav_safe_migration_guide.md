# Feature-Driven Architecture Refactoring Blueprint for Antigrav
**A Non-Destructive, Phase-by-Phase Structural Evolution Guide**

---

## ⚠️ The Golden Rule: "Do No Harm"
Refactoring a functioning codebase is like changing the tires on a moving truck. 
* **Zero Rewrite Policy:** Do not touch, rewrite, or optimize the inner logic of your files.
* **Keep imports working:** Until you are ready to update path aliases, you can rely on relative pathing.
* **Work in isolation:** We will create new folders and move files incrementally, rather than doing a massive "big bang" migration.

---

## 📅 Phase 1: Preparation (100% Safe)

Before moving any files, we configure our environment so TypeScript and Vite/Webpack are aware of our new directories without breaking existing absolute imports.

### 1. Update `tsconfig.json`
Ensure your path aliases are defined. This allows clean imports like `@/features/store` instead of relative paths like `../../../features/store`. Add this to your `paths` mapping:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### 2. Create the Directory Skeleton
Run these commands in your IDE's terminal to create the new target folders. This creates empty directories, which will **not** affect your running code.

```bash
# Create feature domains
mkdir -p src/features/store/{components,hooks,types,api}
mkdir -p src/features/admin/{components,hooks,types,api}
mkdir -p src/features/events/{components,hooks,types,api}

# Create domain-agnostic UI directories
mkdir -p src/components/ui
mkdir -p src/components/layout
```

---

## 🔄 Phase 2: Incremental Migration (Move & Fix Imports)

Move files domain-by-domain. After moving a group of files, fix their internal imports and test-run the compiler.

### Step 2.1: The Store Feature
1. **Move files:**
   * `src/pages/StorePage.tsx` ➡️ `src/features/store/components/StorePage.tsx`
   * `src/pages/CartPage.tsx` ➡️ `src/features/store/components/CartPage.tsx`
   * `src/hooks/useCart.ts` ➡️ `src/features/store/hooks/useCart.ts`
2. **Fix internal paths:** Open `StorePage.tsx` and update its import for `useCart` to point to its new relative neighbor:
   ```typescript
   // Inside StorePage.tsx:
   import { useCart } from '../hooks/useCart';
   ```

### Step 2.2: The Admin Feature
1. **Move files:**
   * `src/pages/AdminPage.tsx` ➡️ `src/features/admin/components/AdminPage.tsx`
2. **Isolate sensitive logic:** Identify admin-specific functions inside `supabaseService.ts`. Instead of deleting them, keep them intact for now to prevent breaking other dependencies. Once the page is moved, double-check its layout and data fetching paths.

---

## 🔒 Phase 3: Creating the Public API Gateways

Once a feature is in its new folder, create an `index.ts` file at its root (e.g., `src/features/store/index.ts`). This serves as the public "gatekeeper" to keep internal files secure.

### Create `src/features/store/index.ts`
```typescript
// Only export the primary entry points
export { StorePage } from './components/StorePage';
export { CartPage } from './components/CartPage';

// DO NOT export 'useCart' or 'ProductCard'. 
// They remain safely encapsulated inside this feature.
```

### Create `src/features/admin/index.ts`
```typescript
// Strictly export only the entry page component
export { AdminPage } from './components/AdminPage';
```

---

## 🧩 Phase 4: Pointing the App Router to Features

Now, we update our router config (like `App.tsx` or `main.tsx`) to pull the pages from their new **Public API** locations instead of the old flat directories.

```typescript
// Before:
// import StorePage from './pages/StorePage';
// import AdminPage from './pages/AdminPage';

// After:
import { StorePage } from '@/features/store';
import { AdminPage } from '@/features/admin';
```

---

## 🛡️ Phase 5: Build Verification & Automated Guardrails

Once your build passes without compilation errors, enforce these boundaries using ESLint so developers cannot bypass the public APIs.

Add this rule block to your `.eslintrc.json` or `eslint.config.js`:

```json
{
  "rules": {
    "no-restricted-imports": [
      "error",
      {
        "patterns": [
          {
            "group": ["@/features/*/*"],
            "message": "Security Warning: Direct imports from subfolders inside features are blocked. You must import only from the feature's Public API gateway (e.g. '@/features/store')."
          }
        ]
      }
    ]
  }
}
```
