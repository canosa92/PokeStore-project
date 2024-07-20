import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../../usecontext/ProductContext.jsx';
import { useUser } from '../../usecontext/UserContext.jsx'
import Cards from '../../Componentes/Cards/Cards.jsx';
import { Box, Input, VStack, Text, Image, Flex, Container, Heading, IconButton, useColorModeValue, Button, Alert } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import PokemonBaner from '../../assets/Imagenes/pokemonBaner.jpeg';
import Type from '../../Componentes/Type.jsx';

const Home = () => {
  const { products } = useProducts();
  const { user,wishListProducts } = useUser();
  const [bestRated, setBestRated] = useState([]);
  const [mostCommented, setMostCommented] = useState([]);
  const [newest, setNewest] = useState([]);
  const [topTypes, setTopTypes] = useState([]);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
 

  useEffect(() => {
    if (products.length > 0) {
      setBestRated(
        products
          .filter(p => p.likes[0].star > 0)
          .sort((a, b) => b.likes[0].star - a.likes[0].star)
          .slice(0, 10)
      );
      setMostCommented(
        products
          .filter(p => p.reviews.length > 0)
          .sort((a, b) => b.reviews.length - a.reviews.length)
          .slice(0, 10)
      );
      setNewest(products.sort(() => 0.5 - Math.random()).slice(0, 10));

      const uniqueTypes = [...new Set(products.map(product => product.tipo[0]))];
      const randomTypes = uniqueTypes.sort(() => 0.5 - Math.random()).slice(0, 5);
      const topTypesProducts = randomTypes.map(type => ({
        type,
        image: products.find(product => product.tipo.includes(type)).imagen
      }));
      setTopTypes(topTypesProducts);
    }
  }, [products]);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setQuery(value);
    if (value.length > 1) {
      const filteredProducts = products.filter(product =>
        product.nombre.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredProducts);
    } else {
      setSuggestions([]);
    }
  };

  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  
  const CardSlider = ({ products, title }) => {
    const [startIndex, setStartIndex] = useState(0);
  
    const itemsPerPage = 4;
    
    const getVisibleProducts = () => {
      return products.slice(startIndex, startIndex + itemsPerPage);
    };
  
    const handleNext = () => {
      setStartIndex((prevIndex) => 
        (prevIndex + itemsPerPage) % products.length
      );
    };
  
    const handlePrev = () => {
      setStartIndex((prevIndex) => 
        (prevIndex - itemsPerPage + products.length) % products.length
      );
    };
  
    return (
      <Box mb={8}>
        <Heading as="h2" size="lg" mb={4}>{title}</Heading>
        <Flex alignItems="center">
          <IconButton
            icon={<ChevronLeftIcon />}
            onClick={handlePrev}
            mr={2}
            aria-label="Previous"
          />
          <Flex overflow="hidden" flex="1">
            <Cards products={getVisibleProducts()} />
          </Flex>
          <IconButton
            icon={<ChevronRightIcon />}
            onClick={handleNext}
            ml={2}
            aria-label="Next"
          />
        </Flex>
      </Box>
    );
  };
  
  return (
    <>
    <Box bg={bgColor} color={textColor}>
      <Box position="relative" textAlign="center">
        <Image src={PokemonBaner} alt="Background" objectFit="cover" w="100%" h="400px" />
        <Box position="absolute" top="0" left="0" w="100%" h="100%" bg="rgba(0, 0, 0, 0.5)" color="white">
          <VStack spacing={4} align="center" justify="center" h="100%">
            <Heading as="h1" size="2xl">¡Bienvenido a nuestra tienda exclusiva de Pokémon!</Heading>
            <Text fontSize="xl" maxW="container.md">
              En nuestro mundo, los Pokémon son más que simples criaturas: son compañeros de aventuras, amigos leales y poderosos aliados en tu viaje para convertirte en el mejor entrenador.
            </Text>
            <Box width="300px" position="relative">
              <Input
                placeholder="Buscar Pokémon..."
                value={query}
                onChange={handleSearchChange}
                bg="white"
                color="black"
              />
              {suggestions.length > 0 && (
                <Box position="absolute" top="100%" left="0" right="0" bg="white" color="black" mt={2} p={2} borderRadius="md" zIndex={1} boxShadow="md">
                  {suggestions.map((product) => (
                    <Link key={product.id} to={`/pokemon/${product.nombre}`}>
                      <Text p={2} _hover={{ bg: "gray.100" }}>{product.nombre}</Text>
                    </Link>
                  ))}
                </Box>
              )}
            </Box>
          </VStack>
        </Box>
      </Box>
      <Container maxW="container.xl" py={8}>
        <CardSlider products={newest} title="Novedades" />
        <CardSlider products={bestRated} title="Pokémon Mejor Valorados" />
        <CardSlider products={mostCommented} title="Pokémon con Más Comentarios" />
        
        <Box mb={8}>
          <Heading as="h2" size="lg" mb={4}>Tipos Más Vendidos</Heading>
          <Flex wrap="wrap" justify="center">
            {topTypes.map(({ type, image }) => (
              <Box key={type} m={2}>
                <Type type={type} image={image} />
              </Box>
            ))}
          </Flex>
        </Box>

        <Box mb={8}>
          {user ? (
            wishListProducts && wishListProducts.length > 0 ? (
              <CardSlider products={wishListProducts} title="Mi Lista de Deseos" />
            ) : (
              <Box mb={8}>
                <Heading as="h2" size="lg" mb={4}>Tus Pokemon Favoritos</Heading>
              <VStack spacing={4} align="center">
                <Alert >Tu lista de favoritos esta vacia, animate y añadelos.</Alert>
              </VStack>
              </Box>
            )
          ) : (
            <VStack spacing={4} align="center">
              <Alert alignItems={"center"}>¡Regístrate o inicia sesión para añadir tus Pokemon preferidos a tu lista de favoritos!</Alert>
              <Flex>
              <Link to="/user/register">
                <Button colorScheme="blue" mr={2} >Registrarse</Button>
                </Link>
                <Link to="/login">
                <Button colorScheme="green" >Iniciar Sesión</Button>
                </Link>
              </Flex>
            </VStack>
          )}

        </Box>
      </Container>
    </Box>
    </>
  );
};

export default Home;