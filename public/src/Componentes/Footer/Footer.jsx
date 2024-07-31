import { Box, Flex, Link, Text, Stack } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
  return (
    <>
    <Box bg="gray.800" color="white" py={4}>
      <Flex align="center" justify="center" direction="column">
        <Stack direction="row" spacing={4}>
          <Link as={RouterLink} to="/" color="white">Home</Link>
          <Link as={RouterLink} to="/about" color="white">About</Link>
          <Link as={RouterLink} to="/contact" color="white">Contact</Link>
        </Stack>
        <Text mt={2}>&copy; {new Date().getFullYear()} My Pokemon Store. All rights reserved.</Text>
        <Text mt={2}>Proyecto creado para el bootcamp online Desarrollar FullStack web de The Bridge</Text>
      </Flex>
    </Box>
    </>
  );
};

export default Footer;