import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';

const UsuarioEdit = () => {
    const { id } = useParams();
    const [usuario, setUsuario] = useState({
        nombre: "",
        app: "",
        apm: "",
        correo: "",
        sexo: "",
        rol: "",
        fecha_nacimiento: "",
        huella: "",
        pass: ""
    });

    useEffect(() => {
        axios.get(`http://localhost:3001/api/usuarios/${id}`)
            .then(response => setUsuario(response.data))
            .catch(error => console.error(error));
    }, [id]);

    const handleChange = (e) => {
        setUsuario({ ...usuario, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        axios.put(`http://localhost:3001/api/usuarios/${id}`, usuario)
            .then(() => alert("Usuario actualizado"))
            .catch(error => console.error(error));
    };

    return (
        <div className="container-fluid vh-100 d-flex flex-column bg-light p-0">
            {/* Navbar */}
            <nav className="navbar navbar-dark bg-dark p-3">
                <div className="container-fluid">
                    <h2 className="text-white mb-0">Editar Usuario</h2>
                    <Link to="/userlist" className="btn btn-secondary">Regresar</Link>
                </div>
            </nav>

            {/* Formulario Centrado */}
            <div className="container flex-grow-1 d-flex align-items-center justify-content-center">
                <form onSubmit={handleSubmit} className="card p-4 shadow w-100 max-w-600">
                    <div className="mb-3">
                        <input
                            type="text"
                            name="nombre"
                            placeholder="Nombre"
                            value={usuario.nombre}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="text"
                            name="app"
                            placeholder="Apellido Paterno"
                            value={usuario.app}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="text"
                            name="apm"
                            placeholder="Apellido Materno"
                            value={usuario.apm}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="email"
                            name="correo"
                            placeholder="Correo"
                            value={usuario.correo}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <select
                            name="sexo"
                            value={usuario.sexo}
                            onChange={handleChange}
                            className="form-select"
                            required
                        >
                            <option value="">Selecciona Sexo</option>
                            <option value="Masculino">Masculino</option>
                            <option value="Femenino">Femenino</option>
                            <option value="Otro">Otro</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <select
                            name="rol"
                            value={usuario.rol}
                            onChange={handleChange}
                            className="form-select"
                            required
                        >
                            <option value="">Selecciona Rol</option>
                            <option value="Admin">Admin</option>
                            <option value="Usuario">Usuario</option>
                            <option value="Moderador">Moderador</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <input
                            type="date"
                            name="fecha_nacimiento"
                            value={usuario.fecha_nacimiento}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="password"
                            name="pass"
                            placeholder="Contraseña"
                            value={usuario.pass}
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

export default UsuarioEdit;