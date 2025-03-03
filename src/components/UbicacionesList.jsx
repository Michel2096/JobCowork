import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const UbicacionesList = () => {
  const navigate = useNavigate();
    const [ubicaciones, setUbicaciones] = useState([]);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const ubicacionesPerPage = 5;

    useEffect(() => {
        axios.get("http://localhost:3001/api/ubicaciones")
            .then(response => setUbicaciones(response.data))
            .catch(error => {
                console.error(error);
                setError("Error al cargar las ubicaciones. Por favor, intenta de nuevo más tarde.");
            });
    }, []);

    const handleDelete = async (id) => {
        axios.delete(`http://localhost:3001/api/ubicaciones/${id}`)
            .then(() => setUbicaciones(ubicaciones.filter(ubicacion => ubicacion.id_ubicacion !== id)))
            .catch(error => console.error(error));
    };

    const indexOfLastUbicacion = currentPage * ubicacionesPerPage;
    const indexOfFirstUbicacion = indexOfLastUbicacion - ubicacionesPerPage;
    const currentUbicaciones = ubicaciones.slice(indexOfFirstUbicacion, indexOfLastUbicacion);

    const nextPage = () => {
        if (indexOfLastUbicacion < ubicaciones.length) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div className="fond-usuario">
            <nav className="navbar">
                <div className="navbar-content">
                    <div className="roles-buttons">
                    <button onClick={() => navigate("/credencial")} className="role-button">Regresar</button>

                        <button className="role-button" onClick={() => navigate("/userlist")}>Usuarios</button>
                        <button className="role-button" onClick={() => navigate("/horarioform")}>Horarios</button>
                    </div>

                </div>
            </nav>
            <h1 className="titulo-usuario">Ubicaciones</h1>
            {error && <p className="error-message">{error}</p>}
            <table className="tabla-ubicaciones">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Tipo</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {currentUbicaciones.map((ubicacion) => (
                        <tr key={ubicacion.id_ubicacion} className="fila-ubicaciones">
                            <td>{ubicacion.nombre}</td>
                            <td>{ubicacion.tipo}</td>
                            <td className="acciones-ubicaciones">
                                <Link to={`/ubiedit/${ubicacion.id_ubicacion}`} className="enlace-ubicaciones">Editar</Link>
                                <button onClick={() => handleDelete(ubicacion.id_ubicacion)} className="boton-ubicaciones">Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="paginacion" style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px' }}>
                {currentPage > 1 && (
                    <button onClick={prevPage} className="boton-paginacion">⬅</button>
                )}
                {indexOfLastUbicacion < ubicaciones.length && (
                    <button onClick={nextPage} className="boton-paginacion">➡</button>
                )}
            </div>
            <div className="footer-section">
                <p>Aviso de privacidad: Este sitio cumple con las normativas de protección de datos.</p>
            </div>
        </div>
    );
};

export default UbicacionesList;
