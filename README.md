# Fireberry SDK

A lightweight TypeScript SDK for integrating with the Fireberry platform, providing seamless communication for embedded applications. Built with modern TypeScript and designed for optimal developer experience.

## Features

- **📝 Full CRUD Operations**: Create, Query (Read), Update, Delete operations for business objects
- **🔍 Advanced Querying**: Flexible querying with field selection, filtering, and pagination
- **⚡ TypeScript First**: Full type safety with comprehensive TypeScript definitions
- **🎯 Context Awareness**: Automatic context detection and management
- **🚀 Promise-based API**: Modern async/await support for all operations

## Installation

```bash
npm install @fireberry/sdk
```

## Quick Start

### Basic Usage

```typescript
import FireberryClientSDK from '@fireberry/sdk/client';

// Create a new instance
const client = new FireberryClientSDK();

// Initialize context
await client.initializeContext();

// Access the API through the api getter
const api = client.api;

// Get current context information (If not initialized first context will return null)
const context = client.context;
```

### CRUD Operations

```typescript
const objectType = 1;

// Query records with advanced filtering
const results = await api.query(objectType, {
  fields: 'id,name,createdOn,ownerName',
  query: 'name LIKE "test%" AND ownerName = "John"',
  page_size: 20,
  page_number: 1,
});

// Create a new record
const newRecord = await api.create(objectType, {
  name: 'New Business Record',
  description: 'Detailed description of the record',
  status: 'active',
});

// Update an existing record
const updatedRecord = await api.update(objectType, 'recordId123', {
  name: 'Updated Record Name',
  status: 'completed',
});

// Delete a record
const deleteRecord = await api.delete(objectType, 'recordId123');
```

## Browser Support

- Modern browsers with ES6+ support
- Iframe communication support required
- TypeScript 4.0+ for development

## License

MIT

## Maintainers

- **Johnny Marelly** (johnnym@fireberry.com) - Project maintenance and enhancements

## Support

For questions, issues, or contributions, please contact the maintainers or open an issue in the project repository.
