import React from 'react';
import { Link } from 'react-router-dom';

const NavLinks = () => {
  return (
    <>
      <Link to="/" style={{ color: 'white' }}>Home</Link>
      <Link to="/todos" style={{ color: 'white' }}>All Pokemon</Link>
      <Link to="/tipos" style={{ color: 'white' }}>Tipos</Link>
      <Link to="/pokemon/legendarios" style={{ color: 'white' }}>Legendarios</Link>
      <Link to="/pokemon/misticos" style={{ color: 'white' }}>Místicos</Link>
    </>
  );
};

export default NavLinks;
