import React from 'react';
import { Box, Text, Link, Flex } from '@chakra-ui/react';

const Footer = () => {
  return (
    <Box bg="gray.800" color="white" py={4} mt={8}>
      <Flex justify="center" align="center" direction="column">
        <Text>© 2024 Pokedex, All Rights Reserved.</Text>
        <Text>Proyecto creado para el bootcamp online Desarrollar FullStack web de The Bridge</Text>
      </Flex>
    </Box>
  );
};

export default Footer;
