
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../../usecontext/ProductContext';
import Cards from '../../Componentes/Cards/Cards.jsx';
import { Box, Input, VStack, Text, Image, Flex } from '@chakra-ui/react';
import PokemonBaner from '../../assets/Imagenes/pokemonBaner.jpeg'; 

const Home = () => {
  const {products} = useProducts();
  const [bestRated, setBestRated] = useState([]);
  const [mostCommented, setMostCommented] = useState([]);
  const [newest, setNewest] = useState([]);
  const [topTypes, setTopTypes] = useState([]);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      setBestRated(products.filter(p => p.likes[0].likesCount > 0).sort((a, b) => b.likes[0].likes - a.likes[0].likes).slice(0, 5));
      setMostCommented(products.filter(p => p.reviews.length > 0).sort((a, b) => b.reviews.length - a.reviews.length).slice(0, 5));
      setNewest(products.slice(-5).reverse());

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

  return (
    <Box>
      <Box position="relative" textAlign="center">
        <Image src={PokemonBaner} alt="Background" objectFit="cover" w="100%" h="400px" />
        <Box position="absolute" top="0" left="0" w="100%" h="100%" bg="rgba(0, 0, 0, 0.5)" color="white">
          <VStack spacing={4} align="center" justify="center" h="100%">
            <Text fontSize="3xl" fontWeight="bold">
              ¡Bienvenido a nuestra tienda exclusiva de Pokémon!
            </Text>
            <Text fontSize="xl">
              En nuestro mundo, los Pokémon son más que simples criaturas: son compañeros de aventuras, amigos leales y poderosos aliados en tu viaje para convertirte en el mejor entrenador.
            </Text>
            <Box width="300px">
              <Input
                placeholder="Buscar Pokémon..."
                value={query}
                onChange={handleSearchChange}
                bg="white"
                color="black"
              />
              {suggestions.length > 0 && (
                <Box bg="white" color="black" mt={2} p={2} borderRadius="md">
                  {suggestions.map((product) => (
                    <Link key={product.id} to={`/pokemon/${product.nombre}`}>
                      <Text>{product.nombre}</Text>
                    </Link>
                  ))}
                </Box>
              )}
            </Box>
          </VStack>
        </Box>
      </Box>
      <Box p={4}>
        <Box className="home-section">
          <Text fontSize="2xl" fontWeight="bold">Novedades</Text>
          <Cards products={newest} />
        </Box>
        <Box className="home-section">
          <Text fontSize="2xl" fontWeight="bold">Pokémon Mejor Valorados</Text>
          <Cards products={bestRated} />
        </Box>
        <Box className="home-section">
          <Text fontSize="2xl" fontWeight="bold">Pokémon con Más Comentarios</Text>
          <Cards products={mostCommented} />
        </Box>
        <Box className="home-section">
          <Text fontSize="2xl" fontWeight="bold">Tipos Más Vendidos</Text>
          <Flex wrap="wrap" justify="center">
            {topTypes.map(({ type, image }) => (
              <Box key={type} m={2}>
                <Link to={`/pokemon/tipo/${type}`}>
                  <Image src={image} alt={type} boxSize="150px" borderRadius="md" />
                  <Text textAlign="center">{type}</Text>
                </Link>
              </Box>
            ))}
          </Flex>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;