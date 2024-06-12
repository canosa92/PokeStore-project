import React, { useEffect } from 'react';
import { useUser } from '../usecontext/UserContext';
import { Box, Button, Heading, Text, VStack, HStack, Divider } from '@chakra-ui/react';

const ProfilePage = () => {
    const { user, token, logout, fetchUser, deleteUser } = useUser();

    useEffect(() => {
        if (token && !user) {
            fetchUser(token);
        }
    }, [token, user, fetchUser]);

    if (!user) {
        return <Box textAlign="center" p={4}>Loading...</Box>;
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
                    <Heading as="h2" size="md" mb={4} color="teal.600">Wishlist</Heading>
                    {user.wishList && user.wishList.length ? (
                        <VStack align="flex-start" spacing={2}>
                            {user.wishList.map((item, index) => (
                                <Text key={index}>{item}</Text>
                            ))}
                        </VStack>
                    ) : (
                        <Text>No items in wishlist</Text>
                    )}
                </Box>

                <Divider />

                <Box w="100%" p={4} borderWidth={1} borderRadius="md" boxShadow="md">
                    <Heading as="h2" size="md" mb={4} color="teal.600">Comments</Heading>
                    {user.comments && user.comments.length ? (
                        <VStack align="flex-start" spacing={4}>
                            {user.comments.map((comment, index) => (
                                <Box key={index} p={4} borderWidth={1} borderRadius="md" boxShadow="sm">
                                    <Text><strong>Product:</strong> {comment.product}</Text>
                                    <Text><strong>Rating:</strong> {comment.rating}</Text>
                                    <Text><strong>Comment:</strong> {comment.comment}</Text>
                                </Box>
                            ))}
                        </VStack>
                    ) : (
                        <Text>No comments made</Text>
                    )}
                </Box>

                <HStack spacing={4} mt={4}>
                    <Button colorScheme="teal" onClick={logout}>Logout</Button>
                    <Button colorScheme="red" onClick={() => deleteUser(user.uid)}>Delete Account</Button>
                </HStack>
            </VStack>
        </Box>
    );
};

export default ProfilePage;
