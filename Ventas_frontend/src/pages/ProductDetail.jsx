
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../providers/CartProvider';
import './pagesStyles/ProductDetail.css'

export const ProductDetail = () => { // Estado para almacenar los detalles del producto
  const {addToCart} = useCart()
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { slug } = useParams();  // Obtenemos el ID del producto desde la URL
  const base_url = "http://127.0.0.1:8000"
  // Llamada a la API para obtener los detalles del producto
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${base_url}/api/productos/${slug}/`);
        setProduct(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener los detalles del producto:', error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);


  // Si aún se está cargando el producto, mostrar un mensaje de carga
  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  // Si no se encuentra el producto, mostrar un mensaje
  if (!product) {
    return <div className="error">Producto no encontrado</div>;
  }
  const url = product.imagen.length < 37 ? `${base_url}${product.imagen}`: product.imagen

  const handleClick = () => {
    addToCart(product.id, 1)

  }
  return (
    <div className="product-container">
      <div className="product-image">
        <img src={url} alt={product.nombre} />
      </div>

      <div className="product-details">
        <h1>{product.nombre}</h1>
        <p className="product-description">{product.descripcion}</p>
        <p className="product-price">${product.precio}</p>

        <div className="product-info">
          <p><strong>Categoría:</strong> {product.categoria_nombre}</p>
          <p><strong>Marca:</strong> {product.marca}</p>
          <p><strong>Modelo:</strong> {product.modelo}</p>
        </div>

        <div className="actions">
          <button className='buy-button' onClick={handleClick}>Add to card</button>
          <Link className='back-button' to={'/'}> Go to store</Link>
       
        </div>
      </div>
    </div>
  );
  
}
