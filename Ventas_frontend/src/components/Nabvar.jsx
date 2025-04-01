import { Link } from "react-router-dom"
import { useLocation } from "react-router-dom"
import { LogoCarrito } from "./LogoCarrito";
import { Search } from "./Search";
import { useContext } from "react";
import { AuthContext } from "../Context";

export const Nabvar = () => {

  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const {logoutAndRemoveToken} = useContext(AuthContext)

  const logout = () =>{
    logoutAndRemoveToken()
  }

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
    <div className="container-fluid">
      <Link className="navbar-brand" to="#">Navbar</Link>
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNavAltMarkup" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div className="navbar-nav">
          <Link className="nav-link active" aria-current="page" to="/">Home</Link>
          <Link className="nav-link" to={'register'}>Registrate</Link>
          <Link className="nav-link" to={'login'}>Login</Link>
          <Link className="nav-link" to={'/'}></Link>
          <Link className="nav-link" to={'/Create-Product'}>Create Product</Link>
          <Link className="nav-link" to={'/'}><button className="nav-link" onClick={logout}>Logout</button></Link>
        </div>
        {isHomePage && <Search/>}
        <div style={{display: "flex", justifyContent: "flex-end"}}>
         {isHomePage &&  
           <Link className="nav-link" to={'ShoppinCart'}><LogoCarrito/></Link> 
           
        }
        </div>
        
      </div>
    </div>
  </nav>
  )
}
