import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../../usecontext/ProductContext';
import Cards from '../../Componentes/Cards/Cards.jsx';
import PokemonBanner from '../../assets/Imagenes/pokemonBaner.jpeg';
import {
  Box,
  Heading,
  Text,
  Image,
  Flex,
  Grid,
  GridItem,
  Link as ChakraLink
} from '@chakra-ui/react';

const Home = () => {
  const products = useProducts();
  const [bestRated, setBestRated] = useState([]);
  const [mostCommented, setMostCommented] = useState([]);
  const [newest, setNewest] = useState([]);
  const [topTypes, setTopTypes] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      setBestRated(products.filter(p => p.likes[0].likesCount > 0).sort((a, b) => b.likes[0].likes - a.likes[0].likes).slice(0, 5));
      setMostCommented(products.filter(p => p.reviews.length > 0).sort((a, b) => b.reviews.length - a.reviews.length).slice(0, 5));
      setNewest(products.slice(-5).reverse());

      // Obtener tipos más vendidos al azar
      const uniqueTypes = [...new Set(products.map(product => product.tipo[0]))];
      const randomTypes = uniqueTypes.sort(() => 0.5 - Math.random()).slice(0, 5);
      const topTypesProducts = randomTypes.map(type => ({
        type,
        image: products.find(product => product.tipo.includes(type)).imagen
      }));
      setTopTypes(topTypesProducts);
    }
  }, [products]);

  return (
    <Box bg="gray.50" p={4}>
      <Image src={PokemonBanner} alt="Background" width="100%" mb={6} borderRadius="md" />
      <Box textAlign="center" mb={6}>
        <Heading as="h1" size="xl" mb={2}>¡Bienvenido a nuestra tienda exclusiva de Pokémon!</Heading>
        <Text fontSize="lg">En nuestro mundo, los Pokémon son más que simples criaturas: son compañeros de aventuras, amigos leales y poderosos aliados en tu viaje para convertirte en el mejor entrenador. En nuestra tienda, te ofrecemos la oportunidad de llevar a casa a tus Pokémon favoritos, desde los más populares hasta los legendarios más raros.</Text>
      </Box>
      <Box mb={6}>
        <Heading as="h2" size="lg" mb={4}>Novedades</Heading>
        <Cards products={newest} />
      </Box>
      <Box mb={6}>
        <Heading as="h2" size="lg" mb={4}>Pokémon Mejor Valorados</Heading>
        <Cards products={bestRated} />
      </Box>
      <Box mb={6}>
        <Heading as="h2" size="lg" mb={4}>Pokémon con Más Comentarios</Heading>
        <Cards products={mostCommented} />
      </Box>
      <Box>
        <Heading as="h2" size="lg" mb={4}>Tipos Más Vendidos</Heading>
        <Grid templateColumns="repeat(auto-fill, minmax(150px, 1fr))" gap={6}>
          {topTypes.map(({ type, image }) => (
            <GridItem key={type} textAlign="center">
              <ChakraLink as={Link} to={`/pokemon/tipo/${type}`}>
                <Image src={image} alt={type} borderRadius="md" mb={2} />
                <Heading as="h3" size="md">{type}</Heading>
              </ChakraLink>
            </GridItem>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Home;
