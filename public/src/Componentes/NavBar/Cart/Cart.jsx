import React from 'react';
import { Box, IconButton, Menu, MenuButton, MenuList, MenuItem, Text, useDisclosure } from '@chakra-ui/react';
import { FiShoppingCart } from 'react-icons/fi';
import { useCarrito } from '../../../usecontext/CarritoContext';

const Cart = () => {
  const { carrito } = useCarrito();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Menu isOpen={isOpen}>
      <MenuButton
        as={IconButton}
        icon={<FiShoppingCart />}
        variant="outline"
        onMouseEnter={onOpen}
        onMouseLeave={onClose}
      />
      <MenuList onMouseEnter={onOpen} onMouseLeave={onClose}>
        {carrito.length === 0 ? (
          <MenuItem>No hay productos en el carrito.</MenuItem>
        ) : (
          carrito.map((producto, index) => (
            <MenuItem key={index}>
              <Text>{producto.nombre} - {producto.cantidad}x</Text>
            </MenuItem>
          ))
        )}
      </MenuList>
    </Menu>
  );
};

export default Cart;
