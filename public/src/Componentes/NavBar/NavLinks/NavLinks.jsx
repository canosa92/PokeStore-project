
import { Link } from 'react-router-dom';
import { VStack, HStack } from '@chakra-ui/react';
import { useUser } from '../../../usecontext/UserContext.jsx';


const NavLinks = () => {
  const { user } = useUser();

  const homeLink = user ? { text: 'Mi Perfil', path: '/myprofile' } : { text: 'Home', path: '/' };

  return (
    <>
      <HStack as="nav" spacing={4} display={{ base: 'none', md: 'flex' }}>
        <Link to={homeLink.path} style={{ color: 'white' }}>{homeLink.text}</Link>
        <Link to="/pokemon" style={{ color: 'white' }}>Todos</Link>
        <Link to="/pokemon/tipos" style={{ color: 'white' }}>Tipos</Link>
        <Link to="/pokemon/legendarios" style={{ color: 'white' }}>Legendarios</Link>
        <Link to="/pokemon/misticos" style={{ color: 'white' }}>Misticos</Link>
      </HStack>
      <VStack alignItems="flex-start" spacing={4} display={{ base: 'flex', md: 'none' }}>
        <Link to={homeLink.path} style={{ color: 'white' }}>{homeLink.text}</Link>
        <Link to="/todos" style={{ color: 'white' }}>Todos</Link>
        <Link to="/tipos" style={{ color: 'white' }}>Tipos</Link>
        <Link to="/pokemon/legendarios" style={{ color: 'white' }}>Legendarios</Link>
        <Link to="/pokemon/misticos" style={{ color: 'white' }}>Misticos</Link>
      </VStack>
    </>
  );
};

export default NavLinks;
