import React from 'react';
import './App.css';
import Rutas from './Routes/Routes.jsx'
import { ProductProvider } from './usecontext/ProductContext.jsx';
import { CarritoProvider } from './usecontext/CarritoContext.jsx';
import { UserProvider } from './usecontext/UserContext.jsx';
import { ChakraProvider } from '@chakra-ui/react';

function App() {
  return (
    <ChakraProvider>
      <UserProvider>
        <ProductProvider>
          <CarritoProvider>
            <Rutas />
          </CarritoProvider>
        </ProductProvider>
      </UserProvider>
    </ChakraProvider>
  );
}

export default App;
