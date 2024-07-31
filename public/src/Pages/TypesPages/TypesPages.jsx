import React from 'react';
import { Box, SimpleGrid} from '@chakra-ui/react';
import { useProducts } from '../../usecontext/ProductContext';
import Type from '../../Componentes/Type.jsx';

const TypesPages = () => {
  const { products } = useProducts();
  const types = Array.from(new Set(products.map(product => product.tipo[0])));

  return (
    <>
    <Box position="relative">
      <SimpleGrid columns={{ base: 2, sm: 3, md: 5 }} spacing="20px" padding="20px">
        {types.map(type => (
          <Type key={type} type={type} />
        ))}
      </SimpleGrid>
    </Box>
    </>
  );
};

export default TypesPages;