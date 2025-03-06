import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UbicacionesForm = () => {
    const navigate = useNavigate();

    const [ubicacion, setUbicacion] = useState({
        nombre: "",
        tipo: ""
    });

    const handleChange = (e) => {
        setUbicacion({ ...ubicacion, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        axios.post("http://localhost:3001/api/ubicaciones", ubicacion)
        .then(() => alert("Ubicación registrada"))
        .catch(error => console.error(error));
    };

    return (
        <div className="fond-ubicaciones">
   <h1 className="titulo-ubicaciones">Registrar Ubicación</h1>
  <form onSubmit={handleSubmit} className="formulario-ubicaciones">
    <div className="input-container">
      <input
        type="text"
        id="nombre"
        name="nombre"
        placeholder="Nombre"
        onChange={handleChange}
        className="input-ubicaciones"
      />
    </div>
    <div className="input-container">
      <input
        type="text"
        id="tipo"
        name="tipo"
        placeholder="Tipo"
        onChange={handleChange}
        className="input-ubicaciones"
      />
    </div>
    <button type="submit" className="boton-ubicaciones">
      Registrar
    </button>
  </form>
  <button onClick={() => navigate("/credencial")} className="boton-regresar">
    Regresar
  </button>
  
</div>
    );
}; 

export default UbicacionesForm;



