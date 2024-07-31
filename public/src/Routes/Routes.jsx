import { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Nav from '../Componentes/NavBar/Navbar.jsx';
import ProductDetail from '../Componentes/ProductDetail/ProductDetail.jsx';
import ProductType from '../Componentes/ProductType.jsx';
import Legendarios from '../Componentes/Lengendario.jsx';
import Mythical from '../Componentes/Mythical.jsx';
import Home from '../Pages/Home/Home.jsx';
import Footer from '../Componentes/Footer/Footer.jsx';
import RegisterForm from '../Pages/Auht/RegisterForm.jsx';
import LoginForm from '../Pages/Auht/LoginPages.jsx';
import TypeComponent from '../Pages/TypesPages/TypesPages.jsx';
import ProductForm from '../Pages/ProductForm/ProductForm.jsx';
import TypePages from '../Pages/TypesPages/TypesPages.jsx';
import CarritoPages from '../Pages/CarritoPages/CarritoPages.jsx';
import AboutPage from '../Pages/About.jsx'
import ProfilePage from '../Pages/ProfilePages.jsx'
import AllProducts from '../Pages/AllProducts.jsx'

const ScrollTop=()=>{
    const location = useLocation(); 

    useEffect(()=>{
        window.scrollTo(0, 0);
      },[location.pathname])
      return null
    }

function Rutas() {

    return (
        <>
        <Router>
            <ScrollTop/>
            <Nav />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/pokemon" element={<AllProducts/>} />
                <Route path="/pokemon/legendarios" element={<Legendarios />} />
                <Route path="/pokemon/misticos" element={<Mythical />} />
                <Route path="/pokemon/tipo" element={ <TypeComponent/>} />
                <Route path="/pokemon/tipos" element={<TypePages/>}/>
                <Route path="/pokemon/tipo/:tipo" element={<ProductType />} />
                <Route path="/pokemon/:nombre" element={<ProductDetail />} />
                <Route path="/user/register" element={<RegisterForm role='user'/>} />
                <Route path="/admin/register" element={<RegisterForm role='admin' />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/pokemon/new" element={<ProductForm isEdit={false} />} />
                <Route path="/pokemon/edit/:nombre" element={<ProductForm isEdit={true} />} />
                <Route path='/carrito' element={<CarritoPages/>}/>
                <Route path='/about' element={<AboutPage/>}/>
                <Route path='/myprofile' element={<ProfilePage/>}/>
            </Routes>
            <Footer/>   
        </Router>
        </>
    );
}

export default Rutas;