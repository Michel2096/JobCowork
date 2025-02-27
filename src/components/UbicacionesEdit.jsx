import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

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
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        axios.put(`http://localhost:3001/api/ubicaciones/${id}`, ubicacion)
            .then(() => alert("Ubicación actualizada"))
            .catch(error => console.error(error));
    }

    return (
        <div>
            <h1>Editar Ubicación</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <input type="text" id="nombre" name="nombre" placeholder="nombre" value={ubicacion.nombre} onChange={handleChange} />
                </div>
                <div>
                    <input type="text" id="tipo" name="tipo" placeholder="tipo" value={ubicacion.tipo} onChange={handleChange} />
                </div>
                <button type="submit">Actualizar</button>
            </form>
            <Link to="/ubiform">Regresar</Link>
        </div>
    );
}

export default UbicacionesEdit;