// ProductForm.js
import React from 'react';
import { useEffect } from 'react';
export const ProductForm = ({
  categorias,
  register, 
  handleSubmit, 
  errors,
  loading,
  onSubmit,
  setValue,
  product = null, // Si es nulo, es para crear un producto; si hay, es para editar.
}) => {

  useEffect(() => {
    if (product) {
       setValue("nombre", product.nombre);
       setValue("descripcion", product.descripcion);
       setValue("precio", product.precio);
       setValue("categoria", product.categoria);
       setValue("marca", product.marca);
       setValue("modelo", product.modelo);
       setValue("stock", product.stock);
    }
  }, [product]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-4 shadow-sm rounded"
     style = {{
        backgroundColor: '#f0f8ff', /* Fondo suave para el formulario */
        border: '1px solid #ddd', /* Borde suave */
        width: '100%',
        maxWidth: '600px',
        margin: '0 auto', /* Centrado en la pantalla */
        boxSizing: 'border-box',
      }}
    >
      <h4 className="text-center mb-4">{product ? 'Actualizar Producto' : 'Agregar Producto'}</h4>

      <div className="mb-3">
        <label htmlFor="nombre" className="form-label">Nombre</label>
        <input
          type="text"
          id="nombre"
          className="form-control"
          {...register('nombre', { required: "Este campo es obligatorio" })}
        />
        {errors.nombre && <div className="text-danger">{errors.nombre.message}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="descripcion" className="form-label">Descripción</label>
        <textarea
          id="descripcion"
          className="form-control"
          {...register('descripcion', { required: "Este campo es obligatorio" })}
        />
        {errors.descripcion && <div className="text-danger">{errors.descripcion.message}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="precio" className="form-label">Precio</label>
        <input
          type="number"
          id="precio"
          className="form-control"
          {...register('precio', { required: "Este campo es obligatorio", min: { value: 0, message: "El precio debe ser mayor que 0" } })}
        />
        {errors.precio && <div className="text-danger">{errors.precio.message}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="imagen" className="form-label">Imagen</label>
        <input
          type="file"
          id="imagen"
          className="form-control"
          {...register('imagen', { required: "Este campo es obligatorio" })}
        />
        {errors.imagen && <div className="text-danger">{errors.imagen.message}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="categoria" className="form-label">Categoría</label>
        <select
          id="categoria"
          className="form-control"
          {...register('categoria', { required: "Este campo es obligatorio" })}
        >
          <option value="">Selecciona una categoría</option>
          {categorias.map((categoria) => (
            <option key={categoria.id} value={categoria.id}>{categoria.nombre}</option>
          ))}
        </select>
        {errors.categoria && <div className="text-danger">{errors.categoria.message}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="marca" className="form-label">Marca</label>
        <input
          type="text"
          id="marca"
          className="form-control"
          {...register('marca', { required: "Este campo es obligatorio" })}
        />
        {errors.marca && <div className="text-danger">{errors.marca.message}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="modelo" className="form-label">Modelo</label>
        <input
          type="text"
          id="modelo"
          className="form-control"
          {...register('modelo', { required: "Este campo es obligatorio" })}
        />
        {errors.modelo && <div className="text-danger">{errors.modelo.message}</div>}
      </div>

            {/* Campo para stock con valor por defecto 1 */}
      <div className="mb-3">
        <label htmlFor="stock" className="form-label">Stock</label>
        <input
          type="number"
          id="stock"
          className="form-control"
          defaultValue={1} // Valor por defecto 1
          {...register('stock', { required: "Este campo es obligatorio", min: { value: 0, message: "El stock debe ser mayor o igual a 0" } })}
        />
        {errors.stock && <div className="text-danger">{errors.stock.message}</div>}
      </div>

      <button type="submit" className="btn btn-primary">
        {loading ? 'Guardando...' : 'Guardar Producto'}
      </button>
    </form>
  );
};
