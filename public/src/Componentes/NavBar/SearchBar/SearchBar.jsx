import React, { useState } from 'react';
import { Box, Input, IconButton } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';

const SearchBar = () => {
  const [showInput, setShowInput] = useState(false);

  return (
    <Box textAlign="center">
      {showInput || window.innerWidth >= 768 ? (
        <Input placeholder="Buscar..." width="200px" />
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
