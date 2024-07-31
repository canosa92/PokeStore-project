import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../usecontext/UserContext';
import { 
  Box, Button, Heading, Text, VStack, Divider, Icon, Flex, Image, 
  Container, Badge, Grid, GridItem, Alert 
} from '@chakra-ui/react';
import { Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon } from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';
import { FaShoppingCart } from 'react-icons/fa';
import { AiOutlineDelete } from 'react-icons/ai';  // Icon for delete button

const ProfilePage = () => {
    const { user, token, logout, fetchUser, addToWishList, removeFromWishList, wishListProducts } = useUser();

    // Fetch user data on component mount if token and user are available
    useEffect(() => {
        if (token && user) {
            fetchUser(user, token);
        }
    }, [token, user, fetchUser]);

    // Show login/register prompt if user is not logged in
    if (!user) {
        return (
            <VStack spacing={4} align="center">
                <Alert alignItems="center">¡Regístrate o inicia sesión para añadir tus Pokemon preferidos a tu lista de favoritos!</Alert>
                <Flex>
                    <Link to="/user/register">
                        <Button colorScheme="blue" mr={2}>Registrarse</Button>
                    </Link>
                    <Link to="/login">
                        <Button colorScheme="green">Iniciar Sesión</Button>
                    </Link>
                </Flex>
            </VStack>
        );
    }

    // Toggle wishlist status for a product
    const handleWishlistToggle = async (productId) => {
        if (user.wishList.includes(productId)) {
            await removeFromWishList(productId);
        } else {
            await addToWishList(productId);
        }
    };

    // Group reviews by product for better organization
    const groupReviewsByProduct = (reviews) => {
        return reviews.reduce((acc, review) => {
            if (!acc[review.productId]) {
                acc[review.productId] = [];
            }
            acc[review.productId].push(review);
            return acc;
        }, {});
    };

    // Handle removing a product from the wishlist
    const handleRemoveFromWishlist = async (productId) => {
        await removeFromWishList(productId);
        // After removal, re-fetch user data to update the wishlist
        if (token && user) {
            fetchUser(user, token);
        }
    };

    return (
        <Container maxW="container.xl" py={10}>
            <VStack spacing={8} align="stretch">
                <Heading as="h1" size="2xl" textAlign="center" color="teal.600">Mi Perfil</Heading>

                {/* User Info Box */}
                <Box bg="white" p={6} borderRadius="lg" boxShadow="xl" borderWidth={1} borderColor="gray.200">
                    <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
                        <GridItem>
                            <Text fontSize="lg"><strong>Nombre:</strong> {user.name}</Text>
                            <Text fontSize="lg"><strong>Usuario:</strong> {user.username}</Text>
                            <Text fontSize="lg"><strong>Email:</strong> {user.email}</Text>
                        </GridItem>
                        <GridItem>
                            <Text fontSize="lg"><strong>Rol:</strong> <Badge colorScheme="teal">{user.role}</Badge></Text>
                            <Text fontSize="lg"><strong>Fecha de registro:</strong> {new Date(user.registrationDate).toLocaleDateString()}</Text>
                        </GridItem>
                    </Grid>
                </Box>
                {user && user.role === 'admin' && (
                    <Flex justify="center" mb={6}>
                        <Button as={Link} to="/pokemon/new" colorScheme="teal" size="lg">
                            Crear Nuevo Producto
                        </Button>
                    </Flex>
                )}
                {/* Wishlist Section */}
                <Box bg="white" p={6} borderRadius="lg" boxShadow="xl" borderWidth={1} borderColor="gray.200">
                    <Heading as="h2" size="lg" mb={6} color="teal.600">Mis Favoritos</Heading>
                    {wishListProducts && wishListProducts.length ? (
                        <VStack spacing={6} align="stretch">
                            {wishListProducts.map((product) => (
                                <Box key={product._id} p={4} borderRadius="md" bg="gray.50" boxShadow="md" overflow="hidden">
                                    <Flex direction={{ base: 'column', md: 'row' }} align="stretch">
                                        <Box position="relative" width={{ base: "100%", md: "150px" }} height="150px" mr={{ base: 0, md: 6 }} mb={{ base: 4, md: 0 }} flexShrink={0}>
                                            <Image 
                                                src={product.imagen} 
                                                alt={product.nombre} 
                                                objectFit="contain" 
                                                borderRadius="md" 
                                                w="100%" 
                                                h="100%" 
                                            />
                                            {(product.legendario || product.mythical) && (
                                                <Badge 
                                                    position="absolute" 
                                                    top="0" 
                                                    right="0" 
                                                    colorScheme={product.legendario ? "yellow" : "purple"} 
                                                    fontSize="xs" 
                                                    p={1}
                                                    borderBottomLeftRadius="md"
                                                >
                                                    {product.legendario ? "Legendario" : "Mítico"}
                                                </Badge>
                                            )}
                                        </Box>
                                        <Flex flex="1" direction="column" justify="space-between">
                                            <Box>
                                                <Heading as="h3" size="md" mb={2}>{product.nombre}</Heading>
                                                <Text fontSize="sm" color="gray.700" mb={3} noOfLines={2}>{product.descripcion}</Text>
                                                <Grid templateColumns="repeat(2, 1fr)" gap={2} mb={3}>
                                                    <GridItem>
                                                        <Text fontWeight="bold" fontSize="sm">Tipo:</Text>
                                                        <Text fontSize="sm">{product.tipo.join(', ')}</Text>
                                                    </GridItem>
                                                    <GridItem>
                                                        <Text fontWeight="bold" fontSize="sm">Habilidades:</Text>
                                                        <Text fontSize="sm" noOfLines={2}>{product.habilidades.map(h => h.nombre).join(', ')}</Text>
                                                    </GridItem>
                                                </Grid>
                                            </Box>
                                            <Flex justify="space-between" align="center" wrap="wrap">
                                                <Flex align="center" mb={{ base: 2, sm: 0 }}>
                                                    <Text
                                                        color="black" 
                                                        fontWeight="bold" 
                                                        fontSize="md" 
                                                        px={3}
                                                        py={2}
                                                        mr={2}
                                                    >
                                                        {product.precio} €
                                                    </Text>
                                                </Flex>
                                                <Flex>
                                                    <Button as={Link} to={`/pokemon/${product.nombre}`} colorScheme="teal" size="sm" mr={2}>Ver Detalles</Button>
                                                    <Button 
                                                        colorScheme="blue" 
                                                        size="sm" 
                                                        leftIcon={<Icon as={FaShoppingCart} />}
                                                    >
                                                        Añadir al Carrito
                                                    </Button>
                                                    <Button 
                                                        colorScheme="red" 
                                                        size="sm" 
                                                        ml={2} 
                                                        leftIcon={<Icon as={AiOutlineDelete} />} 
                                                        onClick={() => handleRemoveFromWishlist(product._id)}
                                                    >
                                                        Eliminar
                                                    </Button>
                                                </Flex>
                                            </Flex>
                                        </Flex>
                                    </Flex>
                                </Box>
                            ))}
                        </VStack>
                    ) : (
                        <Text fontSize="lg" textAlign="center" color="gray.500">No tienes productos en tu lista de favoritos</Text>
                    )}
                </Box>

                {/* Reviews Section */}
                <Box bg="white" p={6} borderRadius="lg" boxShadow="xl" borderWidth={1} borderColor="gray.200">
                    <Heading as="h2" size="lg" mb={6} color="teal.600">Mis Reseñas</Heading>
                    {user.reviews && user.reviews.length ? (
                        <VStack spacing={6} align="stretch">
                            {Object.entries(groupReviewsByProduct(user.reviews)).map(([productId, reviews]) => (
                                <Box key={productId} p={4} borderRadius="md" bg="gray.50" boxShadow="md">
                                    <Flex direction={{ base: 'column', md: 'row' }} align="center" justify="space-between">
                                        <Image src={reviews[0].productImage} alt={reviews[0].productName} boxSize="150px" objectFit="cover" borderRadius="md" mr={{ base: 0, md: 6 }} mb={{ base: 4, md: 0 }} />
                                        <Box flex="1">
                                            <Heading as="h3" size="md" mb={2}>{reviews[0].productName}</Heading>
                                            <Text fontSize="md" color="gray.700" mb={4}>{reviews[0].productDescription}</Text>
                                            <Accordion allowMultiple>
                                                {reviews.map((review, index) => (
                                                    <AccordionItem key={index}>
                                                        <h2>
                                                            <AccordionButton>
                                                                <Box flex="1" textAlign="left">
                                                                    Reseña {index + 1} - Calificación: {review.rating}
                                                                </Box>
                                                                <AccordionIcon />
                                                            </AccordionButton>
                                                        </h2>
                                                        <AccordionPanel pb={4}>
                                                            <Flex align="center" mb={2}>
                                                                <Text fontWeight="bold" mr={2}>Tu valoración:</Text>
                                                                {[...Array(5)].map((_, i) => (
                                                                    <StarIcon key={i} color={i < review.rating ? 'yellow.400' : 'gray.300'} />
                                                                ))}
                                                            </Flex>
                                                            <Text fontStyle="italic">"{review.comment}"</Text>
                                                            <Text fontSize="sm" color="gray.500" mt={2}>
                                                                Fecha: {new Date(review.date).toLocaleDateString()}
                                                            </Text>
                                                        </AccordionPanel>
                                                    </AccordionItem>
                                                ))}
                                            </Accordion>
                                        </Box>
                                    </Flex>
                                </Box>
                            ))}
                        </VStack>
                    ) : (
                        <Text fontSize="lg" textAlign="center" color="gray.500">Aún no has hecho ninguna reseña</Text>
                    )}
                </Box>

                {/* Logout Button */}
                <Button colorScheme="teal" size="lg" onClick={logout} mt={6}>Cerrar Sesión</Button>
            </VStack>
        </Container>
    );
};

export default ProfilePage;
