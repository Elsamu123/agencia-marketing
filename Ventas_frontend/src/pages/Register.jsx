import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { postObject } from '../services/Apis'
import { GestionarSesion } from '../hooks/GestionarSesion';
import { UseAuth } from '../hooks/UseAuth';
export const Register = () => {

  const {login} = GestionarSesion()
  const baseNewUserUrl = "http://127.0.0.1:8000/api/accounts/accounts"


  const { register, handleSubmit, formState: { errors } } = useForm();
 
  const onSubmit = async (data) => {
    const userLogin = {
      'username': data.username, 
      'password': data.password
    }

    console.log(userLogin)

    try{
      const newUserResponse = await postObject(baseNewUserUrl, data) 
      await login(userLogin)

      console.log("Usuario creado y logueado correctamente:", newUserResponse);

    } catch (error){

      if (error.response && error.response.data) {
        alert(error.response.data.detail || "Hubo un error al registrar el usuario.");
      } else {
        alert("Hubo un error. Intenta de nuevo.");
      }
    }  

  };

  

  return (
    <>
    
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f4f4f4' }}>
    
    <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', width: '100%', maxWidth: '400px', boxSizing: 'border-box' }}>
    <form  onSubmit={handleSubmit(onSubmit)}>
    <fieldset>
      <legend style={{display:'flex', justifyContent:'center'}}>Register</legend>
      <div className="mb-3">
        <label htmlFor="Username" className="form-label">Username</label>
        <input 
        {...register('username', { required: 'Username is required' })}
        type="text"
        id="Username" 
        className="form-control" 
        placeholder="Put your username"
        />
        {errors.username && <p>{errors.username.message}</p>}
      </div>
      <div className="mb-3">
        <label htmlFor="Email" className="form-label">Email</label>
        <input 
        {...register('email', { required: 'Email is required' })}
        type="email" 
        id="Email" 
        className="form-control" 
        placeholder="Put your email"
        />
        {errors.email && <p>{errors.email.message}</p>}
      </div>
      <div className="mb-3">
        <label htmlFor="Password" className="form-label">Password</label>
        <input 
        {...register('password', { required: 'Passwor1 is required' })}
        type="password" 
        id="Password" 
        className="form-control" 
        placeholder="Put your password"
        />
        {errors.password && <p>{errors.password.message}</p>}
      </div>
      <div className="mb-3">
        <label htmlFor="Password2" className="form-label">Password</label>
        <input 
        {...register('password2', { required: 'password2 is required' })}
        type="password" 
        id="Password2" 
        className="form-control" 
        placeholder="Confirm your password"
        />
        {errors.password2 && <p>{errors.password2.message}</p>}
      </div>
      
      <button type="submit" className="btn btn-primary">Save</button>
      
    </fieldset>
    </form>
    </div>
  </div>
  </>
  )
}
