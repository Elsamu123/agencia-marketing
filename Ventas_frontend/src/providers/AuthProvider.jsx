import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../Context';
import { useNavigate } from 'react-router-dom';








const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [userId, setUserId] = useState(null);

  const updateSearchQuery = (query) => {
    setSearchQuery(query);
  };

  // Efecto para leer el token desde localStorage al montar el componente
  useEffect(() => {
    const storedToken = localStorage.getItem('access_token');
   
    if (storedToken) {
      setToken(storedToken);
      
    }

    if (!userId){
      const storedUserId = localStorage.getItem('user_id');
      setUserId(parseInt(storedUserId))
    }
  
  }, [token, userId]);

  // Función para guardar el token en localStorage y actualizar el estado
  const saveToken = (newToken, refresh) => {
    localStorage.setItem('access_token', newToken);  // Guardamos el token de acceso
    setToken(newToken);
    localStorage.setItem('refresh_token', refresh)
    setRefreshToken(refresh)
  };

  // Función para eliminar el token de localStorage y resetear el estado
  const removeToken = () => {
    localStorage.removeItem('access_token');
    setToken(null);
    localStorage.removeItem('refresh_token');
    setRefreshToken(null);
    localStorage.removeItem('user_id');
    setUserId(null)
    
  };

  // Función para hacer logout y eliminar el token
  const logoutAndRemoveToken = async () => {
    console.log(token)
    //const refreshToken = localStorage.getItem('refresh_token');
    try {
      // Obtén el token almacenado en localStorage o desde el estado
       // O desde tu estado si lo almacenas en Redux, etc.
  
        if (!token) {
          console.log('No hay token guardado. El usuario ya está desconectado.');
          return;
        }
    
        // Define la URL del endpoint de logout
        const logoutUrl = 'http://127.0.0.1:8000/api/accounts/logout/';
    
        // Realizar la solicitud POST para cerrar sesión
        const response = await axios.post(logoutUrl, {}, {
          headers: {
            'Authorization': `Bearer ${token}`, // Enviar el token de autenticación
            'x-refresh-token': refreshToken, // Si usas un refresh token
          },
        });
    
        // Mostrar mensaje de éxito
        console.log(response.data.message);
        
        alert('Has cerrado sesión correctamente');
    
        // Eliminar el token de localStorage (o de tu estado global si lo tienes almacenado ahí)
        removeToken() // Eliminar el token de localStorage
    
        // Si estás usando Redux o un estado global, también deberías eliminar el token del estado
    
        
        window.location.href = '/'; 
  
    } catch (error) {
      // Manejo de errores
      if (error.response) {
        console.error('Error al cerrar sesión:', error.response.data);
        alert(error.response.data.error || 'Hubo un error al cerrar la sesión');
      } else {
        console.error('Error:', error.message);
        alert('Hubo un error al intentar cerrar la sesión');
      }
    }
  };

  return (
    <AuthContext.Provider value={{ 
      token, 
      setUserId,
      userId,
      setToken,
      saveToken, 
      logoutAndRemoveToken, 
      updateSearchQuery, 
      searchQuery, 
      setProducts, 
      products,
      removeToken
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider };