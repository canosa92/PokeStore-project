import { useState } from 'react';
import { InputGroup, InputLeftElement, Input, IconButton, Box, List, ListItem } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../../../usecontext/ProductContext';

const SearchBar = ({ isMobile }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();
  const { products } = useProducts();

  // Handle search when the user presses enter or clicks the search icon
  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/pokemon/${query}`);
    }
  };

  // Update query and filter suggestions based on input value
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

  // Handle suggestion click to fill the input and navigate
  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.nombre);
    setSuggestions([]);
    navigate(`/pokemon/${suggestion.nombre}`);
  };

  return (
    <Box position="relative" maxW="300px" mx="auto">
      <InputGroup zIndex={isMobile ? 10 : 1}>
        <InputLeftElement pointerEvents="none">
          <SearchIcon color="gray.300" />
        </InputLeftElement>
        <Input
          placeholder="Buscar Pokémon"
          value={query}
          onChange={handleSearchChange}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          color="white"
          display={{ base: isMobile ? 'block' : 'none', md: 'block' }}
        />
        {isMobile && (
          <IconButton
            aria-label="Search Pokémon"
            icon={<SearchIcon />}
            onClick={handleSearch}
            display={{ base: 'block', md: 'none' }}
          />
        )}
      </InputGroup>
      {suggestions.length > 0 && (
        <List
          position="absolute"
          bg="white"
          borderRadius="md"
          boxShadow="md"
          mt={1}
          maxH="200px"
          overflowY="auto"
          w="100%"  // Ensure the list takes the same width as the input
          zIndex={1000}
        >
          {suggestions.map((product) => (
            <ListItem
              key={product._id}
              p={2}
              _hover={{ bg: "gray.100" }}
              cursor="pointer"
              onClick={() => handleSuggestionClick(product)}
            >
              {product.nombre}
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default SearchBar;
