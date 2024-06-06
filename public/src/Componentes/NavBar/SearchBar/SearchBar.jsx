import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, IconButton, Input, Button } from '@chakra-ui/react';
import { CloseIcon, SearchIcon } from '@chakra-ui/icons';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = () => {
    performSearch();
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      performSearch();
    }
  };

  const performSearch = () => {
    const formattedSearchTerm = searchTerm.charAt(0).toUpperCase() + searchTerm.slice(1);
    navigate(`/product/${formattedSearchTerm}`);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  return (
    <Box className="search-container">
      <IconButton
        icon={isSearchOpen ? <CloseIcon /> : <SearchIcon />}
        aria-label="Toggle Search"
        onClick={toggleSearch}
      />
      {isSearchOpen && (
        <Box className="search-input-container">
          <Input
            type="text"
            className="search-input"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <Button className="search-button" onClick={handleSearch}>
            Buscar
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default SearchBar;
