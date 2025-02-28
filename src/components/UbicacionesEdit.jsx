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
        <div class="fondo-principal">
  <h1 class="titulo-principal">Editar Ubicación</h1>
  <form class="formulario-edicion" onSubmit={handleSubmit}>
    <div class="campo-entrada">
      <input
        type="text"
        id="nombre"
        name="nombre"
        placeholder="nombre"
        value={ubicacion.nombre}
        onChange={handleChange}
        class="input-texto"
      />
    </div>
    <div class="campo-entrada">
      <input
        type="text"
        id="tipo"
        name="tipo"
        placeholder="tipo"
        value={ubicacion.tipo}
        onChange={handleChange}
        class="input-texto"
      />
    </div>
    <button type="submit" class="boton-actualizar">Actualizar</button>
  </form>
  <Link to="/ubiform" class="enlace-regresar">Regresar</Link>

  <div className="footer-section">
     <p>Aviso de privacidad: Este sitio cumple con las normativas de protección de datos.</p>
  </div>
</div>
    );
}

export default UbicacionesEdit;