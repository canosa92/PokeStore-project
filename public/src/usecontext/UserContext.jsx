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
                if (parsedUser && storedToken) {
                    fetchUser(parsedUser, storedToken);
                }
            } catch (error) {
                console.error('Error parsing user data from localStorage:', error);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        }
    }, []);

    const fetchUser = async (user, token) => {
        if (!user) {
            console.error('User is null');
            return;
        }
    
        try {
            const userId = user.uid;
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
            
            await fetchUser(data.user, data.token);
            return true;
        } catch (error) {
            console.error('Error logging in:', error.message);
            return false;
        }
    };
    
    const register = async (email, password, name, username, role) => {
        try {
          const response = await fetch('http://localhost:2999/user/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, name, username, role })
          });
      
          const data = await response.json();
      
          if (!response.ok) {
            return { success: false, message: data.message || 'Registration failed' };
          }
      
          setUser(data.user);
          setToken(data.token);
          
          localStorage.setItem('user', JSON.stringify(data.user));
          localStorage.setItem('token', data.token);
          
          await fetchUser(data.user, data.token);
          return { success: true, message: 'Registration successful' };
        } catch (error) {
          console.error('Error registering:', error.message);
          return { success: false, message: error.message || 'An unexpected error occurred' };
        }
      };

    const addToWishList = async (productId) => {
        try {
            const token = localStorage.getItem('token');
            if (!user || !token) {
                console.error('User or token is missing');
                return;
            }

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
            setWishListProducts(data.wishListProducts);
        } catch (error) {
            console.error('Error adding to wishlist:', error);
        }
    };

    const removeFromWishList = async (productId) => {
        try {
            if (!user || !token) {
                console.error('User or token is missing');
                return;
            }

            const response = await fetch(`http://localhost:2999/user/${user.uid}/wishlist/remove`, {
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
            setWishListProducts(data.wishListProducts);
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
