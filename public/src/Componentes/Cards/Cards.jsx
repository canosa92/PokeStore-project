import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Box, Flex, Text, IconButton, Select, Image, Stack, Heading, Divider, Button, 
    ButtonGroup, Icon, HStack, VStack, Container, Grid, Badge, Tooltip
} from '@chakra-ui/react';
import { FaHeart, FaRegHeart, FaShoppingCart } from 'react-icons/fa';
import { StarIcon } from '@chakra-ui/icons';  // Asegúrate de importar StarIcon
import { useUser } from '../../usecontext/UserContext';

const Cards = ({ products, showSort }) => {
    const { user, addToWishList, removeFromWishList, añadir } = useUser();
    const [productosOrdenados, setProductosOrdenados] = useState(products);
    const [orden, setOrden] = useState('idAsc');
    const [productoAñadido, setProductoAñadido] = useState(null);

    // Efecto para reordenar los productos cuando cambia 'orden' o 'products'
    useEffect(() => {
        ordenarProductos(orden);
    }, [orden, products]);

    // Función para ordenar los productos según el tipo de orden seleccionado
    const ordenarProductos = (tipoOrden) => {
        const sortedProducts = [...products]; // Copia de los productos originales
        switch (tipoOrden) {
            case 'nombreAsc':
                sortedProducts.sort((a, b) => a.nombre.localeCompare(b.nombre));
                break;
            case 'nombreDesc':
                sortedProducts.sort((a, b) => b.nombre.localeCompare(a.nombre));
                break;
            case 'precioAsc':
                sortedProducts.sort((a, b) => a.precio - b.precio);
                break;
            case 'precioDesc':
                sortedProducts.sort((a, b) => b.precio - a.precio);
                break;
            case 'idAsc':
                sortedProducts.sort((a, b) => a.id_pokedex - b.id_pokedex);
                break;
            case 'idDesc':
                sortedProducts.sort((a, b) => b.id_pokedex - a.id_pokedex);
                break;
            case 'valorAsc':
                sortedProducts.sort((a, b) => a.likes[0].likes - b.likes[0].likes);
                break;
            case 'valorDesc':
                sortedProducts.sort((a, b) => b.likes[0].likes - a.likes[0].likes);
                break;
            default:
                break;
        }
        setProductosOrdenados(sortedProducts); // Actualiza el estado con los productos ordenados
    };

    // Función para manejar el cambio en el selector de orden
    const handleChangeOrden = (e) => {
        setOrden(e.target.value);
    };

    const renderStars = (likes) => {
        if (!likes || !likes[0]) return null;
        
        const rating = likes[0].star;
        const likesCount = likes[0].likesCount;
    
        return (
            <HStack spacing={1}>
                {[...Array(5)].map((_, i) => (
                    <StarIcon
                        key={i}
                        color={i < Math.floor(rating) ? "yellow.400" : "gray.300"}
                    />
                ))}
                <Text fontWeight="bold" ml={2}>
                    {rating.toFixed(1)} ({likesCount})
                </Text>
            </HStack>
        );
    };

    // Función para determinar si un producto está en la wishlist del usuario
    const isInWishlist = (productId) => {
        return user && user.wishList && user.wishList.includes(productId);
    };

    const handleToggleWishlist = async (productId) => {
        if (user) {
            
            if (isInWishlist(productId)) {
                await removeFromWishList(productId);
                console.log(`se ha eliminado ${productId}`)
            } else {
                await addToWishList(productId);
                console.log(`se ha añadido ${productId}`)
            }
        } else {
            // Manejar el caso en el que el usuario no esté logeado (opcional)
            console.log("Usuario no logeado");
            // Podrías mostrar un mensaje o redirigir al login
        }
    };

    return (
        <Container maxW="container.xl" py={8}>
            {showSort && (
                <Flex mb={4} align="center">
                    <Text mr={2}>Ordenar por:</Text>
                    <Select
                        value={orden}
                        onChange={handleChangeOrden}
                        maxW="200px"
                        w="100%"
                    >              
                        <option value="nombreAsc">Nombre (A-Z)</option>
                        <option value="nombreDesc">Nombre (Z-A)</option>
                        <option value="precioAsc">Precio (Menor a Mayor)</option>
                        <option value="precioDesc">Precio (Mayor a Menor)</option>
                        <option value="idAsc">ID (Menor a Mayor)</option>
                        <option value="idDesc">ID (Mayor a Menor)</option>
                        <option value='valorAsc'>Valoraciones (Menor a Mayor)</option>
                        <option value='valorDesc'>Valoraciones (Mayor a Menor)</option>
                    </Select>
                </Flex>
            )}
            <Grid templateColumns={["repeat(1, 1fr)", "repeat(2, 1fr)", "repeat(3, 1fr)", "repeat(4, 1fr)"]} gap={6}>
                {productosOrdenados.map((product) => (
                    <Box
                        key={product._id}
                        borderWidth="1px"
                        borderRadius="lg"
                        overflow="hidden"
                        boxShadow="md"
                        transition="all 0.3s"
                        _hover={{ transform: "translateY(-5px)", boxShadow: "xl" }}
                    >
                        <Flex direction="column" align="center">
                            <Image 
                                src={product.imagen} 
                                alt={product.nombre} 
                                height="150px" 
                                width="150px" 
                                objectFit="cover"
                            />
                            <Heading size="md" align='center' noOfLines={1} mt={2}>
                                #{product.id_pokedex} {product.nombre}
                            </Heading>
                        </Flex>
                        <VStack p={4} align="start" spacing={3}>
                            <Flex justify="space-between" width="100%" align="center">
                                {renderStars(product.likes)}
                                <IconButton
    aria-label="Toggle wishlist"
    icon={isInWishlist(product._id) ? <FaHeart color="red" /> : <FaRegHeart />}
    onClick={() => handleToggleWishlist(product._id)}
    variant="ghost"
    size="lg"
/>
                            </Flex>
                            <Text  noOfLines={2} fontSize="sm">{product.descripcion}</Text>
                            <Text color="blue.600" fontSize="x1" fontWeight="bold">{product.precio} €</Text>
                            <ButtonGroup spacing={2} width="100%">
                                <Button as={Link} to={`/pokemon/${product.nombre}`} colorScheme="blue" flex={1}>
                                    Más Detalles
                                </Button>
                                <Tooltip label="Añadir al carrito" hasArrow>
                                    <IconButton
                                        icon={<FaShoppingCart />}
                                        colorScheme="green"
                                        onClick={() => {
                                            añadir(product);
                                            setProductoAñadido(product._id);
                                        }}
                                    />
                                </Tooltip>
                            </ButtonGroup>
                        </VStack>
                        {productoAñadido === product._id && (
                            <Box p={2} bg="green.100" borderRadius="md" mt={2}>
                                <Text textAlign="center" color="green.600">Añadido al carrito</Text>
                            </Box>
                        )}
                    </Box>
                ))}
            </Grid>
        </Container>
    );
};

export default Cards;
