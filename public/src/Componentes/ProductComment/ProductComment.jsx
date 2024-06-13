import { useState } from 'react';
import { useUser } from '../../usecontext/UserContext.jsx';
import { Box, Button, FormControl, FormLabel, Textarea, Text, VStack, HStack, Icon } from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';

const ProductCommentForm = ({ productId, onCommentSubmit }) => {
  const { user, token, setUser } = useUser();
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
      const response = await fetch('http://localhost:2999/add-comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: user.uid,
          productId,
          comment,
          rating,
          username: user.username
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      const newComment = await response.json();

      // Actualizar el contexto del usuario
      setUser(prevUser => ({
        ...prevUser,
        comments: [
          ...prevUser.comments,
          {
            productId,
            comment: newComment.comment,
            rating: newComment.rating
          }
        ]
      }));

      if (typeof onCommentSubmit === 'function') {
        onCommentSubmit(newComment);
      }

      setComment('');
      setRating(0);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="comment-form" p={4} borderWidth={1} borderRadius="md">
      <Text fontSize="2xl" mb={4}>Dejar un comentario</Text>
      {error && <Text color="red.500">{error}</Text>}
      <form onSubmit={handleSubmit}>
        <FormControl id="rating" mb={4}>
          <FormLabel>Calificación:</FormLabel>
          <HStack>
            {[1, 2, 3, 4, 5].map(star => (
              <Icon
                as={StarIcon}
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                cursor="pointer"
                color={star <= (hover || rating) ? 'gold' : 'gray.300'}
              />
            ))}
          </HStack>
        </FormControl>
        <FormControl id="comment" mb={4}>
          <FormLabel>Comentario:</FormLabel>
          <Textarea
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            required
          />
        </FormControl>
        <Button type="submit" colorScheme="blue" isLoading={loading}>
          {loading ? 'Cargando...' : 'Enviar'}
        </Button>
      </form>
    </Box>
  );
};

export default ProductCommentForm;
