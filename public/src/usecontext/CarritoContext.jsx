import { createContext, useContext, useState } from 'react';

const CarritoContext = createContext();

export const CarritoProvider = ({ children }) => {
  const [carrito, setCarrito] = useState([]);

  const ajustarCantidad = (id, nuevaCantidad) => {
    setCarrito(prevCarrito => {
      return prevCarrito.map(producto => {
        if (producto.id === id) {
          const cantidadActualizada = nuevaCantidad <= 0 ? 0 : nuevaCantidad;
          return { ...producto, cantidad: cantidadActualizada };
        }
        return producto;
      }).filter(producto => producto.cantidad > 0); // Eliminar productos con cantidad 0
    });
  };

  const eliminar = (id) => {
    setCarrito(prevCarrito => prevCarrito.filter(producto => producto.id !== id));
  };

  const vaciarCarrito = () => {
    setCarrito([]);
  };

  return (
    <CarritoContext.Provider value={{ carrito, ajustarCantidad, eliminar, vaciarCarrito }}>
      {children}
    </CarritoContext.Provider>
  );
};

export const useCarrito = () => useContext(CarritoContext);
