import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

const UbicacionesForm = () => {
    const navigate = useNavigate();

    const [ubicacion, setUbicacion] = useState({
        nombre: "",
        tipo: ""
    });

    const handleChange = (e) => {
        setUbicacion({ ...ubicacion, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        axios.post("http://localhost:3001/api/ubicaciones", ubicacion)
        .then(() => alert("Ubicación registrada"))
        .catch(error => console.error(error));
    };

    return (
        <div className="container-fluid vh-100 d-flex flex-column justify-content-center align-items-center bg-light">
            <div className="card shadow p-4 w-100" style={{ maxWidth: "500px" }}>
                <h2 className="text-center mb-4">Registrar Ubicación</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <input
                            type="text"
                            id="nombre"
                            name="nombre"
                            placeholder="Nombre"
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="text"
                            id="tipo"
                            name="tipo"
                            placeholder="Tipo"
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                    </div>
                    <div className="d-grid gap-2">
                        <button type="submit" className="btn btn-primary">Registrar</button>
                        <button type="button" onClick={() => navigate("/credencial")} className="btn btn-secondary">Regresar</button>
                    </div>
                </form>
            </div>
        </div>
    );
}; 

export default UbicacionesForm;
