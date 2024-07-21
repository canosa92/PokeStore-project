import { createContext, useContext, useEffect, useState } from 'react';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:2999/productos');
      if (!response.ok) {
        throw new Error('Failed to fetch products', error);
      }
      const data = await response.json();
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Error fetching products');
      setLoading(false);
    }
  };

  const addCommentToProduct = (productId, newComment) => {
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product._id === productId ? { ...product, reviews: [...product.reviews, newComment] } : product
      )
    );
  };
  const fetchProductByName = async (nombre) => {
    try {
      const response = await fetch(`http://localhost:2999/productos/nombre/${nombre}`);
      if (!response.ok) {
        throw new Error('Failed to fetch product');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  };
// Función para crear un nuevo producto
const createProduct = async (product) => {
  try {
    const response = await fetch('http://localhost:2999/productos/crear', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });
    if (!response.ok) {
      throw new Error('Failed to create product');
    }
    const newProduct = await response.json();
    setProducts((prevProducts) => [...prevProducts, newProduct]);
    return newProduct;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};
const fetchProductById = async (id) => {
  try {
    setLoading(true);
    const response = await fetch(`http://localhost:2999/productos/${id}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch product');
    }
    
    const data = await response.json();
    setLoading(false);
    return data;
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    setError(error.message);
    setLoading(false);
    throw error;
  }
};
const updateProduct = async (id, product) => {
  try {
    console.log('Sending update request for id:', id);
    console.log('Update data:', product);

    const response = await fetch(`http://localhost:2999/productos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update product');
    }

    setProducts((prevProducts) =>
      prevProducts.map((p) => (p._id === id ? data : p))
    );
    return data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};
// Función para eliminar un producto
const deleteProduct = async (nombre) => {
  try {
    const response = await fetch(`http://localhost:2999/productos/delete/${nombre}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete product');
    }
    setProducts((prevProducts) =>
      prevProducts.filter((p) => p.nombre !== nombre)
    );
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <ProductContext.Provider value={{ products, loading, error, addCommentToProduct,  createProduct,
      updateProduct,
      deleteProduct,fetchProductByName }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => useContext(ProductContext);
