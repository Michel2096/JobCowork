import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

const UsuarioForm = () => {
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState({
        nombre: "",
        app: "",
        apm: "",
        correo: "",
        sexo: "",
        rol: "",
        fecha_nacimiento: "",
        huella: "",
        pass: "",
    });

    const [errores, setErrores] = useState({
        nombre: "",
        app: "",
        apm: "",
        correo: "",
        fecha_nacimiento: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (["nombre", "app", "apm"].includes(name) && /[^a-zA-Z\s]/.test(value)) {
            setErrores(prev => ({ ...prev, [name]: "Solo se permiten letras y espacios" }));
        } else {
            setErrores(prev => ({ ...prev, [name]: "" }));
        }

        if (name === "fecha_nacimiento") {
            const fechaNacimiento = new Date(value);
            const hoy = new Date();
            const edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
            const esMenor = edad < 18 || (edad === 18 && hoy < new Date(fechaNacimiento.setFullYear(hoy.getFullYear())));

            if (esMenor) {
                setErrores(prev => ({ ...prev, fecha_nacimiento: "Debes ser mayor de 18 años" }));
            } else {
                setErrores(prev => ({ ...prev, fecha_nacimiento: "" }));
            }
        }

        setUsuario({ ...usuario, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (Object.values(errores).some(error => error)) {
            alert("Corrige los errores antes de continuar");
            return;
        }

        axios.post("http://localhost:3001/api/usuarios", usuario)
            .then(() => {
                alert("Usuario creado");
                navigate("/login");
            })
            .catch(error => console.error(error));
    };

    return (
        <div className="container-fluid vh-100 d-flex flex-column bg-light p-0">
            {/* Navbar */}
            <nav className="navbar navbar-dark bg-dark p-3">
                <div className="container-fluid">
                    <h2 className="text-white mb-0">Crear Usuario</h2>
                    <button onClick={() => navigate("/login")} className="btn btn-secondary">Salir</button>
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
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                        {errores.nombre && <p className="text-danger">{errores.nombre}</p>}
                    </div>
                    <div className="mb-3">
                        <input
                            type="text"
                            name="app"
                            placeholder="Apellido Paterno"
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                        {errores.app && <p className="text-danger">{errores.app}</p>}
                    </div>
                    <div className="mb-3">
                        <input
                            type="text"
                            name="apm"
                            placeholder="Apellido Materno"
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                        {errores.apm && <p className="text-danger">{errores.apm}</p>}
                    </div>
                    <div className="mb-3">
                        <input
                            type="email"
                            name="correo"
                            placeholder="Correo"
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                        {errores.correo && <p className="text-danger">{errores.correo}</p>}
                    </div>
                    <div className="mb-3">
                        <input
                            type="password"
                            name="pass"
                            placeholder="Contraseña"
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
                        {errores.fecha_nacimiento && <p className="text-danger">{errores.fecha_nacimiento}</p>}
                    </div>
                    <div className="d-grid gap-2">
                        <button type="submit" className="btn btn-primary">Crear Usuario</button>
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

export default UsuarioForm;