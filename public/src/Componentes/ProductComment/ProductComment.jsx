import React, { useState } from 'react';
import { useUser } from '../../usecontext/UserContext.jsx';
import { useProducts } from '../../usecontext/ProductContext'; // Importa useProducts desde ProductContext
import { Box, Button, FormControl, FormLabel, Textarea, Text, VStack, HStack, Icon } from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';

const ProductCommentForm = ({ productId, productName, productImage, productDescription, onCommentSubmit }) => {
    const { user, token } = useUser();
    const { addCommentToProduct } = useProducts();

    const [comment, setComment] = useState('');
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        if (!comment || rating === 0) {
            setError('Por favor, completa todos los campos');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:2999/comment/add-comment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    productId,
                    productName,
                    productImage,
                    productDescription,
                    comment,
                    rating,
                    username: user.username,
                    uid: user.uid
                })
            });

            const data = await response.json();

            if (response.ok) {
                addCommentToProduct(productId, data);  // Actualiza el contexto global de productos
                onCommentSubmit(data);  // Actualiza la UI local si es necesario
                setComment('');
                setRating(0);
                setHover(0);
            } else {
                throw new Error(data.message || 'Error al enviar el comentario');
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const renderStars = (rating) => {
        return Array(5)
            .fill('')
            .map((_, i) => (
                <Icon
                    key={i}
                    as={StarIcon}
                    color={i < rating ? 'yellow.400' : 'gray.300'}
                    onClick={() => setRating(i + 1)}
                    onMouseEnter={() => setHover(i + 1)}
                    onMouseLeave={() => setHover(rating)}
                    cursor="pointer"
                />
            ));
    };

    return (
        <Box as="form" onSubmit={handleSubmit} p={4} boxShadow="md" borderRadius="md" bg="white" mt={4}>
            <FormControl id="comment" isRequired>
                <FormLabel>Tu comentario</FormLabel>
                <Textarea value={comment} onChange={(e) => setComment(e.target.value)} />
            </FormControl>
            <FormControl id="rating" isRequired mt={4}>
                <FormLabel>Tu puntuación</FormLabel>
                <HStack spacing={1}>
                    {renderStars(hover || rating)}
                </HStack>
            </FormControl>
            {error && (
                <Text color="red.500" mt={2}>
                    {error}
                </Text>
            )}
            <Button type="submit" colorScheme="blue" isLoading={loading} mt={4}>
                Enviar comentario
            </Button>
        </Box>
    );
};

export default ProductCommentForm;
