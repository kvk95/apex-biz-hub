# Data Layer Documentation

## Overview

This application uses a centralized API service that can fetch data from either local JSON files or a remote Flask API server. All data access is managed through the `ApiService` and `useApiService` hook.

## Configuration

### Switching Data Sources

Edit `src/config/api.config.ts` to switch between data sources:

```typescript
export const API_CONFIG = {
  // Switch between 'local' (JSON files) and 'remote' (Flask API)
  dataSource: 'local', // Change to 'remote' to use Flask API
  
  // Remote API configuration
  remoteApi: {
    baseUrl: 'http://localhost:5000/api', // Update with your Flask API URL
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    }
  },
  
  // Local data paths
  localDataPath: '/data'
};
```

## Data Format

All data (whether from JSON files or API) must follow this standard format:

### Single Object Response
```json
{
  "status": {
    "code": "S",
    "description": ""
  },
  "result": {
    "key": "value"
  }
}
```

### Array Response
```json
{
  "status": {
    "code": "S",
    "description": ""
  },
  "result": [
    {"id": 1, "name": "Item 1"},
    {"id": 2, "name": "Item 2"}
  ]
}
```

### Status Codes
- **S**: Success - Data retrieved successfully
- **N**: No Data - Query successful but no data found
- **F**: Failure - Error occurred (500, network error, etc.)

## Available Endpoints

### Local JSON Files
- `dashboard.json` - Dashboard statistics and charts data
- `customers.json` - Customer list
- `companies.json` - Company list
- `employees.json` - Employee list
- `orders.json` - Order list
- `products.json` - Product inventory

### Remote API Endpoints (Flask)
When `dataSource` is set to `'remote'`, the following endpoints are called:
- `GET /api/dashboard` - Dashboard data
- `GET /api/customers` - Customer list
- `GET /api/companies` - Company list
- `GET /api/employees` - Employee list
- `GET /api/orders` - Order list
- `GET /api/products` - Product list

## Usage in Components

### Using the API Service Hook

```typescript
import { useApiService } from '@/hooks/useApiService';

// In your component
const { data, loading, error, refetch } = useApiService<YourDataType>('endpoint-name');

// Data will be automatically fetched on mount
if (loading) return <div>Loading...</div>;
if (error) return <div>Error: {error}</div>;

// Use the data
return <div>{data.map(item => ...)}</div>;
```

### Available Hook Methods

```typescript
const {
  data,        // The fetched data
  loading,     // Loading state
  error,       // Error message if any
  refetch,     // Function to refetch data
  post,        // Function to POST data
  update,      // Function to PUT/update data
  delete       // Function to DELETE data
} = useApiService<DataType>('endpoint');
```

### Example: Creating a New Item

```typescript
const { post } = useApiService<Product>('products', { autoFetch: false });

const handleCreate = async () => {
  const result = await post({
    name: 'New Product',
    price: 100
  });
  
  if (result.success) {
    // Handle success
  }
};
```

## Adding New Endpoints

### 1. Create JSON File
Create a new JSON file in `src/data/` following the standard format:

```json
{
  "status": {
    "code": "S",
    "description": ""
  },
  "result": [
    // Your data here
  ]
}
```

### 2. Use in Component
```typescript
const { data } = useApiService<YourType>('your-endpoint-name');
```

### 3. Flask API Integration
When switching to remote API, ensure your Flask endpoint returns the same format:

```python
@app.route('/api/your-endpoint-name', methods=['GET'])
def get_your_data():
    return jsonify({
        "status": {
            "code": "S",
            "description": ""
        },
        "result": [
            # Your data here
        ]
    })
```

## Error Handling

The API service automatically handles errors and returns them in a consistent format:

```typescript
// In component
if (error) {
  // Error message is available
  console.error(error);
}
```

## Best Practices

1. **Always use the hook**: Never import JSON files directly in components
2. **Type your data**: Always provide TypeScript interfaces for type safety
3. **Handle loading states**: Always show loading indicators while fetching
4. **Handle errors**: Always display error messages to users
5. **Consistent format**: Ensure all API endpoints follow the standard format
6. **Use refetch**: Use the refetch function to reload data after mutations

## Migration from Local to Remote

1. Develop and test with local JSON files
2. Set up Flask API with matching endpoints
3. Update `API_CONFIG.dataSource` to `'remote'`
4. Update `API_CONFIG.remoteApi.baseUrl` with your API URL
5. Test all features with the remote API
6. Deploy!
