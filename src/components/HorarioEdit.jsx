import { useState, useEffect } from "react";
import { Link, useParams} from "react-router-dom";
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
        <div>
            <h1>Editar Horario</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <input type="number" id="id_usuario" name="id_usuario" placeholder="id_usuario" value={horario.id_usuario} onChange={handleChange} />
                </div>
                <div>
                    <input type="number" id="id_ubicacion" name="id_ubicacion" placeholder="id_ubicacion" value={horario.id_ubicacion} onChange={handleChange} />
                </div>
                <div>
                    <input type="time" id="hora_entrada" name="hora_entrada" placeholder="hora_entrada" value={horario.hora_entrada} onChange={handleChange} />
                </div>
                <div>
                    <input type="time" id="hora_salida" name="hora_salida" placeholder="hora_salida" value={horario.hora_salida} onChange={handleChange} />
                </div>
                <button type="submit">Actualizar</button>
            </form>
            <Link to="/horarioform">Regresar</Link>
        </div>
    );
}

export default HorarioEdit;