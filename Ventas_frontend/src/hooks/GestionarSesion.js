import { useState } from 'react';
import { postObject } from '../services/Apis';
import { UseAuth } from './UseAuth';
import { useNavigate } from 'react-router-dom';

export const GestionarSesion = () => {
  const { saveToken, token, removeToken, refreshToken, setUserId } = UseAuth(); // Este hook ahora se puede usar correctamente
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const login = async (data) => {
    setLoading(true);
    const loginUrl = 'http://127.0.0.1:8000/api/accounts/login';
    const nextUrl = new URLSearchParams(window.location.search).get('next') || '/';
    if (nextUrl) {
      data.next = nextUrl;
    }

    try {
      const response = await postObject(loginUrl, data);
      const { access_token, next, message, refresh_token, user_id } = response.data;
      
      localStorage.setItem('user_id', user_id);
      setUserId(user_id)
      // Guardar los tokens
      saveToken(access_token, refresh_token);
      console.log('Sesion iniciada correctamente', response.data);
      alert(message);

      // Si existe la URL 'next', redirige a esa página
      if (next) {
        navigate(next);
      } else {
        navigate('/'); // Redirige a la página de inicio si no hay 'next'
      }

    } catch (error) {
      // Manejo de errores de la respuesta
      if (error.response) {
        console.error('Error al iniciar sesión:', error.response.data);
        setError(error.response.data.error || 'Error en el formulario');
        alert(error.response.data.error || 'Error al iniciar sesión');
      } else {
        console.error('Error:', error.message);
        setError('Hubo un error inesperado.');
        alert('Hubo un error inesperado.');
      }
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};


