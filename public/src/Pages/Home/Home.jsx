import { Box, Heading, Text, Center, Input, Flex, VStack, useColorModeValue } from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const bgOverlay = useColorModeValue('rgba(255, 255, 255, 0.8)', 'rgba(0, 0, 0, 0.8)');

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      navigate(`/pokemon/${searchQuery}`);
    }
  };

  return (
    <Box 
      position="relative" 
      height="100vh" 
      backgroundImage="url('/path/to/your/image.jpg')" 
      backgroundSize="cover" 
      backgroundPosition="center"
    >
      <Box 
        position="absolute" 
        top={0} 
        left={0} 
        right={0} 
        bottom={0} 
        bg={bgOverlay} 
        display="flex" 
        flexDirection="column" 
        justifyContent="center" 
        alignItems="center"
        padding={4}
      >
        <VStack spacing={4} textAlign="center">
          <Heading as="h1" size="2xl" color="white">
            Bienvenido a la Pokedex
          </Heading>
          <Text fontSize="xl" color="white">
            Busca tu Pokémon favorito
          </Text>
          <Input 
            placeholder="Buscar Pokémon" 
            size="lg" 
            width={{ base: '80%', md: '50%', lg: '30%' }} 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            onKeyPress={handleSearch}
            bg="white"
            color="black"
          />
        </VStack>
      </Box>
    </Box>
  );
};

export default Home;
