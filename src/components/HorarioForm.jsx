import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

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
        axios.get("https://api.mbpindustries.xdn.com.mx/usuarios/")
            .then(response => setUsuarios(response.data))
            .catch(error => console.error("Error al obtener usuarios:", error));

        axios.get("https://api.mbpindustries.xdn.com.mx/ubicacion/")
            .then(response => setUbicaciones(response.data))
            .catch(error => console.error("Error al obtener ubicaciones:", error));
    }, []);

    const handleChange = (e) => {
        setHorario({ ...horario, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        axios.post("https://api.mbpindustries.xdn.com.mx/horarios/", horario)
            .then(() => alert("Horario registrado"))
            .catch(error => console.error(error));
    };

    return (
        <div className="main-container">
            <nav className="navbar navbar-dark bg-dark p-3">
                <div className="container-fluid">
                    <h2 className="text-white mb-0">Registrar Horario</h2>
                    <button onClick={() => navigate("/credencial")} className="btn btn-secondary">Regresar</button>
                </div>
            </nav>

            <div className="content-container d-flex align-items-center justify-content-center">
                <form onSubmit={handleSubmit} className="card shadow p-4 w-100" style={{ maxWidth: "500px" }}>
                    <div className="mb-3">
                        <select name="id_usuario" onChange={handleChange} className="form-select" required>
                            <option value="">Seleccione un usuario</option>
                            {usuarios.map(usuario => (
                                <option key={usuario.id_usuario} value={usuario.id_usuario}>
                                    {usuario.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <select name="id_ubicacion" onChange={handleChange} className="form-select" required>
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
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="time"
                            name="hora_salida"
                            placeholder="Hora de salida"
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                    </div>
                    <div className="d-grid gap-2">
                        <button type="submit" className="btn btn-primary">Registrar</button>
                    </div>
                </form>
            </div>

            <footer className="bg-dark text-white text-center p-3">
                <p className="mb-0">Aviso de privacidad: Este sitio cumple con las normativas de protección de datos.</p>
            </footer>
        </div>
    );
}

export default HorarioForm;