import { createContext, useContext, useState, useEffect } from "react";
import { IconButton } from "@chakra-ui/react"; // Importa IconButton desde Chakra UI
import { FaHeart, FaRegHeart } from "react-icons/fa";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [wishListProducts, setWishListProducts] = useState([]);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');

        if (storedUser && storedToken) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                setToken(storedToken);
                fetchUser(storedToken);
                fetchWishList(); // Fetch wishlist when user is loaded
            } catch (error) {
                console.error('Error parsing user data from localStorage:', error);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        }
    }, []);

    const fetchUser = async (token) => {
        try {
            const response = await fetch('http://localhost:2999/user/user-profile', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user data');
            }

            const userData = await response.json();
            setUser(userData.user);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const fetchWishList = async () => {
        try {
            const response = await fetch('http://localhost:2999/user/wishlist', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch wishlist');
            }

            const data = await response.json();
            setWishListProducts(data.wishList);
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        }
    };

    const login = async (email, password) => {
        try {
            const response = await fetch('http://localhost:2999/user/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }

            const data = await response.json();
            setUser(data.user);
            setToken(data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('token', data.token);
            return true;
        } catch (error) {
            console.error('Error logging in:', error.message);
            return false;
        }
    };

    const register = async (email, password, name, username) => {
        try {
            const response = await fetch('http://localhost:2999/user/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, name, username })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }

            const data = await response.json();
            setUser(data.user);
            setToken(data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('token', data.token);
            return true;
        } catch (error) {
            console.error('Error registering:', error.message);
            return false;
        }
    };

    const toggleWishList = async (userId, productId) => {
        try {
            const response = await fetch(`http://localhost:2999/user/wishlist/${user.wishList.includes(productId) ? 'remove' : 'add'}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ userId, productId }),
            });

            if (!response.ok) {
                throw new Error('Failed to toggle wishlist');
            }

            const data = await response.json();

            // Update wishListProducts state
            setWishListProducts(data.wishList);

            // Update user state
            setUser((prevUser) => ({
                ...prevUser,
                wishList: data.wishList, // Update user's wishList with the response
            }));
        } catch (error) {
            console.error('Error updating wishlist:', error);
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    return (
        <UserContext.Provider value={{ user, setUser, token, login, register, logout, fetchUser, toggleWishList, wishListProducts, fetchWishList }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
