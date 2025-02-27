import { useEffect, useState } from "react";
import axios from "axios";
import cowork from '../assets/cowork.jpeg';
import Usuario from '../assets/usuario.jpg';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Security from '../assets/Security.png';




const Credencial = () => {
    const navigate = useNavigate();


    const [usuario, setUsuario] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const usuarioAutenticado = localStorage.getItem("usuario");
        if (!usuarioAutenticado) {
            setError("No estás autenticado. Redirigiendo...");
            // Redirigir al login si no hay usuario autenticado
            setTimeout(() => {
                window.location.href = "/login";
            }, 2000);
        } else {
            setUsuario(JSON.parse(usuarioAutenticado)); // Obtener datos del usuario desde localStorage
        }
    }, []);

    if (error) {
        return <p>{error}</p>;
    }

    if (!usuario) {
        return <p>Cargando...</p>;
    }

    return (
        <div className="credencial">
  <nav className="navbar">
    <div className="navbar-content">
      <div className="navbar-left"> {/* Cambiado de left-section a navbar-left */}
        <img className="user-img" src={Usuario} alt="Usuario" />
        {usuario.nombre ? (
          <h2>{usuario.nombre} {usuario.app} {usuario.apm}</h2>
        ) : null}
      </div>
      <div className="roles-buttons">
      <button className="role-button" onClick={() => navigate("/userlist")}>Usuarios</button>
      <button className="role-button" onClick={() => navigate("/ubiform")}>Ubicaciones</button>
      <button className="role-button" onClick={() => navigate("/horarioform")}>Horarios</button>
      </div>
      <button className="logout-button" onClick={() => navigate("/login")}>Salir</button>
    </div>
  </nav>

  {/* Sección dividida en 4 partes */}
  <div className="main-content">
    {/* Primera sección (izquierda) */}
    <div className="left-section">
      <h2>¡Bienvenido!</h2>
      <p>Aquí encontrarás herramientas útiles para tu seguridad.</p>
    </div>

    {/* Segunda sección (centro) */}
    <div className="center-section">
      <h2>AVISO</h2>
      <p>La seguridad es una prioridad. Asegúrate de seguir las mejores prácticas para protegerte</p>
    </div>

    {/* Tercera sección (derecha) */}
    <div className="right-section">
      <img src={Security} alt="Imagen de seguridad" />
    </div>
  </div>

  {/* Cuarta sección (abajo) */}
  <div className="footer-section">
    <p>Aviso de privacidad: Este sitio cumple con las normativas de protección de datos.</p>
  </div>
</div>

    );


};

export default Credencial;