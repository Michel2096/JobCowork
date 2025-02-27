import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const HorarioForm = () => {
    const navigate = useNavigate();

    const [horario, setHorario] = useState({
        id_usuario: "",
        id_ubicacion: "",
        hora_entrada: "",
        hora_salida: ""
    });

    const handleChange = (e) => {
        setHorario({ ...horario, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        axios.post("http://localhost:3001/api/horarios", horario)
        .then(() => alert("Horario registrado"))
        .catch(error => console.error(error));
    };

    return (
        <div>
            <h1>Registrar Horario</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <input type="number" id="id_usuario" name="id_usuario" placeholder="id_usuario" onChange={handleChange} />
                </div>
                <div>
                    <input type="number" id="id_ubicacion" name="id_ubicacion" placeholder="id_ubicacion" onChange={handleChange} />
                </div>
                <div>
                    <input type="time" id="hora_entrada" name="hora_entrada" placeholder="hora_entrada" onChange={handleChange} />
                </div>
                <div>
                    <input type="time" id="hora_salida" name="hora_salida" placeholder="hora_salida" onChange={handleChange} />
                </div>
                <button type="submit">Registrar</button>
            </form>
            <button onClick={() => navigate("/credencial")}>Regresar</button>
        </div>
    );
}

export default HorarioForm;