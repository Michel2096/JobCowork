import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

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
        <div className="container mt-4">
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">
                    <div className="navbar-nav">
                        <button onClick={() => navigate("/credencial")} className="btn btn-primary me-2">Regresar</button>
                        <button className="btn btn-secondary me-2" onClick={() => navigate("/userlist")}>Usuarios</button>
                        <button className="btn btn-secondary" onClick={() => navigate("/ubiform")}>Ubicaciones</button>
                    </div>
                </div>
            </nav>
            <br />

            <h1 className="text-center">Horarios</h1>
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="mb-3">
                <label className="form-label">🔎 Buscar en Horarios:</label>
                <input
                    type="text"
                    placeholder="Buscar horario..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-control"
                />
            </div>

            <table className="table table-striped">
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
                            <tr key={horario.id_horarios}>
                                <td>{getUbicacionNombre(horario.id_ubicacion)}</td>
                                <td>{horario.hora_entrada}</td>
                                <td>{horario.hora_salida}</td>
                                <td>
                                    <Link to={`/horarioedit/${horario.id_horarios}`} className="btn btn-warning btn-sm me-2">Editar</Link>
                                    <button onClick={() => handleDelete(horario.id_horarios)} className="btn btn-danger btn-sm">Eliminar</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="text-center">No se encontraron resultados</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <div className="d-flex justify-content-end">
                {currentPage > 1 && (
                    <button onClick={prevPage} className="btn btn-primary me-2">⬅</button>
                )}
                {indexOfLastHorario < filteredHorarios.length && (
                    <button onClick={nextPage} className="btn btn-primary">➡</button>
                )}
            </div><br /><br />

            <div className="chart-container" style={{ width: '80%', margin: 'auto', paddingTop: '20px' }}>
                <Bar data={prepareBarChartData()} options={{ responsive: true }} />
            </div>
        </div>
    );
}

export default HorarioList;