import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const HorarioList = () => { 
    const [horarios, setHorarios] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get("http://localhost:3001/api/horarios")
            .then(response => setHorarios(response.data))
            .catch(error => {
                console.error(error);
                setError("Error al cargar los horarios. Por favor, intenta de nuevo más tarde.");
            });
    }, []);

const handleDelete = async (id) => {
        axios.delete(`http://localhost:3001/api/horarios/${id}`)
        .then(() => setHorarios(horarios.filter(horario => horario.id_horarios !== id)))
        .catch(error => console.error(error));
    };

    return (
        <div>
            <h1>Horarios</h1>
            <table>
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
                    {horarios.map(horario => (
                        <tr key={horario.id_horarios}>
                            <td>{horario.id_usuario}</td>
                            <td>{horario.id_ubicacion}</td>
                            <td>{horario.hora_entrada}</td>
                            <td>{horario.hora_salida}</td>
                            <td>
                                <Link to={`/horarioedit/${horario.id_horarios}`}>Editar</Link>
                                <button onClick={() => handleDelete(horario.id_horarios)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default HorarioList;