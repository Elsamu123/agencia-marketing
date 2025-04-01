import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { UseAuth } from './UseAuth';
export const GestionarProducto = () => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const base_url = "http://127.0.0.1:8000/";
    const {token, setProducts} = UseAuth()

    const postToDelete = async (slug) => {
        setLoading(true);
        setError(null);
    
        try {
    
            // Realiza la solicitud DELETE a la API
            const response = await axios.delete(`${base_url}api/productos/${slug}/`,{
              headers: {
                'Authorization': `Bearer ${token}`, // Enviar el token de autenticación
              }
            });
    
            // Si la solicitud fue exitosa
            console.log('Producto eliminado:', response.data);
            
            // Elimina el producto de la lista global
            setProducts(prevProducts => prevProducts.filter(p => p.slug !== slug));
            
            alert('Producto eliminado con éxito.');
            navigate('/')
            
        } catch (error) {
            setError('Hubo un error al eliminar el producto.');
            console.error('Error al eliminar el producto:', error);
        } finally {
            setLoading(false);
        }
      }
  return {
    postToDelete,
    loading,
    error
  }
}
