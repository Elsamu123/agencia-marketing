import React, { useContext, useState, useEffect, useReducer } from "react";
import { AuthContext, CartContext } from "../Context";
import { postObject, getAllObjects, deleteObject } from "../services/Apis";
import { cartReducer, initialState } from "../reducers/cartReducer";
import { AuthProvider } from "./AuthProvider";
import { UseAuth } from "../hooks/UseAuth";
import axios from "axios";

// Proveedor del carrito

export const CartProvider = ({ children }) => {

  const {token} = UseAuth()
  const [state, dispatch] = useReducer(cartReducer, initialState);
  
  const baseUrl = "http://127.0.0.1:8000/api/carrito"
  //console.log(token)
  
  useEffect(() => {
    const fetchCart = async () => {
     
      
      if (!token) {
          // Si no hay token, el usuario no está autenticado
           console.log("Usuario no autenticado");

           return;  // No hace la solicitud al carrito
      }
  
      try {
        const response = await axios.get(baseUrl, {
          headers: {
            'Authorization': `Bearer ${token}`  // Asegúrate de pasar el token en las cabeceras
          }
          
        });  
        console.log(response.data.productos, 'carrito')

        dispatch({ type: 'SET_ITEMS', payload: response.data.productos });
      } catch (err) {
        
        if (err.response && err.response.data && err.response.data.error){
          console.log(err.response.data.error)
          dispatch({ type: 'SET_ERROR', payload: err.response.data.error });
        }else{
          console.error('error no manejado')
        }
      }
    };

    if (token) {
      fetchCart();
    }
  
  }, [token]);


  const addToCart = async (productoId, cantidad) => {
    if (token) {
      console.log("Estás autenticado");
    } else {
      console.log("¡No estás autenticado!");
      return;
    }

    try {
      dispatch({ type: 'SET_LOADING' });
  
      const response = await axios.post(
        `${baseUrl}/agregar/`,
        { producto_id: productoId, cantidad },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );  

  
      dispatch({
        type: 'ADD_ITEM',
        payload: {
          producto: response.data.producto.producto,
          cantidad,
        },
      });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error.response?.data?.error || 'Error al agregar el producto al carrito',
      });
    }
  };
  
 


  const removeFromCart = async (productoId) => {
    try {
       dispatch({ type: 'SET_LOADING' });
    
        // Realizar la solicitud DELETE al backend para eliminar el producto del carrito
       const response = await axios.post(`${baseUrl}/eliminar/`, { producto_id: productoId }, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
    
        // Si la eliminación es exitosa, despacha la acción REMOVE_ITEM
        if (response.status === 200) {
          dispatch({ type: 'REMOVE_ITEM', payload: productoId });
        }
    
        dispatch({ type: 'SET_LOADING_FINISHED' });
      } catch (error) {
        console.error("Error eliminando el artículo", error);
        dispatch({ type: 'SET_ERROR', payload: "Error eliminando el producto" });
      }
  };

  const clearCart = async () => {

    try {
      const response = await axios.post(`${baseUrl}/vaciar`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,  // Asegúrate de incluir el token de autenticación
        },
      });
      console.log(response.data.message);  // Mostrar mensaje de éxito
    } catch (error) {
      console.error('Error al vaciar el carrito:', error.response?.data?.error || error.message);
    }

    dispatch({ type: 'CLEAR_CART' });

  };


  const realizarCompra = async () => {
    try {
      const response = await axios.post(`${baseUrl}/comprar`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
      dispatch({ type: 'CLEAR_CART' });  // Vaciar el carrito después de la compra
      alert(response.data.message);
    } catch (error) {
      alert("Error al realizar la compra: " + error.message);
    }
  };

  return (
    <CartContext.Provider value={{ state, addToCart, removeFromCart, realizarCompra, clearCart}}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};