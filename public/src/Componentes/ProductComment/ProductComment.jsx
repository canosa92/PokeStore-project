import { useState } from 'react';
import PropTypes from 'prop-types';
import { useUser } from '../../usecontext/UserContext.jsx';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Textarea,
  Text,
  HStack,
  Icon
} from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';

const ProductCommentForm = ({ productId, productName, productImage, productDescription, onCommentSubmit }) => {
  const { user, token } = useUser();
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handles the form submission for adding a comment
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const parsedRating = Number(rating);
    if (!comment || parsedRating === 0 || isNaN(parsedRating)) {
      setError('Please fill in all fields and ensure the rating is a valid number.');
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
          rating: parsedRating,
          username: user.username,
          uid: user.uid,
        })
      });

      const data = await response.json();

      if (response.ok) {
        onCommentSubmit(data);
        setComment('');
        setRating(0);
        setHover(0);
      } else {
        throw new Error(data.message || 'Error submitting the comment');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Box as="form" onSubmit={handleSubmit} p={4} boxShadow="md" borderRadius="md" bg="white" mt={4}>
      <FormControl id="comment" isRequired>
        <FormLabel>Your Comment</FormLabel>
        <Textarea value={comment} onChange={(e) => setComment(e.target.value)} />
      </FormControl>
      <FormControl id="rating" isRequired mt={4}>
        <FormLabel>Your Rating</FormLabel>
        <HStack spacing={1}>
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
      {error && (
        <Text color="red.500" mt={2}>
          {error}
        </Text>
      )}
      <Button type="submit" colorScheme="blue" isLoading={loading} mt={4}>
        Submit Comment
      </Button>
    </Box>
    </>
  );
};

// PropTypes validation
ProductCommentForm.propTypes = {
  productId: PropTypes.string.isRequired,        // ID of the product
  productName: PropTypes.string.isRequired,      // Name of the product
  productImage: PropTypes.string.isRequired,     // Image of the product
  productDescription: PropTypes.string.isRequired, // Description of the product
  onCommentSubmit: PropTypes.func.isRequired,    // Function to call on comment submission
};

export default ProductCommentForm;
