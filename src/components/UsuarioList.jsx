import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const UsuarioList = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const usuariosPerPage = 5;

    useEffect(() => {
        axios.get("http://localhost:3001/api/usuarios")
            .then(response => setUsuarios(response.data))
            .catch(error => console.error(error));
    }, []);

    const handleDelete = async (id) => {
        axios.delete(`http://localhost:3001/api/usuarios/${id}`)
            .then(() => setUsuarios(usuarios.filter(usuario => usuario.id_usuario !== id)))
            .catch(error => console.error(error));
    };

    const indexOfLastUsuario = currentPage * usuariosPerPage;
    const indexOfFirstUsuario = indexOfLastUsuario - usuariosPerPage;
    const currentUsuarios = usuarios.slice(indexOfFirstUsuario, indexOfLastUsuario);

    const nextPage = () => {
        if (indexOfLastUsuario < usuarios.length) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div className="fond-usuario">
            <h1 className="titulo-usuario">Usuarios</h1>
            <table className="tabla-usuario">
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
                    {currentUsuarios.map((usuario) => (
                        <tr key={usuario.id_usuario} className="fila-usuario">
                            <td>{usuario.nombre}</td>
                            <td>{usuario.app}</td>
                            <td>{usuario.apm}</td>
                            <td>{usuario.correo}</td>
                            <td>{usuario.sexo}</td>
                            <td>{usuario.rol}</td>
                            <td>{usuario.fecha_nacimiento}</td>
                            <td className="acciones-usuario">
                                <Link to={`/useredit/${usuario.id_usuario}`} className="enlace-usuario">Editar</Link>
                                <button onClick={() => handleDelete(usuario.id_usuario)} className="boton-usuario">Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="paginacion" style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px' }}>
                {currentPage > 1 && (
                    <button onClick={prevPage} className="boton-paginacion">
                        ⬅
                    </button>
                )}
                {indexOfLastUsuario < usuarios.length && (
                    <button onClick={nextPage} className="boton-paginacion">
                        ➡
                    </button>
                )}
            </div>
            <Link to="/credencial" className="enlace-usuario">
                <button className="boton-regresar">Regresar</button>
            </Link>
            <div className="footer-section">
                <p>Aviso de privacidad: Este sitio cumple con las normativas de protección de datos.</p>
            </div>
        </div>
    );
};

export default UsuarioList;
