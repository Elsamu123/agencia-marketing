import axios from 'axios'

export const tasksApi = axios.create({
});
  
export const getAllObjects = (baseURL) => tasksApi.get(`${baseURL}/`)
export const getObject = (baseURL, id) => tasksApi.get(`${baseURL}/${id}/`)
export const postObject = (baseURL, object) => tasksApi.post(`${baseURL}/`, object)
export const deleteObject = (baseURL ,id) => tasksApi.delete(`${baseURL}/${id}/`)
export const updateObject = (baseURL ,id, object) => tasksApi.put(`${baseURL}/${id}/`, object)
export const searchObject = (baseURL, params) => tasksApi.get(`${baseURL}/`, {params})
