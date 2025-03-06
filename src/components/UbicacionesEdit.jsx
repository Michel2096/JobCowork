import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const UbicacionesEdit = () => {
    const { id } = useParams();
    const [ubicacion, setUbicacion] = useState({
        nombre: "",
        tipo: ""
    });

    useEffect(() => {
        axios.get(`http://localhost:3001/api/ubicaciones/${id}`)
            .then(response => setUbicacion(response.data))
            .catch(error => console.error(error));
    }, [id]);

    const handleChange = (e) => {
        setUbicacion({ ...ubicacion, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        axios.put(`http://localhost:3001/api/ubicaciones/${id}`, ubicacion)
            .then(() => {
                alert("Ubicación actualizada");
                navigate("/ubicacioneslist"); // Redirigir a la lista de ubicaciones
            })
            .catch(error => console.error(error));
    };

    return (
        <div className="container-fluid vh-100 d-flex flex-column bg-light p-0">
            {/* Navbar */}
            <nav className="navbar navbar-dark bg-dark p-3">
                <div className="container-fluid">
                    <h2 className="text-white mb-0">Editar Ubicación</h2>
                    <Link to="/ubicacioneslist" className="btn btn-secondary">Regresar</Link>
                </div>
            </nav>

            {/* Formulario Centrado */}
            <div className="container flex-grow-1 d-flex align-items-center justify-content-center">
                <form onSubmit={handleSubmit} className="card p-4 shadow w-100 max-w-500">
                    <div className="mb-3">
                        <input
                            type="text"
                            id="nombre"
                            name="nombre"
                            placeholder="Nombre"
                            value={ubicacion.nombre}
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
                            value={ubicacion.tipo}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                    </div>
                    <div className="d-grid gap-2">
                        <button type="submit" className="btn btn-primary">Actualizar</button>
                    </div>
                </form>
            </div>

            {/* Footer */}
            <footer className="bg-dark text-white text-center p-3">
                <p className="mb-0">Aviso de privacidad: Este sitio cumple con las normativas de protección de datos.</p>
            </footer>
        </div>
    );
};

export default UbicacionesEdit;