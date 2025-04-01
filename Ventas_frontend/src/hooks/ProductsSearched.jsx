import { useState } from 'react'
import { searchObject } from '../services/Apis';

export const ProductsSearched = () => {

  const [terminoBusqueda, setTerminoBusqueda] = useState("")
  const [productos, setProductos] = useState([]);
  const baseSearchUrl = 'http://localhost:8000/api/productos/search/'

  const manejarBusqueda = async (e) => {
    
    const valor = e.target.value;
    setTerminoBusqueda(valor);
    const param = {
      params: { q: valor },
    }
    

    if (valor.length >= 2) { // Solo hacer la búsqueda si el término tiene al menos 2 caracteres
      try {
        const response = await searchObject(baseSearchUrl, param)
        setProductos(response.data);
      } catch (error) {
        console.error('Error al obtener los productos:', error);
      }
    } else {
      setProductos([]);
    } 
    return productos
  };
 

  return {
    setTerminoBusqueda,
    terminoBusqueda,
    manejarBusqueda
  }
}
