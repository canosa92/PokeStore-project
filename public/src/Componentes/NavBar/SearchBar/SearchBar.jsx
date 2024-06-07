// SearchBar.jsx
import React, { useState } from 'react';
import { InputGroup, InputLeftElement, Input, IconButton } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/pokemon/${query}`);
    }
  };

  return (
    <InputGroup>
      <InputLeftElement pointerEvents="none">
        <SearchIcon color="gray.300" />
      </InputLeftElement>
      <Input
        placeholder="Buscar Pokémon"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        color="white" // Cambiar color del texto a blanco
      />
      <IconButton
        aria-label="Search Pokémon"
        icon={<SearchIcon />}
        onClick={handleSearch}
        display={{ base: 'block', md: 'none' }}
      />
    </InputGroup>
  );
};

export default SearchBar;
