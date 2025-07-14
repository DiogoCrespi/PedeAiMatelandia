# FoodieApp Application Rules & Architecture

This document outlines the architecture, data flow, and core principles of the FoodieApp application.

## 1. Technology Stack

*   **Framework:** React 19 (using functional components and hooks)
*   **Language:** TypeScript
*   **Routing:** React Router DOM v7 (`HashRouter`)
*   **Styling:** Tailwind CSS (via CDN) with custom theme configuration in `index.html`.
*   **AI:** Google Gemini API (`@google/genai`) for content and image generation.
*   **Bundling/Imports:** Uses `importmap` in `index.html` for ES module imports directly from an ESM CDN (`esm.sh`).

## 2. Project Structure

The project follows a standard React application structure, separating concerns into different directories:

*   `/components`: Reusable UI components used across multiple screens (e.g., `NavBar`, `RestaurantCard`, `SideCart`).
*   `/screens`: Top-level components representing a full page/view of the application. These are mapped to routes in `App.tsx`.
    *   `/screens/company`: Screens related to the business owner/company management dashboard.
    *   `/screens/employee`: Screens for the point-of-sale (POS) / employee interface.
    *   `/screens/shared`: Common components used across different screen types, like placeholders.
*   `/icons`: SVG icons encapsulated as React components.
*   `App.tsx`: The root component that sets up routing, global state, and main layout structure.
*   `index.tsx`: The application's entry point, which renders the `App` component into the DOM.
*   `api.ts`: A mock API layer that simulates server communication. All data fetching and manipulation logic is centralized here.
*   `data.ts`: Contains the mock database (in-memory arrays) that `api.ts` uses.
*   `constants.tsx`: Defines application-wide constants, primarily `ROUTE_PATHS` for routing.
*   `types.ts`: Contains all TypeScript type definitions for the application's data models (e.g., `User`, `Product`, `Order`).
*   `index.html`: The main HTML file. It includes CDN links for Tailwind CSS, Google Fonts, and the `importmap` for dependencies. It also contains global styles and scripts for dynamic UI behavior (header/footer scroll effects).

## 3. State Management

The application employs a centralized state management pattern within the `App.tsx` component using React's built-in hooks (`useState`, `useCallback`).

*   **Global State:** Key application state such as `currentUser`, `cart`, `orders`, `addresses`, etc., is managed in `App.tsx`.
*   **Prop Drilling:** State and state-updating functions are passed down to child components via props. For example, `addToCartHandler` is passed from `App.tsx` down to `ProductScreen.tsx`.
*   **Data Fetching:** Initial data is loaded in `App.tsx` within a `useEffect` hook, which calls functions from `api.ts`.

## 4. Routing

Routing is handled by `react-router-dom` using `<HashRouter>`.

*   **Route Definitions:** All route paths are defined as constants in `constants.tsx` and used throughout the app for navigation.
*   **Route Setup:** The `<Routes>` component in `App.tsx` defines the mapping between paths and screen components.
*   **Protected Routes:** Route access is controlled based on the `currentUser` and `currentEmployee` state. If a user is not logged in, they are redirected to the login screen using the `<Navigate>` component.
*   **Layouts:** The application uses layout components (`CompanyLayout`, `EmployeeLayout`) to provide a consistent structure for different sections of the app (e.g., the company dashboard sidebar).

## 5. Data Flow and API

The application simulates a client-server architecture using a mock API.

*   **`api.ts`:** This file acts as the single source of truth for data interaction. It exports functions that mimic REST API calls (e.g., `getProducts()`, `placeOrder()`, `updateUser()`).
*   **`data.ts`:** This file exports mutable arrays (`MOCK_PRODUCTS`, `MOCK_ORDERS`, etc.) that serve as the "database".
*   **`simulateApi` function:** A helper in `api.ts` adds a small delay to every "API call" to mimic real-world network latency and performs a deep copy of the returned data to prevent direct state mutation.

## 6. Core Features & Logic

*   **Authentication:**
    *   Three distinct user roles are supported: Customer (`currentUser`), Company Admin (also `currentUser`, with access to `/company` routes), and Employee (`currentEmployee`).
    *   Login/Signup flows handle user state and navigation.
    *   Employee login uses a separate PIN-based system.
*   **Cart Logic:**
    *   The cart (`cart` state in `App.tsx`) can only contain products from **one restaurant at a time**.
    *   If a user tries to add an item from a different restaurant, they are prompted to clear their current cart.
    *   Cart items are uniquely identified by a combination of the product ID and its selected options.
*   **Checkout & Order:**
    *   The checkout process combines cart items, delivery fees, and coupon discounts to calculate the final total.
    *   Placing an order creates a new record in `MOCK_ORDERS` and navigates the user to the tracking screen.
*   **Kanban Dashboard (`CompanyDashboardScreen.tsx`):**
    *   Displays active orders in a Kanban-style board, organized by status (`PLACED`, `PREPARING`, etc.).
    *   Supports drag-and-drop functionality to update order status.
    *   Includes a sidebar for completed/canceled orders.
    *   Provides modals for viewing order details and creating new local orders.

## 7. AI Integration (Gemini API)

The application leverages the Google Gemini API for several smart features, primarily within the company dashboard.

*   **Setup:** The Gemini API is initialized in each relevant component file via `new GoogleGenAI({ apiKey: process.env.API_KEY });`. The API key is assumed to be available as an environment variable.
*   **Menu Import (`MenuManagementScreen.tsx`):**
    *   **Model:** `gemini-2.5-flash`
    *   **Functionality:** Users can upload a file (image, PDF, CSV) of their existing menu. The Gemini API analyzes the file content and extracts product information (name, description, price, category), returning it in a structured JSON format. This significantly speeds up the menu creation process.
*   **Image Generation (`MenuManagementScreen.tsx`, `StoreInfoScreen.tsx`):**
    *   **Model:** `imagen-3.0-generate-002`
    *   **Functionality:** Users can generate professional-looking images for their products, store logo, and banner by providing a text prompt. The system provides smart defaults for prompts (e.g., "a hamburger called X-Tudo...") to guide the user. This helps create a visually appealing storefront without needing a photographer.
*   **Content Generation (`MenuManagementScreen.tsx`, `WhatsappBotScreen.tsx`):**
    *   **Model:** `gemini-2.5-flash`
    *   **Functionality:**
        *   In the menu management screen, it can automatically generate enticing marketing descriptions for products based on their name and category.
        *   In the WhatsApp Bot configuration, it can generate friendly, pre-written messages for customer re-engagement campaigns.

## 8. UI/UX Conventions

*   **Styling:** The UI is built with Tailwind CSS, with a centralized color palette and font configuration in `index.html` for consistency.
*   **Responsiveness:** The layout is responsive, adapting to different screen sizes. Special attention is given to the header and footer navigation on mobile devices.
*   **Interactivity:**
    *   The main header and footer hide/minimize on scroll to maximize screen real-estate.
    *   A floating side cart tab provides easy access to the cart from anywhere in the app.
    *   Modals are used for creating and editing data (addresses, products, etc.) to keep the user in context.
    *   Tooltips and hover effects provide users with contextual information without cluttering the UI.
*   **Accessibility:** The app uses semantic HTML (`<header>`, `<footer>`, `<nav>`), ARIA attributes (`aria-label`, `aria-pressed`, `role`), and clear focus states to ensure it is accessible.
