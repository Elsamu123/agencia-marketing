import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../providers/CartProvider';
import { UseAuth } from '../hooks/UseAuth';


import { GestionarProducto } from '../hooks/GestionarProducto';
export const Card = ({ product }) => {
  const [cantidad, setCantidad] = useState(1);
  const base_url = "http://127.0.0.1:8000/";
  const { addToCart } = useCart(); // Usamos solo la función addToCart del contexto
  const { userId, setUserId, token } = UseAuth()
  // Para determinar si la URL es relativa o absoluta
  const url = product.imagen.length < 37 ? `${base_url}${product.imagen}` : product.imagen;
  const isOwner = userId === product.vendedor

  const {error, loading, postToDelete} = GestionarProducto()

  const productToCard = (productId, cantid) => {
    // Llamar a la acción de agregar el producto al carrito
    addToCart(productId, cantid);
  };

  const deletePost = (slug) => {
    postToDelete(slug)
  }
   

  return (
    <div className="card" style={{ width: '15rem' }}>
      <Link to={`/producto/${product.slug}`} className="navbar-brand">
        <img src={url} className="card-img-top" alt="Imagen" />
        <div className="card-body">
          <h5 className="card-title">{product.nombre}</h5>
          <p className="card-text">{product.descripcion}</p>
        </div>
        <ul className="list-group list-group-flush">
          <li className="list-group-item">{product.categoria_nombre}</li>
          <li className="list-group-item">{product.marca}</li>
          <li className="list-group-item">{product.precio}</li>
        </ul>
      </Link>
      <input
          type="number"
          value={cantidad}
          onChange={(e) => setCantidad(Number(e.target.value))}
          min="1"
          max={10}
        />
      <div className="card-body">
        
        <button onClick={() => productToCard(product.id, cantidad)}>
          Agregar al carrito
        </button>
        {isOwner && (
          <div>
            <Link to={`/Update-Product/${product.slug}/`} className="btn btn-primary">
            Actualizar Producto
           </Link>

          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button onClick={() => deletePost(product.slug)} disabled={loading}>
              {loading ? 'Eliminando...' : 'Eliminar Producto'}
          </button>
          </div>
          
        )}
        <Link to={""} className="card-link">Another link</Link>
      </div>
    </div>
  );
};
