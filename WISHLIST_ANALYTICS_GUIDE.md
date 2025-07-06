# Wishlist Analytics System Guide

## Overview

The wishlist analytics system tracks customer login activity and wishlist behavior to provide retailers with valuable insights into customer engagement and product popularity.

## Features Implemented

### 1. Customer Login Tracking

- **Automatic tracking**: Every customer login is automatically recorded
- **Session management**: Each login creates a new session for tracking wishlist actions
- **Login statistics**: Tracks first login, last login, and total login count

### 2. Wishlist Activity Tracking

- **Add to wishlist**: Tracks when customers add products to their wishlist
- **Remove from wishlist**: Tracks when customers remove products from their wishlist
- **Product popularity**: Aggregates wishlist data to identify most wished products
- **Activity timestamps**: Records when wishlist actions occur

### 3. Analytics Dashboard

- **Real-time data**: Live analytics displayed in retailer dashboard
- **Summary statistics**: Total wishlist items, active users, most wished items
- **Recent activity**: Shows recent wishlist additions by customers
- **Customer statistics**: Individual customer engagement metrics

## Technical Implementation

### Database Model (`WishlistAnalytics.ts`)

```typescript
interface IWishlistAnalytics {
  customerId: string;
  customerUsername: string;
  customerRole: "customer" | "retailer";

  // Login tracking
  lastLoginAt: Date;
  loginCount: number;
  firstLoginAt: Date;

  // Wishlist activity
  totalWishlistItems: number;
  wishlistItems: Array<{
    productId: string;
    productName: string;
    addedAt: Date;
    removedAt?: Date;
  }>;

  // Analytics data
  mostWishedProducts: Array<{
    productId: string;
    productName: string;
    wishCount: number;
  }>;

  // Session tracking
  sessions: Array<{
    sessionId: string;
    startTime: Date;
    endTime?: Date;
    wishlistActions: number;
  }>;
}
```

### API Endpoints

#### GET `/api/admin/wishlist-analytics`

- **Purpose**: Fetch aggregated analytics data for retailer dashboard
- **Access**: Retailer role required
- **Returns**: Summary statistics, most wished products, recent activity, customer stats

#### POST `/api/admin/wishlist-analytics`

- **Purpose**: Track customer login and wishlist actions
- **Access**: Authenticated users
- **Actions**: `login`, `add_to_wishlist`, `remove_from_wishlist`

### Frontend Integration

#### Analytics Hook (`useWishlistAnalytics.ts`)

```typescript
const { trackLogin, trackAddToWishlist, trackRemoveFromWishlist } =
  useWishlistAnalytics();
```

#### Enhanced Wishlist Hook (`useWishlist.ts`)

- Automatically tracks wishlist actions when customers add/remove items
- Integrates with existing wishlist functionality

#### Authentication Integration (`useAuth.ts`)

- Automatically tracks customer logins
- Creates analytics records for new users

## Usage Instructions

### For Customers

1. **Login**: Analytics are automatically tracked when you log in
2. **Add to wishlist**: Click the heart icon on any product
3. **Remove from wishlist**: Click the heart icon again to remove
4. **View wishlist**: Check your wishlist in the dashboard

### For Retailers

1. **Access analytics**: Go to retailer dashboard → Wishlist tab
2. **View statistics**: See total wishlist items, active users, most wished items
3. **Monitor activity**: Check recent wishlist activity and customer statistics
4. **Refresh data**: Click the "Refresh" button to get latest data

## Data Privacy & Security

- **Role-based access**: Only retailers can view analytics data
- **Customer privacy**: Individual customer data is aggregated and anonymized
- **Secure API**: All endpoints require authentication
- **Data retention**: Analytics data is stored securely in MongoDB

## Analytics Metrics

### Summary Statistics

- **Total Wishlist Items**: Combined count of all wishlist items across customers
- **Active Users**: Customers with wishlist activity in the last 30 days
- **Most Wished Item**: Product with the highest wishlist count
- **Total Customers**: Number of customers with analytics records

### Customer Statistics

- **Login Count**: Number of times each customer has logged in
- **Wishlist Items**: Number of items in each customer's wishlist
- **Activity Count**: Number of wishlist actions performed
- **Last Activity**: When the customer last interacted with their wishlist

### Recent Activity

- **Customer Username**: Who performed the action
- **Product Name**: Which product was added to wishlist
- **Timestamp**: When the action occurred
- **Login Status**: Customer's last login time

## Troubleshooting

### Common Issues

1. **Analytics not showing data**

   - Ensure customers have logged in and added items to wishlist
   - Check that retailer is logged in to view analytics
   - Verify API endpoints are accessible

2. **Login tracking not working**

   - Check authentication token is valid
   - Verify analytics API endpoint is responding
   - Check browser console for errors

3. **Wishlist actions not tracked**
   - Ensure customer is logged in
   - Check wishlist hook integration
   - Verify product data is available

### Debug Steps

1. **Check API endpoints**:

   ```bash
   curl -X GET /api/admin/wishlist-analytics
   curl -X POST /api/admin/wishlist-analytics
   ```

2. **Verify database records**:

   - Check MongoDB for `wishlistanalytics` collection
   - Verify customer records exist
   - Check wishlist activity data

3. **Test frontend integration**:
   - Login as customer and add items to wishlist
   - Login as retailer and check analytics dashboard
   - Verify data appears correctly

## Future Enhancements

### Planned Features

- **Email notifications**: Alert retailers to high wishlist activity
- **Export functionality**: Download analytics data as CSV/PDF
- **Advanced filtering**: Filter by date range, customer segments
- **Trend analysis**: Show wishlist trends over time
- **Product recommendations**: Suggest products based on wishlist data

### Performance Optimizations

- **Caching**: Cache analytics data for faster loading
- **Pagination**: Handle large datasets efficiently
- **Real-time updates**: WebSocket integration for live updates
- **Data aggregation**: Pre-calculate common metrics

## Support

For technical support or questions about the wishlist analytics system:

1. Check this guide for troubleshooting steps
2. Review the API documentation
3. Test with the provided test script
4. Contact the development team for assistance
