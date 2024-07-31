import { useState, useEffect } from 'react';
import { Box, Image, Link, Flex } from '@chakra-ui/react';

const Type = ({ type }) => {
  const [imageSrc, setImageSrc] = useState('');

  useEffect(() => {
    const loadImage = async () => {
      try {
        const image = await import(`../assets/Imagenes/tipos/${type}.webp`);
        setImageSrc(image.default);
      } catch (error) {
        console.error(`Error loading image for type ${type}:`, error);
      }
    };

    loadImage();
  }, [type]);

  return (
    <>
    <Link href={`/pokemon/tipo/${type}`} textDecoration="none" _hover={{ textDecoration: 'none' }}>
      <Box position="relative" textAlign="center" borderRadius="lg" overflow="hidden" width="150px" margin="0 auto">
        {imageSrc && (
          <Image src={imageSrc} alt={type} width="100%" maxHeight="150px" objectFit="cover" />
        )}
        <Flex
          position="absolute"
          top="0"
          left="0"
          width="100%"
          height="100%"
          align="center"
          justify="center"
        >
        </Flex>
      </Box>
    </Link>
    </>
  );
};

export default Type;
