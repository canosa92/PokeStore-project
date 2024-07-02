import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Box, Flex, Text, IconButton, Select, Image, Stack, Heading, Divider, Button, ButtonGroup, Icon, HStack } from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useUser } from '../../usecontext/UserContext';

const Cards = ({ products, showSort }) => {
    const { user, toggleWishList } = useUser();
    const [productosOrdenados, setProductosOrdenados] = useState(products);
    const [orden, setOrden] = useState('idAsc');
    const [productoAñadido, setProductoAñadido] = useState(null);

    // Efecto para reordenar los productos cuando cambia 'orden' o 'products'
    useEffect(() => {
        ordenarProductos(orden);
    }, [orden, products]);

    // Función para ordenar los productos según el tipo de orden seleccionado
    const ordenarProductos = (tipoOrden) => {
        const sortedProducts = [...products];
        switch (tipoOrden) {
            // casos de ordenación...
        }
        setProductosOrdenados(sortedProducts);
    };

    // Función para manejar el cambio en el selector de orden
    const handleChangeOrden = (e) => {
        setOrden(e.target.value);
    };

    // Función para renderizar las estrellas de valoración con hasta 2 decimales
    const renderStars = (rating) => {
        // función renderStars...
    };

    // Función para determinar si un producto está en la wishlist del usuario
    const isInWishlist = (productId) => {
        return user && user.wishList.includes(productId);
    };

    // Función para manejar el clic en el corazón y añadir/quitar de la wishlist
    const handleToggleWishlist = (productId) => {
        if (user) {
            toggleWishList(user.uid, productId);
        } else {
            // Manejar el caso en el que el usuario no esté logeado (opcional)
        }
    };

    return (
        <Box p={4}>
            {showSort && (
                <Flex mb={4} align="center">
                    <Text mr={2}>Ordenar por:</Text>
                    <Select
                        value={orden}
                        onChange={handleChangeOrden}
                        maxW="200px"
                        w="100%"
                    >
                        {/* opciones de orden... */}
                    </Select>
                </Flex>
            )}
            <Flex wrap="wrap" justify="center">
                {productosOrdenados.map((product) => (
                    <Box key={product._id} maxW="sm" m={4} boxShadow="lg" border="none">
                        <Image src={product.imagen} alt={product.nombre} borderRadius="lg" filter="drop-shadow(0px 5px 5px rgba(0, 0, 0, 1))" />
                        <Stack mt="6" spacing="3">
                            <Heading size="md">{product.id_pokedex} - {product.nombre}</Heading>
                            {/* renderización de estrellas y descripción... */}
                            <Text>{product.descripcion}</Text>
                            <Text color="blue.600" fontSize="2xl">{product.precio} €</Text>
                        </Stack>
                        <Divider />
                        <Stack direction="row" justify="space-between" p="4">
                            <ButtonGroup spacing="2">
                                <Link to={`/pokemon/${product.nombre}`}>
                                    <Button variant="solid" colorScheme="blue">Más Detalles</Button>
                                </Link>
                                {/* Icono de corazón */}
                                <IconButton
                                    icon={isInWishlist(product._id) ? <FaHeart color="red" /> : <FaRegHeart />}
                                    aria-label="Add to wishlist"
                                    variant="ghost"
                                    colorScheme="blue"
                                    onClick={() => handleToggleWishlist(product._id)}
                                />
                            </ButtonGroup>
                            <Button
                                variant="ghost"
                                colorScheme="blue"
                                onClick={() => {
                                    añadir(product);
                                    setProductoAñadido(product._id);
                                }}
                            >
                                Añadir al carrito
                            </Button>
                        </Stack>
                        {productoAñadido === product._id && (
                            <Box p={2} bg="green.100" borderRadius="md" mt={2}>
                                <Text>{mensaje}</Text>
                            </Box>
                        )}
                    </Box>
                ))}
            </Flex>
        </Box>
    );
};

export default Cards;
