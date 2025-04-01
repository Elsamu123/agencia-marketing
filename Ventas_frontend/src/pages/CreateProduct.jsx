import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { UseAuth } from '../hooks/UseAuth';  // Hook para manejar la autenticación
import { ProductForm } from '../forms/ProductForm';  // Formulario del producto
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const CreateProduct = () => {
  const [categorias, setCategorias] = useState([]);  // Estado para almacenar las categorías
  const [loading, setLoading] = useState(false);  // Estado para controlar el estado de carga
  const { register, handleSubmit, formState: { errors }} = useForm();
  const baseUrl = "http://127.0.0.1:8000/api/";  // URL base de la API
  const { token, setToken } = UseAuth();  // Hook de autenticación
  const navigate = useNavigate()
  useEffect(() => {
    if (!token) {
      const storedToken = localStorage.getItem('access_token');
      setToken(storedToken);

      if (!token) {
        console.error('Usuario no autenticado');
        return;
      }
    } else {
      console.log("Usuario autenticado");
    }

    // Función para obtener las categorías
    const fetchCategorias = async () => {
      try {
        const response = await axios.get(`${baseUrl}categorias`);
        setCategorias(response.data);
      } catch (error) {
        console.error("Error al obtener categorías:", error);
      }
    };

    fetchCategorias();
  }, [token, setToken]);

  const onSubmit = async (data) => {
    const formData = new FormData();

    formData.append('nombre', data.nombre);
    formData.append('descripcion', data.descripcion);
    formData.append('precio', data.precio);
    formData.append('marca', data.marca);
    formData.append('modelo', data.modelo);
    formData.append('categoria', data.categoria);  // Categoria seleccionada
    formData.append('stock', data.stock);
    
    // Verificar si hay imagen y agregarla
    if (data.imagen) {
      formData.append('imagen', data.imagen[0]);
    }
    console.log(data)
    try {
      setLoading(true);  // Indicamos que estamos enviando la solicitud
      const response = await axios.post(`${baseUrl}productos/`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      console.log("Producto guardado:", response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error al guardar el producto:", error);
    }
    navigate('/')

  };

  return (
    <div className="container mt-5">
      <ProductForm
        categorias={categorias}
        register={register}
        handleSubmit={handleSubmit}
        errors={errors}
        loading={loading}
        onSubmit={onSubmit}
      />
    </div>
  );
};