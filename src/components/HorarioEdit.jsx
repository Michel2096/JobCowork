import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

const HorarioEdit = () => {
    const { id } = useParams();
    const [horario, setHorario] = useState({
        id_usuario: "",
        id_ubicacion: "",
        hora_entrada: "",
        hora_salida: ""
    });

    useEffect(() => {
        axios.get(`http://localhost:3001/api/horarios/${id}`)
            .then(response => setHorario(response.data))
            .catch(error => console.error(error));
    }, [id]);

    const handleChange = (e) => {
        setHorario({ ...horario, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        axios.put(`http://localhost:3001/api/horarios/${id}`, horario)
            .then(() => alert("Horario actualizado"))
            .catch(error => console.error(error));
    }

    return (
        <div className="container mt-4">
            <h1 className="text-center">Editar Horario</h1>
            <form onSubmit={handleSubmit} className="form">
                <div className="mb-3">
                    <input
                        type="number"
                        id="id_usuario"
                        name="id_usuario"
                        placeholder="id_usuario"
                        value={horario.id_usuario}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="number"
                        id="id_ubicacion"
                        name="id_ubicacion"
                        placeholder="id_ubicacion"
                        value={horario.id_ubicacion}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="time"
                        id="hora_entrada"
                        name="hora_entrada"
                        placeholder="hora_entrada"
                        value={horario.hora_entrada}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="time"
                        id="hora_salida"
                        name="hora_salida"
                        placeholder="hora_salida"
                        value={horario.hora_salida}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
                <button type="submit" className="btn btn-primary">Actualizar</button>
            </form>
            <Link to="/horarioform" className="btn btn-secondary mt-3">Regresar</Link>

            <div className="footer-section mt-4">
                <p>Aviso de privacidad: Este sitio cumple con las normativas de protección de datos.</p>
            </div>
        </div>
    );
}

export default HorarioEdit;