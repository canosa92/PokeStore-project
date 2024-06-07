import { createContext, useContext, useState, useEffect } from 'react';

const CarritoContext = createContext();

export const CarritoProvider = ({ children }) => {
  const [carrito, setCarrito] = useState(() => {
    try {
      const storedCarrito = localStorage.getItem('carrito');
      return storedCarrito ? JSON.parse(storedCarrito) : [];
    } catch (error) {
      return [];
    }
  });

  const [mensaje, setMensaje] = useState('');

  const añadir = (producto) => {
    let productosEnCarrito = carrito.find((p) => p.id === producto.id_pokedex);

    if (!productosEnCarrito) {
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
      setMensaje(`Has añadido ${producto.nombre} al carrito.`);
    } else {
      productosEnCarrito.cantidad += 1;
      const index = carrito.indexOf(productosEnCarrito);
      const nuevoCarrito = [...carrito];
      nuevoCarrito[index] = productosEnCarrito;
      setCarrito(nuevoCarrito);
      setMensaje(`Has añadido un ${producto.nombre} más al carrito.`);
    }
  };

 const eliminar = (id) => {
  const index = carrito.findIndex((producto) => producto.id === id);
  if (index !== -1) { // Check if product is found
    const nuevoCarrito = [...carrito];
    nuevoCarrito.splice(index, 1);
    setCarrito(nuevoCarrito);
    setMensaje(`Has eliminado ${carrito[index].nombre} del carrito.`); // Use carrito[index].nombre
  }
};


  
const  ajustarCantidad = (productoId, cantidad) => {
  const nuevoCarrito = carrito.map((producto) => {
    if (producto.id === productoId) { // Corrected line
      return { ...producto, cantidad: Math.max(1, cantidad) };
    }
    return producto;
  });
  setCarrito(nuevoCarrito);
};


  const vaciarCarrito = () => {
    setCarrito([]);
    setMensaje('Has vaciado el carrito.');
  };

  const guardarCarritoLocalStorage = () => {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  };

  useEffect(() => {
    guardarCarritoLocalStorage();
  }, [carrito]);

  // Opcional: Limpiar el mensaje después de un tiempo
  useEffect(() => {
    if (mensaje) {
      const timer = setTimeout(() => {
        setMensaje('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [mensaje]);

  return (
    <CarritoContext.Provider value={{ carrito, añadir, eliminar, ajustarCantidad, vaciarCarrito, mensaje }}>
      {children}
    </CarritoContext.Provider>
  );
};

export const useCarrito = () => useContext(CarritoContext);
