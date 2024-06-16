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

    // Función para manejar el cambio en el selector de orden
    const handleChangeOrden = (e) => {
        setOrden(e.target.value);
    };

    // Función para ordenar los productos según el tipo de orden seleccionado
    const ordenarProductos = (tipoOrden) => {
        const sortedProducts = [...products];
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
        setProductosOrdenados(sortedProducts);
    };

    // Efecto para reordenar los productos cuando cambia 'orden' o 'products'
    useEffect(() => {
        ordenarProductos(orden);
    }, [orden, products]);

    // Función para renderizar las estrellas de valoración con hasta 2 decimales
    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const decimalPart = rating - fullStars;
        let numberOfStars = fullStars;

        if (decimalPart >= 0.25 && decimalPart < 0.75) {
            numberOfStars += 0.5;
        } else if (decimalPart >= 0.75) {
            numberOfStars += 1;
        }

        return (
            <HStack spacing="1">
                {Array(5).fill('').map((_, i) => (
                    <Icon key={i} as={StarIcon} color={i < numberOfStars ? 'yellow.400' : 'gray.300'} />
                ))}
            </HStack>
        );
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
            <Flex wrap="wrap" justify="center">
                {productosOrdenados.map((product) => (
                    <Box key={product._id} maxW="sm" m={4} boxShadow="lg" border="none">
                        <Image src={product.imagen} alt={product.nombre} borderRadius="lg" filter="drop-shadow(0px 5px 5px rgba(0, 0, 0, 1))" />
                        <Stack mt="6" spacing="3">
                            <Heading size="md">{product.id_pokedex} - {product.nombre}</Heading>
                            {product.likes[0].likesCount > 0 ? (
                                <Box display="flex" alignItems="center">
                                    {renderStars(product.likes[0].star)}
                                    <Text ml={2}>({product.likes[0].star.toFixed(1)})</Text>
                                </Box>
                            ) : (
                                <Text>Este producto aún no tiene valoración.</Text>
                            )}
                            <Text>{product.descripcion}</Text>
                            <Text color="blue.600" fontSize="2xl">{product.precio} €</Text>
                        </Stack>
                        <Divider />
                        <Stack direction="row" justify="space-between" p="4">
                            <ButtonGroup spacing="2">
                                <Link to={`/pokemon/${product.nombre}`}>
                                    <Button variant="solid" colorScheme="blue">Más Detalles</Button>
                                </Link>
                                {user && (
                                    <IconButton
                                        icon={user.wishList.includes(product._id) ? <FaHeart color="red" /> : <FaRegHeart />}
                                        aria-label="Add to wishlist"
                                        variant="ghost"
                                        colorScheme="blue"
                                        onClick={() => toggleWishList(user.uid, product._id)}
                                    />
                                )}
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
