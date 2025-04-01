import { AuthContext } from "../Context";
import { searchObject } from "../services/Apis";
import { useContext } from "react";
import { UseAuth } from "../hooks/UseAuth";
export const Search = () => {
  const baseSearchUrl = 'http://127.0.0.1:8000/api/search'
  const {updateSearchQuery, searchQuery } = UseAuth();
  const {setProducts} = useContext(AuthContext)
  
  
  const handleChange = async (e) => {
    const query = e.target.value
    const params = { q: query };
    updateSearchQuery(query); // Actualiza el estado de búsqueda
    try {

      if(query.length >= 1){
              // Pasa el parámetro q en lugar de param
      const filteredObject = await searchObject(baseSearchUrl, params);
      await setProducts(filteredObject.data); // Establece los productos filtrados
      console.log(filteredObject.data)
       // Para ver los productos filtrados en la consola

      }

  } catch (error) {
      console.error("Error al realizar la búsqueda:", error);
      // Puedes mostrar un mensaje de error o capturar el error más detalladamente
  }
  };

  
 
  return (
    <form className="d-flex" role="search">
      <input 
      className="form-control me-2" 
      type="search" 
      placeholder="Search the product" 
      aria-label="Search"
      value={searchQuery}
      onChange={handleChange}
      />
      <button className="btn btn-outline-success" type="submit">Search</button>
    </form>
  )

}