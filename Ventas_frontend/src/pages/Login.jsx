import React from 'react'
import { useForm } from 'react-hook-form';
import { GestionarSesion } from '../hooks/GestionarSesion';


  
  
export const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const {login, loading, error} = GestionarSesion()

  const onSubmit = async (data) => {
    // Llamamos a la función `toLogin` que importamos
  
    await login(data); // `data` contiene los campos del formulario
  };

  return (
     <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f4f4f4' }}>
      <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', width: '100%', maxWidth: '400px', boxSizing: 'border-box' }}>
      <form onSubmit={handleSubmit(onSubmit)}>
      <fieldset>
        <legend style={{display:'flex', justifyContent:'center'}}>Login</legend>
        <div className="mb-3">
          <label htmlFor="TextInput" className="form-label">Username</label>
          <input 
          {...register('username', { required: 'Username is required' })}
          type="text" 
          id="TextInput" 
          className="form-control" 
          placeholder="Put your username"/>
        </div>
        <div className="mb-3">
          <label htmlFor="passwordField" className="form-label">Password</label>
          <input 
          {...register('password', { required: 'Password is required' })}
          type="password" 
          id="passwordField" 
          className="form-control" 
          placeholder="Put your password"/>
        </div>
        <div className="mb-3">
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </fieldset>
      </form>
      </div>
    </div>
    
  );
};
