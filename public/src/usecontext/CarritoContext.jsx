import React, { createContext, useContext, useState, useEffect } from 'react';

const CarritoContext = createContext();

export const CarritoProvider = ({ children }) => {
  const [carrito, setCarrito] = useState(() => {
    const carritoGuardado = localStorage.getItem('carrito');
    return carritoGuardado ? JSON.parse(carritoGuardado) : [];
  });
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }, [carrito]);

  const añadir = (producto) => {
    const productoExistente = carrito.find((p) => p._id === producto._id);
    if (productoExistente) {
      setCarrito(
        carrito.map((p) =>
          p._id === producto._id ? { ...p, cantidad: p.cantidad + 1 } : p
        )
      );
      setMensaje(`Has añadido otra unidad de ${producto.nombre}`);
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
      setMensaje(`Has añadido ${producto.nombre} al carrito`);
    }
  };

  const ajustarCantidad = (id, nuevaCantidad) => {
    setCarrito(
      carrito.map((producto) =>
        producto._id === id
          ? { ...producto, cantidad: Math.max(1, nuevaCantidad) }
          : producto
      )
    );
  };

  const eliminar = (id) => {
    setCarrito(carrito.filter((producto) => producto._id !== id));
  };

  const vaciarCarrito = () => {
    setCarrito([]);
  };

  return (
    <CarritoContext.Provider
      value={{ carrito, añadir, ajustarCantidad, eliminar, vaciarCarrito, mensaje }}
    >
      {children}
    </CarritoContext.Provider>
  );
};

export const useCarrito = () =>  useContext(CarritoContext);
