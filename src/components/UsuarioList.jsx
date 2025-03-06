import { useEffect, useState } from "react";
import UsuarioForm from "./UsuarioForm";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import 'bootstrap/dist/css/bootstrap.min.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const UsuarioList = () => {
    const navigate = useNavigate();
    const [usuarios, setUsuarios] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedFile, setSelectedFile] = useState(null);
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

    const filteredUsuarios = usuarios.filter(usuario =>
        usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        usuario.app.toLowerCase().includes(searchTerm.toLowerCase()) ||
        usuario.apm.toLowerCase().includes(searchTerm.toLowerCase()) ||
        usuario.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        usuario.rol.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastUsuario = currentPage * usuariosPerPage;
    const indexOfFirstUsuario = indexOfLastUsuario - usuariosPerPage;
    const currentUsuarios = filteredUsuarios.slice(indexOfFirstUsuario, indexOfLastUsuario);

    const nextPage = () => {
        if (indexOfLastUsuario < filteredUsuarios.length) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const exportToExcel = () => {
        const dataToExport = filteredUsuarios.length > 0 ? filteredUsuarios : usuarios;
        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Usuarios");
        XLSX.writeFile(workbook, "usuarios.xlsx");
    };

    const importFromExcel = () => {
        if (!selectedFile) {
            alert("Por favor, selecciona un archivo primero.");
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const importedData = XLSX.utils.sheet_to_json(sheet);

            axios.post("http://localhost:3001/api/usuarios/importar", { usuarios: importedData })
                .then(() => {
                    setUsuarios([...usuarios, ...importedData]);
                    alert("Usuarios importados correctamente");
                })
                .catch(error => console.error("Error en la importación:", error));
        };
        reader.readAsArrayBuffer(selectedFile);
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const prepareChartData = () => {
        const sexoCount = usuarios.reduce((acc, usuario) => {
            acc[usuario.sexo] = (acc[usuario.sexo] || 0) + 1;
            return acc;
        }, {});
        return {
            labels: Object.keys(sexoCount),
            datasets: [
                {
                    label: 'Usuarios por Sexo',
                    data: Object.values(sexoCount),
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                }
            ],
        };
    };

    return (
        <div className="container-fluid vh-100 d-flex flex-column bg-light p-0">
            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark p-3">
                <div className="container-fluid">
                    <h2 className="text-white mb-0">Lista de Usuarios</h2>
                    <div>
                        <button onClick={() => navigate("/credencial")} className="btn btn-primary me-2">Regresar</button>
                        <button onClick={() => navigate("/ubiform")} className="btn btn-primary me-2">Ubicaciones</button>
                        <button onClick={() => navigate("/horarioform")} className="btn btn-primary">Horarios</button>
                    </div>
                </div>
            </nav>

            {/* Contenido Principal */}
            <div className="container flex-grow-1 p-4">
                <h1 className="text-center mb-4">REGISTRAR USUARIO</h1>
                <UsuarioForm />

                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Buscar usuario..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="form-control"
                    />
                </div>

                <div className="mb-4 d-flex gap-2">
                    <button onClick={exportToExcel} className="btn btn-success">
                        <i className="bi bi-file-earmark-excel"></i> Exportar a Excel
                    </button>
                    <input
                        type="file"
                        accept=".xlsx"
                        onChange={handleFileChange}
                        className="form-control w-auto"
                    />
                    <button onClick={importFromExcel} className="btn btn-warning">
                        <i className="bi bi-file-earmark-arrow-up"></i> Importar desde Excel
                    </button>
                </div>

                <table className="table table-striped table-bordered table-hover">
                    <thead className="table-dark">
                        <tr>
                            <th>Id</th>
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
                            <tr key={usuario.id_usuario}>
                                <td>{usuario.id_usuario}</td>
                                <td>{usuario.nombre}</td>
                                <td>{usuario.app}</td>
                                <td>{usuario.apm}</td>
                                <td>{usuario.correo}</td>
                                <td>{usuario.sexo}</td>
                                <td>{usuario.rol}</td>
                                <td>{usuario.fecha_nacimiento}</td>
                                <td>
                                    <Link to={`/useredit/${usuario.id_usuario}`} className="btn btn-primary btn-sm me-2">
                                        <i className="bi bi-pencil"></i> Editar
                                    </Link>
                                    <button onClick={() => handleDelete(usuario.id_usuario)} className="btn btn-danger btn-sm">
                                        <i className="bi bi-trash"></i> Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="d-flex justify-content-between mb-4">
                    <button onClick={prevPage} disabled={currentPage === 1} className="btn btn-secondary">
                        <i className="bi bi-arrow-left"></i> Anterior
                    </button>
                    <button onClick={nextPage} disabled={indexOfLastUsuario >= filteredUsuarios.length} className="btn btn-secondary">
                        Siguiente <i className="bi bi-arrow-right"></i>
                    </button>
                </div>

                <div className="mb-4">
                    <Bar data={prepareChartData()} options={{ responsive: true }} />
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-dark text-white text-center p-3">
                <p className="mb-0">Aviso de privacidad: Este sitio cumple con las normativas de protección de datos.</p>
            </footer>
        </div>
    );
};

export default UsuarioList;