import React from 'react';
import { Link } from 'react-router-dom';
import { VStack, HStack } from '@chakra-ui/react';

const NavLinks = () => {
  return (
    <>
      <HStack as="nav" spacing={4} display={{ base: 'none', md: 'flex' }}>
        <Link to="/" style={{ color: 'white' }}>Home</Link>
        <Link to="/todos" style={{ color: 'white' }}>Todos</Link>
        <Link to="/tipos" style={{ color: 'white' }}>Tipos</Link>
        <Link to="/pokemon/legendarios" style={{ color: 'white' }}>Legendarios</Link>
        <Link to="/pokemon/misticos" style={{ color: 'white' }}>Misticos</Link>
      </HStack>
      <VStack alignItems="flex-start" spacing={4} display={{ base: 'flex', md: 'none' }}>
        <Link to="/" style={{ color: 'white' }}>Home</Link>
        <Link to="/todos" style={{ color: 'white' }}>Todos</Link>
        <Link to="/tipos" style={{ color: 'white' }}>Tipos</Link>
        <Link to="/pokemon/legendarios" style={{ color: 'white' }}>Legendarios</Link>
        <Link to="/pokemon/misticos" style={{ color: 'white' }}>Misticos</Link>
      </VStack>
    </>
  );
};

export default NavLinks;
