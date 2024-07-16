// ProfilePage.jsx
import React, { useEffect } from 'react';
import { useUser } from '../usecontext/UserContext';
import { Box, Button, Heading, Text, VStack, Divider, Flex, Image, IconButton } from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

const ProfilePage = () => {
    const { user, token, logout, fetchUser, addToWishList, removeFromWishList, wishListProducts } = useUser();

    useEffect(() => {
        if (token) {
            fetchUser(token);
        }
    }, [token, fetchUser]);

    if (!user) {
        return <Box textAlign="center" p={4}>Logeate o registrate</Box>;
    }

    const handleWishlistToggle = async (productId) => {
        if (user.wishList.includes(productId)) {
            await removeFromWishList(productId);
        } else {
            await addToWishList(productId);
        }
    };

    return (
        <Box p={6} maxW="800px" mx="auto" borderWidth={1} borderRadius="md" boxShadow="lg">
            <Heading as="h1" mb={6} textAlign="center" color="teal.500">Mi Perfil</Heading>
            <VStack spacing={6} align="flex-start">
                {/* User Info Box */}
                <Box w="100%" p={4} borderWidth={1} borderRadius="md" boxShadow="md">
                    <Text fontSize="lg"><strong>Name:</strong> {user.name}</Text>
                    <Text fontSize="lg"><strong>Username:</strong> {user.username}</Text>
                    <Text fontSize="lg"><strong>Email:</strong> {user.email}</Text>
                    <Text fontSize="lg"><strong>Role:</strong> {user.role}</Text>
                    <Text fontSize="lg"><strong>Registration Date:</strong> {new Date(user.registrationDate.seconds * 1000).toLocaleDateString()}</Text>
                </Box>

                <Divider />

                {console.log(wishListProducts)}
                <Box w="100%" p={4} borderWidth={1} borderRadius="md" boxShadow="md">
                    <Heading as="h2" size="md" mb={4} color="teal.600">Reviews</Heading>
                    {user.reviews && user.reviews.length ? (
                        <VStack align="flex-start" spacing={4}>
                            {user.reviews.map((review, index) => (
                                <Box key={index} p={4} borderWidth={1} borderRadius="md" boxShadow="sm" w="100%">
                                    <Flex direction={['column', 'row']} align="center" justify="center" mb={4}>
                                        <Box flex="1" textAlign="center" mb={[4, 0]} mx={[0, 4]}>
                                            <Image src={review.productImage} alt={review.productName} boxSize={['100%', '200px']} mx="auto" />
                                        </Box>

                                        <Box flex="1" textAlign="center" mx={[0, 4]}>
                                            <Text fontSize="xl" fontWeight="bold" mb={2}>{review.productName}</Text>
                                            <Text fontSize="md"><strong>Product Description:</strong> {review.productDescription}</Text>
                                            <Box mt={4}><strong>Tu valoración:</strong>
                                                <Flex justify="center" align="center">
                                                    {[...Array(5)].map((_, i) => (
                                                        <StarIcon key={i} color={i < review.rating ? 'yellow.400' : 'gray.300'} />
                                                    ))}
                                                    <Text ml={2}>{review.rating}</Text>
                                                </Flex>
                                                <Text mt={2}><strong>Tu review:</strong></Text>
                                                <Text>{review.comment}</Text>
                                            </Box>
                                        </Box>
                                    </Flex>
                                </Box>
                            ))}
                        </VStack>
                    ) : (
                        <Text>No reviews made</Text>
                    )}
                </Box>

                <Divider />

                {/* Wishlist Box */}
                <Box w="100%" p={4} borderWidth={1} borderRadius="md" boxShadow="md">
                    <Heading as="h2" size="md" mb={4} color="teal.600">Mi lista de deseos</Heading>
                    {wishListProducts && wishListProducts.length ? (
                        <VStack align="flex-start" spacing={4}>
                            {wishListProducts.map((product) => (
                                <Box key={product._id} p={4} borderWidth={1} borderRadius="md" boxShadow="sm" w="100%">
                                    <Flex direction={['column', 'row']} align="center" justify="center" mb={4}>
                                        <Box flex="1" textAlign="center" mb={[4, 0]} mx={[0, 4]}>
                                            <Image src={product.imageUrl} alt={product.name} boxSize={['100%', '200px']} mx="auto" />
                                        </Box>
                                        <Box flex="1" textAlign="center" mx={[0, 4]}>
                                            <Text fontSize="xl" fontWeight="bold" mb={2}>{product.name}</Text>
                                            <Text fontSize="md"><strong>Descripción:</strong> {product.description}</Text>
                                            <IconButton
                                                aria-label="Toggle wishlist"
                                                icon={user.wishList.includes(product._id) ? <FaHeart color="red" /> : <FaRegHeart />}
                                                onClick={() => handleWishlistToggle(product._id)}
                                                variant="ghost"
                                                size="lg"
                                            />
                                        </Box>
                                    </Flex>
                                </Box>
                            ))}
                        </VStack>
                    ) : (
                        <Text>No products in wishlist</Text>
                    )}
                </Box>
            </VStack>
            <Button colorScheme="teal" onClick={logout} mt={6} w="100%">Logout</Button>
        </Box>
    );
};

export default ProfilePage;
