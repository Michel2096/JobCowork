import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom'; // Añadimos useNavigate
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const UbicacionesEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate(); // Definimos navigate
    const [ubicacion, setUbicacion] = useState({
        nombre: "",
        tipo: ""
    });
    const [error, setError] = useState(""); // Estado para manejar errores

    // useEffect(() => {
    //    const fetchUbicacion = async () => {
    //        try {
    //            const response = await axios.get(`https://api.mbpindustries.xdn.com.mx/ubicacion/${id}`);
    //            console.log("Datos recibidos de la API:", response.data); // Depuración
    //            setUbicacion({
    //                nombre: response.data.nombre || "", // Aseguramos que coincida con la respuesta
    //                tipo: response.data.tipo || ""
    //            });
    //        } catch (error) {
    //            console.error("Error al cargar la ubicación:", error);
    //            setError("No se pudo cargar la ubicación. Verifica el ID o la conexión.");
    //        }
    //    };
    //    fetchUbicacion();
    //}, [id]);

    useEffect(() => {
        axios.get(`https://api.mbpindustries.xdn.com.mx/ubicacion/${id}`)
            .then(response => setUbicacion(response.data))
            .catch(error => console.error(error));
    }, [id]);

    const handleChange = (e) => {
        setUbicacion({ ...ubicacion, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`https://api.mbpindustries.xdn.com.mx/ubicacion/${id}`, ubicacion);
            alert("Ubicación actualizada");
            navigate("/ubicacioneslist"); // Redirigir a la lista de ubicaciones
        } catch (error) {
            console.error("Error al actualizar la ubicación:", error);
            setError("No se pudo actualizar la ubicación. Intenta de nuevo.");
        }
    };

    return (
        <div className="container-fluid vh-100 d-flex flex-column bg-light p-0">
            {/* Navbar */}
            <nav className="navbar navbar-dark bg-dark p-3">
                <div className="container-fluid">
                    <h2 className="text-white mb-0">Editar Ubicación</h2>
                    <Link to="/ubiform" className="btn btn-secondary">Regresar</Link>
                </div>
            </nav>

            {/* Formulario Centrado */}
            <div className="container flex-grow-1 d-flex align-items-center justify-content-center">
                <form onSubmit={handleSubmit} className="card p-4 shadow w-100" style={{ maxWidth: '500px' }}>
                    {error && <p className="text-danger text-center">{error}</p>}
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