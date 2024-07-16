import { createContext, useContext, useState, useEffect } from "react";

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
            } catch (error) {
                console.error('Error parsing user data from localStorage:', error);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        }
    }, []);

    const fetchUser = async (token) => {
        try {
            const userId = user.uid; // Asegúrate de que 'user' esté disponible aquí
            const response = await fetch(`http://localhost:2999/user/${userId}/user-profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch user data');
            }
    
            const userData = await response.json();
            setUser(userData.user);
            setWishListProducts(userData.wishListProducts);
        } catch (error) {
            console.error('Error fetching user data:', error);
            // Puedes manejar el error aquí, por ejemplo, cerrando la sesión del usuario
            logout();
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
        await fetchUser(data.token); // Llama a fetchUser después de establecer el usuario y el token
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
            fetchUser(data.token);
            return true;
        } catch (error) {
            console.error('Error registering:', error.message);
            return false;
        }
    };

   

    const addToWishList = async (productId) => {
        try {
            const token = localStorage.getItem('token'); // O donde sea que lo estés almacenando
            const response = await fetch(`http://localhost:2999/user/${user.uid}/wishlist/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ productId }),
            });
    
            if (!response.ok) {
                throw new Error('Failed to add to wishlist');
            }
    
            const data = await response.json();
            setUser(prevUser => ({
                ...prevUser,
                wishList: data.wishList
            }));
            console.log('Product added to wishlist:', productId);
        } catch (error) {
            console.error('Error adding to wishlist:', error);
        }
    };
    
    const removeFromWishList = async (productId) => {
        try {
            const response = await fetch('http://localhost:2999/user/wishlist/remove', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ productId }),
            });
    
            if (!response.ok) {
                throw new Error('Failed to remove from wishlist');
            }
    
            const data = await response.json();
            setUser(prevUser => ({
                ...prevUser,
                wishList: data.wishList
            }));
            console.log('Product removed from wishlist:', productId);
        } catch (error) {
            console.error('Error removing from wishlist:', error);
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        setWishListProducts([]);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    return (
        <UserContext.Provider value={{ 
            user, 
            token, 
            wishListProducts,
            login, 
            register, 
            logout, 
            fetchUser, 
            addToWishList, 
            removeFromWishList 
        }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);