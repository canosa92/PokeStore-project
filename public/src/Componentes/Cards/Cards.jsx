import PropTypes from 'prop-types';
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
    Box, Flex, Text, IconButton, Select, Image, Heading, Button, 
    ButtonGroup, HStack, VStack, Container, Grid, Tooltip, useToast
} from '@chakra-ui/react';
import { FaHeart, FaRegHeart, FaShoppingCart } from 'react-icons/fa';
import { StarIcon } from '@chakra-ui/icons'; 
import { useUser } from '../../usecontext/UserContext';
import { useCarrito } from '../../usecontext/CarritoContext';
import { useProducts } from '../../usecontext/ProductContext';

const Cards = ({ products, showOrderOptions }) => {
    const { user, addToWishList, removeFromWishList } = useUser();
    const { añadir } = useCarrito();
    const { deleteProduct, success } = useProducts();
    const [productosOrdenados, setProductosOrdenados] = useState(products);
    const [orden, setOrden] = useState('idAsc');
    const [productoAñadido, setProductoAñadido] = useState(null);
    const toast = useToast(); // Hook para mostrar notificaciones

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                // Aquí estaba `setShowSuccess(false);` pero se ha eliminado ya que no se usa `showSuccess`
            }, 2000); // 2 segundos
            return () => clearTimeout(timer);
        }
    }, [success]);

    const ordenarProductos = useCallback((tipoOrden) => {
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
    }, [products]);

    useEffect(() => {
        ordenarProductos(orden);
    }, [orden, products, ordenarProductos]);

    const handleChangeOrden = (e) => {
        setOrden(e.target.value);
    };

    const handleToggleWishlist = async (productId) => {
        if (user) {
            if (isInWishlist(productId)) {
                await removeFromWishList(productId);
                console.log(`se ha eliminado ${productId}`);
            } else {
                await addToWishList(productId);
                console.log(`se ha añadido ${productId}`);
            }
        } else {
            toast({
                title: "Acceso Denegado",
                description: "Debes estar registrado o logeado para añadir productos a tu lista de deseos.",
                status: "warning",
                duration: 5000,
                isClosable: true,
            });
        }
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

    const isInWishlist = (productId) => {
        return user && user.wishList && user.wishList.includes(productId);
    };

    return (
        <Container maxW="container.xl" py={8}>
        {showOrderOptions && (
            <Flex mb={4} align="center" justify="space-between" flexDirection={["column", "row"]}>
                <Text mr={2} mb={[2, 0]}>Ordenar por:</Text>
                <Select
                    value={orden}
                    onChange={handleChangeOrden}
                    maxW={["100%", "200px"]}
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
                        width={["90%", "100%"]}
                        mx="auto"
                    >
                        <Flex direction="column" align="center" position="relative">
                            <IconButton
                                position="absolute"
                                top={2}
                                right={2}
                                zIndex={1}
                                aria-label="Toggle wishlist"
                                icon={isInWishlist(product._id) ? <FaHeart color="red" /> : <FaRegHeart />}
                                onClick={() => handleToggleWishlist(product._id)}
                                variant="ghost"
                                size="lg"
                            />
                            <Box width="100%" display="flex" justifyContent="center" alignItems="center">
                                <Image 
                                    src={product.imagen} 
                                    alt={product.nombre} 
                                    height="150px" 
                                    width="150px" 
                                    objectFit="cover"
                                />
                            </Box>
                            <Flex direction="column" align="center" width="100%">
                                <Heading size="md" align='center' noOfLines={1} mt={1}>
                                    #{product.id_pokedex} {product.nombre}
                                </Heading>
                                {renderStars(product.likes)}
                            </Flex>
                        </Flex>
                        <VStack p={4} align="start" spacing={3}>
                            <Text noOfLines={3} fontSize="md">{product.descripcion}</Text>
                            <Text color="blue.600" fontSize="lg" fontWeight="bold">{product.precio} €</Text>
                            {user && user.role === 'admin' ? (
                                <ButtonGroup spacing={2} width="100%">
                                    <Button as={Link} to={`/pokemon/edit/${product.nombre}`} colorScheme="yellow" flex={1}>
                                        Editar
                                    </Button>
                                    <Button colorScheme="red" flex={1} onClick={() => deleteProduct(product._id)}>
                                        Eliminar
                                    </Button>
                                </ButtonGroup>
                            ) : (
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
                            )}
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

// Validación de `props` usando `PropTypes`
Cards.propTypes = {
    products: PropTypes.arrayOf(PropTypes.shape({
        _id: PropTypes.string.isRequired,
        nombre: PropTypes.string.isRequired,
        descripcion: PropTypes.string.isRequired,
        imagen: PropTypes.string.isRequired,
        precio: PropTypes.number.isRequired,
        id_pokedex: PropTypes.number.isRequired,
        likes: PropTypes.arrayOf(PropTypes.shape({
            star: PropTypes.number.isRequired,
            likesCount: PropTypes.number.isRequired,
        })).isRequired,
    })).isRequired,
    showOrderOptions: PropTypes.bool
};

export default Cards;
