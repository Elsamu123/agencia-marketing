
import { UseApi } from "../hooks/UseApi"
import { Card } from "../components/Card"
import { Pagination } from "@mui/material"
import { useContext, useId, useState } from "react"
import { UseAuth } from "../hooks/UseAuth"
import { useEffect } from "react"



export const Home = () => {

  const { products, setProducts, searchQuery} = UseAuth()

  const productoUrl = "http://127.0.0.1:8000/api/productos"
  const comentarioUrl = "http://127.0.0.1:8000/api/comentarios"
  const categoriaUrl = "http://127.0.0.1:8000/api/categorias"

  const {allObject, loading, error} = UseApi(productoUrl)
 
   useEffect(() => {
    console.log('searchQuery:', searchQuery);
    setProducts(allObject)
    
    }, [allObject,searchQuery]);
    
   
  
  return (
    <div style={{display:'flex', flexDirection:'column'}}> 
        { !loading?
        <div className="container" >  
          <div className="row">
            {products.map((product) => (
              <div className="col-md-4 mb-4" key={product.id}>  {/* col-md-4 => 3 columnas por fila en pantallas medianas */}
                <Card key={product.id} product={product}> </Card>
              </div>
            ))}
          </div> 
       <div style={{display: 'flex', justifyContent: 'center'}}>
       <Pagination/>
       </div>
       </div>
         :  <p>Loading</p>
         }
     
           
    </div>
    
    
  )
}
