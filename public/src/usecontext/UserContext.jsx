import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    useEffect(() => {
        // Intentar cargar datos del usuario y token desde localStorage al inicio
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');

        if (storedUser && storedToken) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                setToken(storedToken);
            } catch (error) {
                console.error('Error parsing user data from localStorage:', error);
            }
        }
    }, []);

    const fetchUser = async (token) => {
        try {
            const response = await fetch('http://localhost:2999/user-profile', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user data');
            }

            const userData = await response.json();
            setUser(userData);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const deleteUser = async (username) => {
        try {
            const response = await fetch(`http://localhost:8080/user/delete/${username}`, {
                method: 'DELETE',
                credentials: 'include', // Esto asegura que la cookie de sesión se envíe con la solicitud
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const data = await response.json();
            if (response.ok) {
                console.log('Usuario eliminado correctamente:', data.message);
            } else {
                console.error('Error al eliminar usuario:', data.message);
            }
        } catch (error) {
            console.error('Error al realizar la solicitud:', error);
        }
    };

    const login = async (email, password) => {
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
            setUser(data.user);
            setToken(data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('token', data.token);
            return { success: true, user: data.user };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    const register = async (formData) => {
        try {
            const response = await fetch('http://localhost:2999/user/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Error al registrar usuario');
            }

            const userData = await response.json();
            setUser(userData.user);
            setToken(userData.token);
            localStorage.setItem('user', JSON.stringify(userData.user));
            localStorage.setItem('token', userData.token);
            return { success: true, user: userData.user };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    return (
        <UserContext.Provider value={{ user, setUser, token, login, register, logout, fetchUser, deleteUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);

