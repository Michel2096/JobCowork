import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const UbicacionesList = () => {
    const [ubicaciones, setUbicaciones] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get("http://localhost:3001/api/ubicaciones")
            .then(response => setUbicaciones(response.data))
            .catch(error => {
                console.error(error);
                setError("Error al cargar las ubicaciones. Por favor, intenta de nuevo más tarde.");
            });
    }, []);

const handleDelete = async (id) => {
        axios.delete(`http://localhost:3001/api/ubicaciones/${id}`)
        .then(() => setUbicaciones(ubicaciones.filter(ubicacion => ubicacion.id_ubicacion !== id)))
        .catch(error => console.error(error
        ));
    }

    return (
        <div>
            <h1>Ubicaciones</h1>
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Tipo</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {ubicaciones.map(ubicacion => (
                        <tr key={ubicacion.id_ubicacion}>
                            <td>{ubicacion.nombre}</td>
                            <td>{ubicacion.tipo}</td>
                            <td>
                                <Link to={`/ubiedit/${ubicacion.id_ubicacion}`}>Editar</Link>
                                <button onClick={() => handleDelete(ubicacion.id_ubicacion)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}   

export default UbicacionesList;