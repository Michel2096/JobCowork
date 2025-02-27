import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const UsuarioList = () => {
    const [usuarios, setUsuarios] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:3001/api/usuarios")
            .then(response => setUsuarios(response.data)).catch(error => console.error(error));
    }, []);

    const handleDelete = async (id) => {
        axios.delete(`http://localhost:3001/api/usuarios/${id}`)
            .then(() => setUsuarios(usuarios.filter(usuario => usuario.id_usuario !== id))
            ).catch(error => console.error(error));
    }

    return (
        <div>
            <h1>Usuarios</h1>
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Apellido Paterno</th>
                        <th>Apellido Materno</th>
                        <th>Correo</th>
                        <th>Sexo</th>
                        <th>Rol</th>
                        <th>Fecha de Nacimiento</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios.map(usuario => (
                        <tr key={usuario.id_usuario}>
                            <td>{usuario.nombre}</td>
                            <td>{usuario.app}</td>
                            <td>{usuario.apm}</td>
                            <td>{usuario.correo}</td>
                            <td>{usuario.sexo}</td>
                            <td>{usuario.rol}</td>
                            <td>{usuario.fecha_nacimiento}</td>
                            <td>
                                <Link to={`/useredit/${usuario.id_usuario}`}>Editar</Link>
                                <button onClick={() => handleDelete(usuario.id_usuario)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Link to="/credencial">
            <button>Regresar</button>
            </Link>

        </div>
    )
}

export default UsuarioList;