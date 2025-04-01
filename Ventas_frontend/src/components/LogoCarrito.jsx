import React, { useState } from 'react';
import { Badge, IconButton } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useCart } from '../providers/CartProvider';
export const LogoCarrito = () => {
    const {state} = useCart()
    const cartCount = state.items.length 


    const addToCart = () => {
        setCartCount(cartCount + 1); // Incrementamos el contador de productos
    };

  return (
    <> 
      <IconButton aria-label="cart">
        <Badge
          badgeContent={cartCount}  // Número de productos en el carrito
          color="secondary"  // Color del badge
          invisible={cartCount === 0}  // No mostrar el badge si no hay productos
        >
          <ShoppingCartIcon fontSize="large" />
        </Badge>
      </IconButton>
    </>
  )
}
