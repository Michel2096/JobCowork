import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

        // Validación de nombre y apellidos (solo letras y espacios)
        if (["nombre", "app", "apm"].includes(name) && /[^a-zA-Z\s]/.test(value)) {
            setErrores(prev => ({ ...prev, [name]: "Solo se permiten letras y espacios" }));
        } else {
            setErrores(prev => ({ ...prev, [name]: "" }));
        }

        // Validación de fecha de nacimiento (mayor de 18 años)
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

    const verificarCorreoUnico = async () => {
        if (!usuario.correo) {
            setErrores(prev => ({ ...prev, correo: "El correo es obligatorio" }));
            return false;
        }

        try {
            const response = await axios.get(`http://localhost:3001/api/usuarios?correo=${usuario.correo}`);
            if (response.data.existe) {
                setErrores(prev => ({ ...prev, correo: "Este correo ya está registrado" }));
                return false;
            }
            setErrores(prev => ({ ...prev, correo: "" }));
            return true;
        } catch (error) {
            console.error("Error verificando el correo:", error);
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (Object.values(errores).some(error => error)) {
            alert("Corrige los errores antes de continuar");
            return;
        }

        const correoUnico = await verificarCorreoUnico();
        if (!correoUnico) return;

        axios.post("http://localhost:3001/api/usuarios", usuario)
            .then(() => {
                alert("Usuario creado");
                navigate("/login"); // Redirigir a /login
            })
            .catch(error => console.error(error));
    };

    return (
        <form onSubmit={handleSubmit} className="formulario-ubicaciones">
            

            <input type="text" name="nombre" placeholder="Nombre" onChange={handleChange} required />
            {errores.nombre && <p style={{ color: "red" }}>{errores.nombre}</p>}

            <input type="text" name="app" placeholder="Apellido Paterno" onChange={handleChange} required />
            {errores.app && <p style={{ color: "red" }}>{errores.app}</p>}

            <input type="text" name="apm" placeholder="Apellido Materno" onChange={handleChange} required />
            {errores.apm && <p style={{ color: "red" }}>{errores.apm}</p>}

            <input type="email" name="correo" placeholder="Correo" onChange={handleChange} required />
            {errores.correo && <p style={{ color: "red" }}>{errores.correo}</p>}

            <input type="password" name="pass" placeholder="Contraseña" onChange={handleChange} required />

            <select className="select" name="sexo" value={usuario.sexo} onChange={handleChange} required>
                <option value="">Selecciona Sexo</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="Otro">Otro</option>
            </select>
            <br />

            <select className="select" name="rol" value={usuario.rol} onChange={handleChange} required>
                <option value="">Selecciona Rol</option>
                <option value="Admin">Admin</option>
                <option value="Usuario">Usuario</option>
                <option value="Moderador">Moderador</option>
            </select>

            <input type="date" name="fecha_nacimiento" value={usuario.fecha_nacimiento} onChange={handleChange} required />
            {errores.fecha_nacimiento && <p style={{ color: "red" }}>{errores.fecha_nacimiento}</p>}

            <button className="login-button" type="submit">Crear usuario</button>
            <button className='login-button-s' onClick={() => navigate("/login")}>Salir</button>
        </form>
    );
};

export default UsuarioForm;
