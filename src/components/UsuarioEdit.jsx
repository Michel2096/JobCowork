import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

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
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        axios.put(`http://localhost:3001/api/usuarios/${id}`, usuario)
            .then(() => alert("Usuario actualizado"))
            .catch(error => console.error(error));
    }

    return (
        <div>
            <h1>Editar Usuario</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <input type="text" id="nombre" name="nombre" placeholder="nombre" value={usuario.nombre} onChange={handleChange} />
                </div>
                <div>
                    <input type="text" id="app" name="app" placeholder="apellido paterno" value={usuario.app} onChange={handleChange} />
                </div>
                <div>
                    <input type="text" id="apm" name="apm" placeholder="apellido materno" value={usuario.apm} onChange={handleChange} />
                </div>
                <div>
                    <input type="email" id="correo" name="correo" placeholder="correo" value={usuario.correo} onChange={handleChange} />
                </div>
                <div>
                    <input type="text" id="sexo" name="sexo" placeholder="sexo" value={usuario.sexo} onChange={handleChange} />
                </div>
                <div>
                    <input type="text" id="rol" name="rol" placeholder="rol" value={usuario.rol} onChange={handleChange} />
                </div>
                <div>
                    <input type="date" id="fecha_nacimiento" name="fecha_nacimiento" placeholder="fecha de nacimiento" value={usuario.fecha_nacimiento} onChange={handleChange} />
                </div>
                <div>
                    <input type="text" id="huella" name="huella" placeholder="huella" value={usuario.huella} onChange={handleChange} />
                </div>
                <div>
                    <input type="password" id="pass" name="pass" placeholder="contraseña" value={usuario.pass} onChange={handleChange} />
                </div>
                <button type="submit">Actualizar</button>
            </form>

            <Link to="/userlist">
            <button>Regresar</button>
            </Link>
        </div>
    );
}

export default UsuarioEdit;