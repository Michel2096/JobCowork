import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const HorarioList = () => { 
    const [horarios, setHorarios] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [ubicaciones, setUbicaciones] = useState([]);
    const [error, setError] = useState(null);

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

    return (
        <div className="fond-horario">
            <h1 className="titulo-horario">Horarios</h1>
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
                    {horarios.map((horario) => (
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

            <div className="footer-section">
                <p>Aviso de privacidad: Este sitio cumple con las normativas de protección de datos.</p>
            </div>
        </div>
    );
}

export default HorarioList;
