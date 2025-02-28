import { useState, useEffect } from "react";
import { Link, useParams} from "react-router-dom";
import axios from "axios";

const HorarioEdit = () => {
    const { id } = useParams();
    const [horario, setHorario] = useState({
        id_usuario: "",
        id_ubicacion: "",
        hora_entrada: "",
        hora_salida: ""
    });

    useEffect(() => {
        axios.get(`http://localhost:3001/api/horarios/${id}`)
            .then(response => setHorario(response.data))
            .catch(error => console.error(error));
    }, [id]);

    const handleChange = (e) => {   
        setHorario({ ...horario, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        axios.put(`http://localhost:3001/api/horarios/${id}`, horario)
            .then(() => alert("Horario actualizado"))
            .catch(error => console.error(error));
    }

    return (
        <div class="fondo-principal">
  <h1 class="titulo-principal">Editar Horario</h1>
  <form class="formulario-edicion" onSubmit={handleSubmit}>
    <div class="campo-entrada">
      <input
        type="number"
        id="id_usuario"
        name="id_usuario"
        placeholder="id_usuario"
        value={horario.id_usuario}
        onChange={handleChange}
        class="input-texto"
      />
    </div>
    <div class="campo-entrada">
      <input
        type="number"
        id="id_ubicacion"
        name="id_ubicacion"
        placeholder="id_ubicacion"
        value={horario.id_ubicacion}
        onChange={handleChange}
        class="input-texto"
      />
    </div>
    <div class="campo-entrada">
      <input
        type="time"
        id="hora_entrada"
        name="hora_entrada"
        placeholder="hora_entrada"
        value={horario.hora_entrada}
        onChange={handleChange}
        class="input-texto"
      />
    </div>
    <div class="campo-entrada">
      <input
        type="time"
        id="hora_salida"
        name="hora_salida"
        placeholder="hora_salida"
        value={horario.hora_salida}
        onChange={handleChange}
        class="input-texto"
      />
    </div>
    <button type="submit" class="boton-actualizar">Actualizar</button>
  </form>
  <Link to="/horarioform" class="enlace-regresar">Regresar</Link>

  <div className="footer-section">
     <p>Aviso de privacidad: Este sitio cumple con las normativas de protección de datos.</p>
  </div>
</div>
    );
}

export default HorarioEdit;