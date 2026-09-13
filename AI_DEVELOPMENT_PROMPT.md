# AI Development Prompt - Mahidol Lampang Portal Production-Ready Implementation

## Role & Context
You are a Senior Full-Stack Developer and UI/UX Engineer. Your task is to implement the production-ready upgrade plan for the `mahidol-lampang-portal` project, transforming it into a seamless system with Smart Farm IoT integration, functional e-Commerce marketplace, and robust cross-system connectivity.

## Project Overview
- **Project**: Mahidol University Lampang Hub Portal
- **Location**: `C:\NaiBossZer\MU BY NaiBossZer\WEBSITE\mahidol-lampang-portal`
- **Tech Stack**: React, TypeScript, Tailwind CSS, TanStack Router, Vite
- **Design System**: Navy (#002D62), Gold (#F2A900), Green (#2E7D32)
- **Framework**: Component-based with shadcn/ui components

## Strict Constraints
1. **MAINTAIN LAYOUT 100%**: Do NOT modify the main layout, navbar, footer, or overall page structure
2. **PRESERVE DESIGN SYSTEM**: Keep the existing color palette and theme consistency
3. **NO BREAKING CHANGES**: All new features must integrate seamlessly with existing components
4. **ACADEMIC STYLE**: Maintain the clean, professional university aesthetic

## Current State Analysis

### ✅ Already Completed
- Vercel configuration with correct rewrite rules
- Cross-system navigation (smart-farm, clean-energy, rac routes)
- Basic e-Commerce UI components (ProductCard, CartContext, CheckoutModal, AdminDashboard)
- Design system and color palette

### ❌ Critical Gaps to Address

#### 1. Smart Farm IoT Integration
- Product interface lacks IoT data fields (sensors, plot coordinates, harvest predictions)
- No Smart Plots Widget for real-time plot status
- No linking between products and plot data/3D maps
- Mock data has no IoT information

#### 2. e-Commerce System
- No API Service Layer (all data is mock)
- Admin Dashboard operations are stub implementations
- Checkout uses mockup QR code (no real payment integration)
- No cart persistence (localStorage/database)
- Limited toast notification system

#### 3. Seamless Connect
- Mostly complete, but local development iframe experience could be improved

## Implementation Phases

### Phase 1: Smart Farm IoT Integration (HIGH PRIORITY)

#### 1.1 Extend Product Data Model
**File**: `src/components/storefront/mockData.ts`

Action: Extend the Product interface with IoT-related fields:
```typescript
export interface Product {
  id: string;
  name: string;
  image: string;
  standards: ProductStandard[];
  price: number;
  unit: string;
  stock: number;
  isPreOrder: boolean;
  harvestDate?: string;
  
  // NEW IoT FIELDS
  plotId: string;              // e.g., "P-01", "T-02"
  sensorData: {
    lastUpdate: string;
    temperature: number;
    humidity: number;
    soilMoisture: number;
    lightLevel: number;
  };
  harvestPrediction: {
    estimatedDate: string;
    confidence: number;
    qualityScore: number;
  };
  plotMapUrl?: string;         // Link to 3D plot visualization
}
```

Update MOCK_PRODUCTS with sample IoT data for each product.

#### 1.2 Create Smart Plots Status Widget
**File**: `src/components/storefront/SmartPlotsWidget.tsx` (NEW)

Create a component that:
- Displays real-time status of active plots (P-01, T-02, M-01, etc.)
- Shows sensor readings (temperature, humidity, soil moisture, light level)
- Indicates plots ready for harvest with color coding:
  - Green = Ready for harvest
  - Yellow = Monitoring/Normal
  - Red = Needs attention
- Includes a refresh button for manual data updates
- Uses the existing color palette (#002D62, #F2A900, #2E7D32)
- Integrates with the StorefrontWidget in index.tsx

#### 1.3 Enhance ProductCard with IoT Information
**File**: `src/components/storefront/ProductCard.tsx`

Enhance the existing ProductCard to:
- Add "IoT Monitored 📡" badge for products with sensor data
- Display key sensor data on hover or in an expanded view
- Add a "View Plot Data" button that links to plot details
- Show harvest prediction with confidence score
- Highlight products from IoT-monitored plots with visual indicators
- Maintain the existing card layout and design

#### 1.4 Create Plot Detail View Component
**File**: `src/components/storefront/PlotDetailView.tsx` (NEW)

Create a detailed view component that:
- Shows comprehensive sensor data with trend charts
- Displays historical data trends (temperature, humidity over time)
- Includes a placeholder for 3D plot map integration
- Shows quality metrics and certificates
- Lists related products from the same plot
- Provides a link back to the storefront
- Uses the existing design system and UI components

### Phase 2: e-Commerce System Completeness (HIGH PRIORITY)

#### 2.1 Implement API Service Layer
**File**: `src/services/api.ts` (NEW)

Create a service layer with these functions:
```typescript
// Products
export const getProducts = async (): Promise<Product[]> => { /* mock implementation */ };
export const getProductById = async (id: string): Promise<Product> => { /* mock implementation */ };
export const createProduct = async (product: Partial<Product>): Promise<Product> => { /* mock implementation */ };
export const updateProduct = async (id: string, product: Partial<Product>): Promise<Product> => { /* mock implementation */ };
export const deleteProduct = async (id: string): Promise<void> => { /* mock implementation */ };

// Orders
export const createOrder = async (orderData: OrderData): Promise<Order> => { /* mock implementation */ };
export const getOrders = async (): Promise<Order[]> => { /* mock implementation */ };
export const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<Order> => { /* mock implementation */ };

// Inventory
export const updateProductStock = async (productId: string, quantity: number): Promise<void> => { /* mock implementation */ };
```

Include:
- Error handling with proper error messages
- Loading states management
- Mock data as fallback (ready for real API integration later)
- TypeScript type safety throughout

#### 2.2 Enhance Cart Context with Persistence
**File**: `src/components/storefront/CartContext.tsx`

Enhance the existing CartContext to:
- Add localStorage persistence for cart items
- Implement cart recovery on page load
- Add cart validation (check stock availability)
- Include estimated delivery time calculation
- Handle localStorage errors gracefully
- Maintain existing API and interface

#### 2.3 Complete Admin Dashboard Functionality
**File**: `src/components/storefront/AdminDashboard.tsx`

Complete the stub implementations:
- Connect add/edit/delete product operations to the API service
- Implement actual order status updates
- Add real slip approval/rejection with file upload handling
- Include inventory low-stock alerts
- Implement yield forecast calendar with real data
- Add loading states and error handling
- Ensure all operations provide user feedback

#### 2.4 Implement Comprehensive Toast System
**File**: Ensure `sonner` toast library is properly integrated

Add toast notifications for:
- Product added to cart (success message)
- Cart operations (quantity updated, item removed)
- Order submission success/failure
- Admin operations (product saved, order updated, stock alerts)
- Use the existing color scheme for toast styling
- Ensure toasts are non-intrusive but informative

#### 2.5 Enhance Checkout Process
**File**: `src/components/storefront/CheckoutModal.tsx`

Enhance the existing checkout to:
- Add comprehensive form validation
- Implement order confirmation email (mockup message)
- Add detailed order summary with itemized breakdown
- Include delivery time estimation based on method
- Improve error handling for payment upload
- Add loading states during submission
- Maintain the existing 3-step flow

#### 2.6 Create Dedicated Storefront Route
**File**: `src/routes/storefront.tsx` (NEW)

Create a dedicated storefront page that:
- Includes the Smart Plots Widget
- Provides advanced filtering (by standards, plot, availability)
- Includes search functionality
- Shows all products in a responsive grid
- Integrates with the main portal navigation
- Uses the existing StorefrontWidget components
- Maintains the overall page design consistency

### Phase 3: Seamless Connect Enhancement (MEDIUM PRIORITY)

#### 3.1 Improve Local Development Experience
**Files**: `src/routes/smart-farm.tsx`, `clean-energy.tsx`, `rac.tsx`

Enhance the existing iframe fallbacks to:
- Add loading states while iframe loads
- Improve error handling for iframe failures
- Add "Open in new tab" button for better UX
- Include system status indicators
- Maintain the existing production redirect logic

#### 3.2 Add Cross-System Navigation Enhancement
**File**: Update navigation in `src/routes/index.tsx` if needed

Add:
- Active state indicators for current system
- Breadcrumb navigation for cross-system context
- Quick-return buttons from subsidiary systems
- Ensure seamless navigation experience

### Phase 4: Database & Backend Preparation (MEDIUM PRIORITY)

#### 4.1 Database Schema Design
**File**: `docs/database-schema.md` (NEW)

Create database schema documentation:
- Design SQLite schema for development
- Define tables: products, orders, order_items, plots, sensor_data
- Include relationships and indexes
- Document migration strategy
- Provide SQL DDL statements

#### 4.2 API Route Preparation
**File**: `src/routes/api/` (NEW directory structure)

Prepare API route structure:
- `/api/products` - GET, POST, PUT, DELETE endpoints
- `/api/orders` - GET, POST, PATCH endpoints  
- `/api/plots` - GET sensor data endpoints
- Include authentication middleware for admin routes
- Implement rate limiting and validation
- Document API endpoints

## Implementation Order (Priority)

### HIGH PRIORITY (Critical for MVP)
1. ✅ Vercel rewrites (ALREADY COMPLETED)
2. Extend Product data model with IoT fields (Phase 1.1)
3. Create API service layer with mock implementation (Phase 2.1)
4. Complete Admin Dashboard functionality (Phase 2.3)
5. Add Smart Plots Widget (Phase 1.2)
6. Implement cart persistence (Phase 2.2)

### MEDIUM PRIORITY (Enhanced UX)
7. Enhance ProductCard with IoT information (Phase 1.3)
8. Create Plot Detail View (Phase 1.4)
9. Implement comprehensive toast system (Phase 2.4)
10. Create dedicated storefront route (Phase 2.6)
11. Improve local development experience (Phase 3.1)

### LOW PRIORITY (Future Enhancements)
12. Real database integration (Phase 4)
13. Real PromptPay payment integration
14. Advanced analytics and reporting
15. Email notifications system

## Technical Guidelines

### Code Style
- Follow existing TypeScript patterns in the project
- Use existing UI components from `@/components/ui/`
- Maintain consistent naming conventions
- Add helpful comments for complex logic
- Ensure proper error handling throughout

### UI/UX Guidelines
- Use the established color palette (#002D62, #F2A900, #2E7D32)
- Maintain responsive design patterns
- Ensure accessibility (ARIA labels, keyboard navigation)
- Keep loading states and error handling user-friendly
- Test on mobile devices

### Performance Considerations
- Implement lazy loading for new components
- Optimize image loading for products
- Add caching strategies for API calls
- Monitor bundle size impact

## Testing Requirements

### Component Testing
- Test CartContext persistence and recovery
- Test AdminDashboard CRUD operations
- Validate IoT data integration in ProductCard
- Test Smart Plots Widget data refresh

### Integration Testing  
- Test cross-system navigation
- Verify Vercel rewrite rules work correctly
- Test iframe fallbacks in local development
- Validate API service layer error handling

### User Testing
- Test complete checkout flow
- Verify cart operations work smoothly
- Test admin operations end-to-end
- Validate IoT information display

## Success Criteria

### Phase 1: Smart Farm IoT Integration
- ✅ Products display IoT monitoring status badges
- ✅ Smart Plots Widget shows real-time sensor data
- ✅ Users can access plot details from product cards
- ✅ Sensor data updates dynamically with refresh

### Phase 2: e-Commerce System
- ✅ Cart persists across browser sessions
- ✅ Admin can fully manage products and orders
- ✅ Checkout flow completes successfully with validation
- ✅ Toast notifications provide clear user feedback
- ✅ API service layer is ready for backend integration

### Phase 3: Seamless Connect
- ✅ Navigation between systems is seamless
- ✅ Local development works with improved iframe fallbacks
- ✅ Vercel rewrites work correctly in production
- ✅ Cross-system context is maintained

## Files Summary

### Modify Existing Files
- `src/components/storefront/mockData.ts` - Extend Product interface
- `src/components/storefront/ProductCard.tsx` - Add IoT information
- `src/components/storefront/CartContext.tsx` - Add persistence
- `src/components/storefront/AdminDashboard.tsx` - Complete functionality
- `src/components/storefront/CheckoutModal.tsx` - Enhance validation
- `src/routes/index.tsx` - Update navigation if needed

### Create New Files
- `src/components/storefront/SmartPlotsWidget.tsx` - Real-time plot status
- `src/components/storefront/PlotDetailView.tsx` - Detailed plot information
- `src/services/api.ts` - API service layer
- `src/routes/storefront.tsx` - Dedicated storefront page
- `docs/database-schema.md` - Database design documentation
- `src/routes/api/` - API route handlers (directory structure)

## Getting Started

1. **Read the existing code** - Start by examining the current implementation in the storefront components
2. **Begin with Phase 1.1** - Extend the Product data model first
3. **Test incrementally** - Test each phase before moving to the next
4. **Maintain design consistency** - Always reference existing components for styling patterns
5. **Use existing libraries** - Leverage sonner, lucide-react, and other existing dependencies

## Notes

- The project uses TanStack Router for routing
- UI components are from shadcn/ui
- Icons are from lucide-react
- The project uses Vite as the build tool
- Current dependencies include reflex, date-fns, and other libraries in package.json
- The vercel.json file has already been updated with correct rewrite rules

## Expected Deliverables

1. Updated Product interface with IoT fields
2. Working Smart Plots Widget component
3. Enhanced ProductCard with IoT information
4. Functional API service layer (mock implementation)
5. Cart persistence implementation
6. Complete Admin Dashboard functionality
7. Comprehensive toast notification system
8. Dedicated storefront route
9. Improved local development experience
10. Database schema documentation
11. API route structure preparation

Begin implementation starting with Phase 1.1 (Extend Product Data Model) and work through the phases in priority order. Test each component thoroughly before proceeding to the next phase.