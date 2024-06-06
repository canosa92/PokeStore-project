import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../../../usecontext/UserContext.jsx';
import { Box, Button, Input } from '@chakra-ui/react';

const LoginForm = () => {
  const { setUser } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:2999/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        throw new Error('Error al iniciar sesión');
      }
      const data = await response.json();
      console.log(data);
      localStorage.setItem('token', data.user.token);
      setUser(data.user);
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    }
  };

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  return (
    <Box onMouseEnter={toggleForm} className="login-form-container">
      <Button>Login</Button>
      {showForm && (
        <form onSubmit={handleSubmit} className="login-form">
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Correo electrónico" />
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" />
          <Button type="submit">Iniciar sesión</Button>
          <h4><Link to="/user/register">¿No estás registrado?</Link></h4>
        </form>
      )}
    </Box>
  );
};

export default LoginForm;
