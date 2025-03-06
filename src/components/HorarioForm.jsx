import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const HorarioForm = () => {
    const navigate = useNavigate();
    const [usuarios, setUsuarios] = useState([]);
    const [ubicaciones, setUbicaciones] = useState([]);
    const [horario, setHorario] = useState({
        id_usuario: "",
        id_ubicacion: "",
        hora_entrada: "",
        hora_salida: ""
    });

    useEffect(() => {
        axios.get("http://localhost:3001/api/usuarios")
            .then(response => setUsuarios(response.data))
            .catch(error => console.error("Error al obtener usuarios:", error));

        axios.get("http://localhost:3001/api/ubicaciones")
            .then(response => setUbicaciones(response.data))
            .catch(error => console.error("Error al obtener ubicaciones:", error));
    }, []);

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
        <div className="container mt-4">
            <h1 className="text-center">Registrar Horario</h1>
            <form onSubmit={handleSubmit} className="form">
                <div className="mb-3">
                    <select name="id_usuario" onChange={handleChange} className="form-select">
                        <option value="">Seleccione un usuario</option>
                        {usuarios.map(usuario => (
                            <option key={usuario.id_usuario} value={usuario.id_usuario}>
                                {usuario.nombre}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <select name="id_ubicacion" onChange={handleChange} className="form-select">
                        <option value="">Seleccione una ubicación</option>
                        {ubicaciones.map(ubicacion => (
                            <option key={ubicacion.id_ubicacion} value={ubicacion.id_ubicacion}>
                                {ubicacion.nombre}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <input
                        type="time"
                        name="hora_entrada"
                        placeholder="Hora de entrada"
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="time"
                        name="hora_salida"
                        placeholder="Hora de salida"
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    Registrar
                </button>
            </form>
            <button onClick={() => navigate("/credencial")} className="btn btn-secondary mt-3">
                Regresar
            </button>
        </div>
    );
}

export default HorarioForm;