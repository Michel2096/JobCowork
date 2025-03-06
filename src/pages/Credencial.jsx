import { useEffect, useState } from "react";
import axios from "axios";
import cowork from '../assets/cowork.jpeg';
import Usuario from '../assets/usuario.jpg';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Security from '../assets/Security.png';
import 'bootstrap/dist/css/bootstrap.min.css';

const Credencial = () => {
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const usuarioAutenticado = localStorage.getItem("usuario");
        if (!usuarioAutenticado) {
            setError("No estás autenticado. Redirigiendo...");
            setTimeout(() => {
                window.location.href = "/login";
            }, 2000);
        } else {
            setUsuario(JSON.parse(usuarioAutenticado));
        }
    }, []);

    if (error) {
        return <p>{error}</p>;
    }

    if (!usuario) {
        return <p>Cargando...</p>;
    }

    return (
        <div className="container-fluid d-flex flex-column vh-100 p-0">
            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark p-3">
                <div className="container-fluid">
                    <div className="d-flex align-items-center">
                        <img src={Usuario} alt="Usuario" className="rounded-circle me-3" style={{ width: '50px', height: '50px' }} />
                        {usuario.nombre && <h2 className="text-white mb-0">{usuario.nombre} {usuario.app} {usuario.apm}</h2>}
                    </div>
                    <div className="d-flex">
                        <button className="btn btn-primary me-2" onClick={() => navigate("/userlist")}>Usuarios</button>
                        <button className="btn btn-primary me-2" onClick={() => navigate("/ubiform")}>Ubicaciones</button>
                        <button className="btn btn-primary me-2" onClick={() => navigate("/horarioform")}>Horarios</button>
                        <button className="btn btn-danger" onClick={() => navigate("/login")}>Salir</button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="container-fluid flex-grow-1 d-flex align-items-center justify-content-center">
                <div className="row w-100">
                    {/* Left Section */}
                    <div className="col-md-4">
                        <div className="card h-100">
                            <div className="card-body">
                                <h2 className="card-title">¡Bienvenido!</h2>
                                <p className="card-text">Aquí encontrarás herramientas útiles para tu seguridad.</p>
                            </div>
                        </div>
                    </div>

                    {/* Center Section */}
                    <div className="col-md-4">
                        <div className="card h-100">
                            <div className="card-body">
                                <h2 className="card-title">AVISO</h2>
                                <p className="card-text">La seguridad es una prioridad. Asegúrate de seguir las mejores prácticas para protegerte.</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="col-md-4">
                        <div className="card h-100">
                            <div className="card-body text-center">
                                <img src={Security} alt="Imagen de seguridad" className="img-fluid" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-dark text-white text-center p-3">
                <p className="mb-0">Aviso de privacidad: Este sitio cumple con las normativas de protección de datos.</p>
            </footer>
        </div>
    );
};

export default Credencial;