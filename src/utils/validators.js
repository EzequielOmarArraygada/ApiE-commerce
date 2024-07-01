export const validateProductInput = (name, description, price) => {
    if (!name || !description || !price) {
      return 'All fields are required';
    }
    if (typeof price !== 'number' || price <= 0) {
      return 'Price must be a positive number';
    }
    return null;
  };
  