import { Link } from 'react-router-dom';
import { Box, Text, Flex, Stack, Divider, Link as ChakraLink } from '@chakra-ui/react';

const Footer = () => {
    return (
        <Box as="footer" py={10} bg="gray.800" color="white">
            <Stack spacing={8} align="center">
                <Box textAlign="center">
                    <Text>*Esto es solo un proyecto de desarrollo FullStack MERN.</Text>
                    <Text>Comprar Pokémon va en contra de la filosofía de los creadores de Pokémon.</Text>
                    <Text>Capturarlos te saldrá mejor.</Text>
                </Box>
                <Box textAlign="center">
                    <Text>Proyecto para el bootcamp online de Full Stack de The Bridge.</Text>
                    <Text>Realizado por Álvaro Martín y Adrián Canosa.</Text>
                </Box>
                <Divider borderColor="gray.600" />
                <Flex justify="center">
                    <ChakraLink as={Link} to="/about" mx={2} fontWeight="bold" color="blue.400">
                        About
                    </ChakraLink>
                </Flex>
            </Stack>
        </Box>
    );
};

export default Footer;
