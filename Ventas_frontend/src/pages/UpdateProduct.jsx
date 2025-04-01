import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { ProductForm } from "../forms/ProductForm"
import { useParams, Link } from 'react-router-dom';
import { UseAuth } from '../hooks/UseAuth';
import { useNavigate } from 'react-router-dom';

export const UpdateProduct = () => {
    const [product, setProduct] = useState(null);
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(false);
    const { slug } = useParams();
    const {token} = UseAuth()
    const navigate = useNavigate()

    
    // Cargar el producto a editar
    useEffect(() => {

      axios.get(`http://127.0.0.1:8000/api/productos/${slug}`)
        .then(response => setProduct(response.data))
        .catch(error => console.error('Error al cargar el producto:', error));
  
      // Cargar las categorías
      axios.get('http://127.0.0.1:8000/api/categorias')
        .then(response => setCategorias(response.data))
        .catch(error => console.error('Error al cargar categorías:', error));
    }, [slug]);
  
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  
    // Función para manejar la actualización del producto
    const onSubmit = async (data) => {
        // Usar FormData para enviar los datos
        const formData = new FormData();
    
        // Se usa FormData.append() para cada valor
        formData.append('nombre', data.nombre);
        formData.append('descripcion', data.descripcion);
        formData.append('precio', data.precio);
        formData.append('marca', data.marca);
        formData.append('modelo', data.modelo);
        formData.append('categoria', data.categoria);
        formData.append('stock', data.stock);
    
        // Verificar si hay imagen y agregarla a FormData
        if (data.imagen && data.imagen[0]) {
            formData.append('imagen', data.imagen[0]);
        }
    
        // Console log para revisar los datos antes de enviarlos
        console.log("Data:", data);  // Muestra el objeto 'data'
        for (let pair of formData.entries()) {
            console.log(pair[0]+ ': ' + pair[1]); // Muestra las claves y valores del FormData
        }
    
        try {
            setLoading(true);
            // Realizar la solicitud PUT para actualizar el producto
            const response = await axios.put(
                `http://127.0.0.1:8000/api/productos/${slug}/`, 
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    }
                }
            );
            
            // Revisar la respuesta del servidor
            console.log("Respuesta del servidor:", response);
    
            if (response.status === 200) {
                setLoading(false);
                alert('Producto actualizado con éxito');
                navigate('/');
            } else {
                alert('Hubo un problema al actualizar el producto');
            }
    
        } catch (error) {
            setLoading(false);
            
            // Manejo de error
            if (error.response) {
                console.error('Error al actualizar producto:', error.response.data);
                alert(`Error: ${error.response.data?.detail || 'Hubo un error al actualizar el producto'}`);
            } else {
                console.error('Error:', error.message);
                alert('Hubo un error al intentar actualizar el producto');
            }
        } finally {
            setLoading(false); // Asegura que se detenga el loading aunque haya error o éxito
        }
    };
  
    return (
      <div>
        {product && (
          <ProductForm
            categorias={categorias}
            register={register}
            handleSubmit={handleSubmit}
            setValue={setValue}
            errors={errors}
            loading={loading}
            onSubmit={onSubmit}
            product={product} // Pasamos el producto a editar
          />
        )}
      </div>
    );
  };