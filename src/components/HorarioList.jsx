import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Registrar los elementos necesarios de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const HorarioList = () => {
    const navigate = useNavigate();
    const [horarios, setHorarios] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [ubicaciones, setUbicaciones] = useState([]);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const horariosPerPage = 4;

    useEffect(() => {
        axios.get("http://localhost:3001/api/horarios")
            .then(response => setHorarios(response.data))
            .catch(error => {
                console.error(error);
                setError("Error al cargar los horarios. Por favor, intenta de nuevo más tarde.");
            });

        axios.get("http://localhost:3001/api/usuarios")
            .then(response => setUsuarios(response.data))
            .catch(error => console.error("Error al obtener usuarios:", error));

        axios.get("http://localhost:3001/api/ubicaciones")
            .then(response => setUbicaciones(response.data))
            .catch(error => console.error("Error al obtener ubicaciones:", error));
    }, []);

    const getUbicacionNombre = (id) => {
        const ubicacion = ubicaciones.find(ubi => ubi.id_ubicacion === id);
        return ubicacion ? ubicacion.nombre : "Desconocido";
    };

    const handleDelete = async (id) => {
        axios.delete(`http://localhost:3001/api/horarios/${id}`)
            .then(() => setHorarios(horarios.filter(horario => horario.id_horarios !== id)))
            .catch(error => console.error(error));
    };

    const filteredHorarios = horarios.filter(horario =>
        getUbicacionNombre(horario.id_ubicacion).toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastHorario = currentPage * horariosPerPage;
    const indexOfFirstHorario = indexOfLastHorario - horariosPerPage;
    const currentHorarios = filteredHorarios.slice(indexOfFirstHorario, indexOfLastHorario);

    const nextPage = () => {
        if (indexOfLastHorario < filteredHorarios.length) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // Función para preparar datos para la gráfica
    const prepareBarChartData = () => {
        const countByUbicacion = horarios.reduce((acc, horario) => {
            const nombreUbicacion = getUbicacionNombre(horario.id_ubicacion);
            acc[nombreUbicacion] = (acc[nombreUbicacion] || 0) + 1;
            return acc;
        }, {});

        return {
            labels: Object.keys(countByUbicacion),
            datasets: [
                {
                    label: "Cantidad de horarios por ubicación",
                    data: Object.values(countByUbicacion),
                    backgroundColor: "rgba(75, 192, 192, 0.6)",
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 1,
                },
            ],
        };
    };

    return (
        <div className="fond-usuario">
            <nav className="navbar">
                <div className="navbar-content">
                    <div className="roles-buttons">
                        <button onClick={() => navigate("/credencial")} className="role-button">Regresar</button>
                        <button className="role-button" onClick={() => navigate("/userlist")}>Usuarios</button>
                        <button className="role-button" onClick={() => navigate("/ubiform")}>Ubicaciones</button>
                    </div>
                </div>
            </nav>
            <br />

            <h1 className="titulo-ubicaciones">Horarios</h1>
            {error && <p className="error-message">{error}</p>}

            <div>
                <label>🔎 Buscar en Horarios:</label>
                <input
                    type="text"
                    placeholder="Buscar horario..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="tabla-ubicaciones"
                />
            </div>

            <table className="tabla-ubicaciones">
                <thead>
                    <tr>
                        <th>Ubicación</th>
                        <th>Hora de entrada</th>
                        <th>Hora de salida</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {currentHorarios.length > 0 ? (
                        currentHorarios.map((horario) => (
                            <tr key={horario.id_horarios} className="fila-horario">
                                <td>{getUbicacionNombre(horario.id_ubicacion)}</td>
                                <td>{horario.hora_entrada}</td>
                                <td>{horario.hora_salida}</td>
                                <td className="acciones-horario">
                                    <Link to={`/horarioedit/${horario.id_horarios}`} className="enlace-usuario">Editar</Link>
                                    <button onClick={() => handleDelete(horario.id_horarios)} className="boton-usuario">Eliminar</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" style={{ textAlign: "center" }}>No se encontraron resultados</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <div className="paginacion" style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px' }}>
                {currentPage > 1 && (
                    <button onClick={prevPage} className="boton-paginacion">⬅</button>
                )}
                {indexOfLastHorario < filteredHorarios.length && (
                    <button onClick={nextPage} className="boton-paginacion">➡</button>
                )}
            </div><br /><br />

            {/* Gráfico de horarios por ubicación */}
            <div style={{ width: '80%', margin: 'auto', paddingTop: '20px' }}>
                
                <Bar data={prepareBarChartData()} options={{ responsive: true }} />
            </div>

            
        </div>
    );
}

export default HorarioList;
