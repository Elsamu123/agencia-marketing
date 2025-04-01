import { useContext } from "react";
import { AuthContext } from "../Context";


// Hook personalizado para acceder al token y funciones del contexto
export const UseAuth = () => {
    const context = useContext(AuthContext);
  
    if (!context) {
      throw new Error('useAuth must be used within an AuthProvider');
    }
  
    return context;
  };


  
