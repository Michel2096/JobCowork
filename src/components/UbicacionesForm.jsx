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
        axios.post("https://api.mbpindustries.xdn.com.mx/ubicacion/", ubicacion)
            .then(() => alert("Ubicación registrada"))
            .catch(error => console.error(error));
    };

    return (
        <div className="main-container">
            <nav className="navbar navbar-dark bg-dark p-3">
                <div className="container-fluid">
                    <h2 className="text-white mb-0">Registrar Ubicación</h2>
                    <button onClick={() => navigate("/credencial")} className="btn btn-secondary">Regresar</button>
                </div>
            </nav>

            <div className="content-container d-flex align-items-center justify-content-center">
                <form onSubmit={handleSubmit} className="card shadow p-4 w-100" style={{ maxWidth: "500px" }}>
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
                    </div>
                </form>
            </div>

            <footer className="bg-dark text-white text-center p-3">
                <p className="mb-0">Aviso de privacidad: Este sitio cumple con las normativas de protección de datos.</p>
            </footer>
        </div>
    );
};

export default UbicacionesForm;