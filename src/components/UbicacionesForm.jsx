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
        <div>
            <h1>Registrar Ubicación</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <input type="text" id="nombre" name="nombre" placeholder="nombre" onChange={handleChange} />
                </div>
                <div>
                    <input type="text" id="tipo" name="tipo" placeholder="tipo" onChange={handleChange} />
                </div>
                <button type="submit">Registrar</button>
            </form>
            <button onClick={() => navigate("/credencial")}>Regresar</button>
        </div>
    );
}; 

export default UbicacionesForm;



