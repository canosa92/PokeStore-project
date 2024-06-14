import React, { useEffect } from 'react';
import { useUser } from '../usecontext/UserContext';
import { Box, Button, Heading, Text, VStack, HStack, Divider, Flex, Image } from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';

const ProfilePage = () => {
    const { user, token, logout, fetchUser, deleteUser } = useUser();

    useEffect(() => {
        if (token && !user) {
            fetchUser(token);
        }
    }, [token, user, fetchUser]);

    if (!user) {
        return <Box textAlign="center" p={4}>Logeate o registrate</Box>;
    }

    return (
        <Box p={6} maxW="800px" mx="auto" borderWidth={1} borderRadius="md" boxShadow="lg">
            <Heading as="h1" mb={6} textAlign="center" color="teal.500">My Profile</Heading>
            <VStack spacing={6} align="flex-start">
                <Box w="100%" p={4} borderWidth={1} borderRadius="md" boxShadow="md">
                    <Text fontSize="lg"><strong>Name:</strong> {user.name}</Text>
                    <Text fontSize="lg"><strong>Username:</strong> {user.username}</Text>
                    <Text fontSize="lg"><strong>Email:</strong> {user.email}</Text>
                    <Text fontSize="lg"><strong>Role:</strong> {user.role}</Text>
                    <Text fontSize="lg"><strong>Registration Date:</strong> {new Date(user.registrationDate.seconds * 1000).toLocaleDateString()}</Text>
                </Box>

                <Divider />

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
                                            <Box mt={4}><strong>Tu valoracion:</strong>
                                                <Flex justify="center" align="center">
                                                    {[...Array(5)].map((_, i) => (
                                                        <StarIcon key={i} color={i < review.rating ? 'yellow.400' : 'gray.300'} />
                                                    ))}
                                                    <Text ml={2}>{review.rating}</Text>
                                                </Flex>
                                                <Text mt={2}><strong> Tu review:</strong> </Text>
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

                <HStack spacing={4} mt={4} justify="center">
                    <Button colorScheme="teal" onClick={logout}>Logout</Button>
                    <Button colorScheme="red" onClick={() => deleteUser(user.uid)}>Delete Account</Button>
                </HStack>
            </VStack>
        </Box>
    );
};

export default ProfilePage;
