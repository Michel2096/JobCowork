import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const HorarioList = () => {
    const navigate = useNavigate();
    const [horarios, setHorarios] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [ubicaciones, setUbicaciones] = useState([]);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const horariosPerPage = 5;

    useEffect(() => {
        axios.get("http://localhost:3001/api/horarios")
            .then(response => setHorarios(response.data))
            .catch(error => {
                console.error(error);
                setError("Error al cargar los horarios. Por favor, intenta de nuevo más tarde.");
            });

        axios.get("http://localhost:3001/api/usuarios")
            .then(response => setUsuarios(response.data))
            .catch(error => console.error("Error al obtener usuarios:", error));

        axios.get("http://localhost:3001/api/ubicaciones")
            .then(response => setUbicaciones(response.data))
            .catch(error => console.error("Error al obtener ubicaciones:", error));
    }, []);

    const getUsuarioNombre = (id) => {
        const usuario = usuarios.find(user => user.id_usuario === id);
        return usuario ? usuario.nombre : "Desconocido";
    };

    const getUbicacionNombre = (id) => {
        const ubicacion = ubicaciones.find(ubi => ubi.id_ubicacion === id);
        return ubicacion ? ubicacion.nombre : "Desconocido";
    };

    const handleDelete = async (id) => {
        axios.delete(`http://localhost:3001/api/horarios/${id}`)
            .then(() => setHorarios(horarios.filter(horario => horario.id_horarios !== id)))
            .catch(error => console.error(error));
    };

    const indexOfLastHorario = currentPage * horariosPerPage;
    const indexOfFirstHorario = indexOfLastHorario - horariosPerPage;
    const currentHorarios = horarios.slice(indexOfFirstHorario, indexOfLastHorario);

    const nextPage = () => {
        if (indexOfLastHorario < horarios.length) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div className="fond-horario">
            <nav className="navbar">
                <div className="navbar-content">
                    <div className="roles-buttons">
                    <button onClick={() => navigate("/credencial")} className="role-button">Regresar</button>

                        <button className="role-button" onClick={() => navigate("/userlist")}>Usuarios</button>
                        <button className="role-button" onClick={() => navigate("/ubiform")}>Ubicaciones</button>
                    </div>

                </div>
            </nav>
            <br />
            <br />
            <h1 className="titulo-horario">Horarios</h1>
            {error && <p className="error-message">{error}</p>}
            <table className="tabla-horario">
                <thead>
                    <tr>
                        <th>Usuario</th>
                        <th>Ubicación</th>
                        <th>Hora de entrada</th>
                        <th>Hora de salida</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {currentHorarios.map((horario) => (
                        <tr key={horario.id_horarios} className="fila-horario">
                            <td>{getUsuarioNombre(horario.id_usuario)}</td>
                            <td>{getUbicacionNombre(horario.id_ubicacion)}</td>
                            <td>{horario.hora_entrada}</td>
                            <td>{horario.hora_salida}</td>
                            <td className="acciones-horario">
                                <Link to={`/horarioedit/${horario.id_horarios}`} className="enlace-horario">Editar</Link>
                                <button onClick={() => handleDelete(horario.id_horarios)} className="boton-horario">Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="paginacion" style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px' }}>
                {currentPage > 1 && (
                    <button onClick={prevPage} className="boton-paginacion">⬅</button>
                )}
                {indexOfLastHorario < horarios.length && (
                    <button onClick={nextPage} className="boton-paginacion">➡</button>
                )}
            </div>
            <div className="footer-section">
                <p>Aviso de privacidad: Este sitio cumple con las normativas de protección de datos.</p>
            </div>
        </div>
    );
}

export default HorarioList;
