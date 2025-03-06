import { useEffect, useState } from "react";
import UsuarioForm from "./UsuarioForm";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { Bar } from "react-chartjs-2"; // Importa el gráfico de barras de Chart.js
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Registra los componentes de Chart.js que vas a usar (necesario para que Chart.js funcione)
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const UsuarioList = () => {
    const navigate = useNavigate();
    const [usuarios, setUsuarios] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedFile, setSelectedFile] = useState(null);  // Estado para el archivo
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

    // 🔹 Exportar usuarios a Excel
    const exportToExcel = () => {
        const dataToExport = filteredUsuarios.length > 0 ? filteredUsuarios : usuarios;
        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Usuarios");
        XLSX.writeFile(workbook, "usuarios.xlsx");
    };

    // 🔹 Importar usuarios desde Excel
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
    
            console.log("Datos importados:", importedData); // 🔹 Verifica en la consola los datos antes de enviarlos
    
            axios.post("http://localhost:3001/api/usuarios/importar", { usuarios: importedData })
                .then(() => {
                    setUsuarios([...usuarios, ...importedData]);
                    alert("Usuarios importados correctamente");
                })
                .catch(error => console.error("Error en la importación:", error));
        };
        reader.readAsArrayBuffer(selectedFile);
    };
        
        
    // Maneja el cambio de archivo seleccionado
    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };


    // 🔹 Preparar los datos para el gráfico
    const prepareChartData = () => {
        // Se cuenta cuántos usuarios hay por cada sexo
        const sexoCount = usuarios.reduce((acc, usuario) => {
            acc[usuario.sexo] = (acc[usuario.sexo] || 0) + 1;
            return acc;
        }, {});
        return {
            labels: Object.keys(sexoCount), // etiquetas
            datasets: [
                {
                    label: 'Usuarios por Sexo', // Título de la gráfica
                    data: Object.values(sexoCount), // Datos de la gráfica (conteo de usuarios por rol)
                    backgroundColor: 'rgba(234, 243, 243, 0.6)', // Color de fondo de las barras
                    borderColor: 'rgb(242, 241, 241)', // Color del borde de las barras
                    borderWidth: 5,
                }
            ],
        };
    };


    return (
        <div className="fond-usuario">
            <nav className="navbar">
                <div className="navbar-content">
                    <div className="roles-buttons">
                        <button onClick={() => navigate("/credencial")} className="role-button">Regresar</button>
                        <button className="role-button" onClick={() => navigate("/ubiform")}>Ubicaciones</button>
                        <button className="role-button" onClick={() => navigate("/horarioform")}>Horarios</button>
                    </div>
                </div>
            </nav>
            <br /><br />

            <h1 className="titulo-horario">REGISTRAR USUARIO</h1>
            <UsuarioForm />


            <div className="tabla-ubicaciones">
                <label>🔎 Buscar en Usuarios:</label>
                <input
                    type="text"
                    placeholder="Buscar usuario..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="tabla-usuario"
                />
            </div>

            {/* Botones de exportación e importación */}
            <div className="tabla-ubicaciones">
                <button onClick={exportToExcel} className="role-button">📤 Exportar a Excel</button>
                <input
                    type="file"
                    accept=".xlsx"
                    onChange={handleFileChange}
                    className="import-input"
                />
                <button onClick={importFromExcel} className="role-button">📥 Importar desde Excel</button>
            </div>

            <table className="tabla-ubicaciones">
                <thead>
                    <h1 className="titulo-horario">Usuarios</h1>
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
                    {currentUsuarios.length > 0 ? (
                        currentUsuarios.map((usuario) => (
                            <tr key={usuario.id_usuario} className="fila-usuario">
                                <td>{usuario.id_usuario}</td>
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
                        ))
                    ) : (
                        <tr>
                            <td colSpan="9" style={{ textAlign: "center" }}>No se encontraron resultados</td>
                        </tr>
                    )}
                </tbody>
            </table>


            <div className="paginacion" style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px' }}>
                {currentPage > 1 && (
                    <button onClick={prevPage} className="boton-paginacion">⬅️</button>
                )}
                {indexOfLastUsuario < filteredUsuarios.length && (
                    <button onClick={nextPage} className="boton-paginacion">➡️</button>
                )}
            </div>

            
            {/* 🔹 Gráfico de Usuarios por Rol */}
            <div style={{ width: '80%', margin: 'auto', paddingTop: '20px' }}>
                <Bar data={prepareChartData()} options={{ responsive: true }} /> {/* Muestra el gráfico */}
            </div>

            <br /><br /><br />
            <div className="footer-section">
                <p>Aviso de privacidad: Este sitio cumple con las normativas de protección de datos.</p>
            </div>


        </div>
    );
};

export default UsuarioList;
