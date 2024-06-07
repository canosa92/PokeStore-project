import React, { useState } from 'react';
import { Box, Input, IconButton } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [showInput, setShowInput] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (event) => {
    event.preventDefault();
    if (query) {
      navigate(`/pokemon/${query}`);
    }
  };

  return (
    <Box textAlign="center">
      {showInput || window.innerWidth >= 768 ? (
        <form onSubmit={handleSearch}>
          <Input
            placeholder="Buscar..."
            width="200px"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>
      ) : (
        <IconButton
          icon={<SearchIcon />}
          onClick={() => setShowInput(!showInput)}
        />
      )}
    </Box>
  );
};

export default SearchBar;
