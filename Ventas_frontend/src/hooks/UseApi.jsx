import  { useEffect, useState } from 'react'
import { getAllObjects, getObject, updateObject } from '../services/Apis'


export const UseApi = (urlApi) => {

  const [allObject, setObject] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const fetchAllObject = async (urlApi) => {

    const response = await getAllObjects(urlApi)

    try {
      console.log('Datos obtenidos:', response.data);
      setObject(response.data)
      setLoading(false)

    }catch(error) {
      setError(error)
      }
  }  

  useEffect(() => {
    fetchAllObject(urlApi)
  },[])

  return {
    allObject,
    loading,
    error
  }
}
