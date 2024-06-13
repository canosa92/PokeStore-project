import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    const fetchUserData = async () => {
        try {
            if (!token) return; // Si no hay token, no se hace la petición

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

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');

        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error('Error parsing stored user data:', error);
                setUser(null); // Manejar el error al parsear JSON
            }
        }

        if (storedToken) {
            setToken(storedToken);
            fetchUserData(); // Solo hacer la llamada si hay token
        }
    }, []);

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
        <UserContext.Provider value={{ user, setUser, token, login, register, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
