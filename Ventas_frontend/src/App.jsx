import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { ProductDetail } from './pages/ProductDetail'
import { Nabvar } from './components/Nabvar';
import { ShoppingCart } from './pages/ShoppingCart';
import { CartProvider } from './providers/CartProvider';
import { AuthProvider } from './providers/AuthProvider';
import { CreateProduct } from './pages/CreateProduct';
import { UpdateProduct } from './pages/UpdateProduct';
export const App = () => {

  return (
    <>
    <AuthProvider>
      <CartProvider>
    <BrowserRouter>
    <Nabvar/>
    
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="login" element={<Login /> } />
        <Route path="register" element={<Register />} />
        <Route path="ShoppinCart" element={<ShoppingCart /> } />
        <Route path="/producto/:slug" element={<ProductDetail />} />
        <Route path="/Create-Product" element={<CreateProduct />} />
        <Route path="/Update-Product/:slug" element={<UpdateProduct />} />
        
      </Routes>
      
    </BrowserRouter>
    </CartProvider>
    </AuthProvider>
    </>
    
  )
}
