import React, { useState, useEffect } from 'react'
import { useCart } from '../providers/CartProvider';

export const ShoppingCart = () => {

  const { state, removeFromCart, realizarCompra, clearCart, addToCart} = useCart();  // Obtenemos los productos del carrito y la función para eliminar un producto
  const { items } = state;  // Aquí obtenemos los productos en el carrito

  // Función para manejar el eliminar un producto
  const handleRemove = (productId) => {
    removeFromCart(productId); // Llamamos a la función que elimina el producto del carrito
  };

  const handleIncrease = (productId) => {
    const item = items.find(item => item.producto.id === productId);
    if (item) {
      addToCart(productId, 1); // Llamamos a la función addToCart con la nueva cantidad
    }
  };

  // Función para disminuir la cantidad
  const handleDecrease = (productId) => {
    const item = items.find(item => item.producto.id === productId);
    if (item && item.cantidad > 1) {
      addToCart(productId, -1); // Llamamos a la función restarCantidad con la nueva cantidad
    }
  };

  // Calcular el total del carrito

  const calculateTotal = () => {
    if (!Array.isArray(items) || items.length === 0) {
      return 0;
    }
    return items.reduce((total, item) => total + item.producto.precio * item.cantidad, 0);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Carrito de Compra</h2>
      {items.length === 0 ? (
        <p className="text-center">Tu carrito está vacío.</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Marca</th>
              <th>Precio</th>
              <th>Cantidad</th>
              <th>Total</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              
              <tr key={`${item.producto.id}-${item.producto.nombre}`}>
                <td >{item.producto.nombre}</td>
                <td >{item.producto.categoria_nombre}</td>
                <td >{item.producto.marca}</td>
                <td >${item.producto.precio}</td>
                <td>
                  <div className="d-flex justify-content-center">
                    <button 
                      className="btn btn-sm btn-secondary me-2"
                      onClick={() => handleDecrease(item.producto.id)}
                    >
                      -
                    </button>
                    {item.cantidad}
                    <button 
                      className="btn btn-sm btn-secondary ms-2"
                      onClick={() => handleIncrease(item.producto.id)}
                    >
                      +
                    </button>
                  </div>
                </td>
                <td >${(item.producto.precio * item.cantidad).toFixed(2)}</td>
                <td >
                  <button 
                    className="btn btn-danger"
                    onClick={() => handleRemove(item.producto.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {items.length > 0 && (
        <div className="text-end">
          <h4>Total: ${calculateTotal().toFixed(2)}</h4>
          <button className="btn btn-success">Proceder a la compra</button>
        </div>
      )}
    </div>
  );
}
