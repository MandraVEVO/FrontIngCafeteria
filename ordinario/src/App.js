import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [datos, setDatos] = useState([]);
  const [nuevoDato, setNuevoDato] = useState({
    telefono: '',
    direccion: '',
    correo: '',
    genero: '',
    nombre: '',
    apellido: '',
    fechaNac: ''
  });
  const [editando, setEditando] = useState(false);
  const [idEditando, setIdEditando] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/api/v1/DatosPersonales')
      .then(response => response.json())
      .then(data => {
        // Ordena los datos por id de menor a mayor
        const datosOrdenados = data.sort((a, b) => a.id - b.id);
        setDatos(datosOrdenados);
      })
      .catch(error => console.error('Error:', error));
  }, []);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoDato({ ...nuevoDato, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editando) {
      fetch(`http://localhost:3000/api/v1/DatosPersonales/${idEditando}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoDato)
      })
        .then(response => response.json())
        .then(data => {
          setDatos(datos.map(dato => (dato.id === idEditando ? data : dato)));
          setEditando(false);
          setIdEditando(null);
          setNuevoDato({
            telefono: '',
            direccion: '',
            correo: '',
            genero: '',
            nombre: '',
            apellido: '',
            fechaNac: ''
          });
        })
        .catch(error => console.error('Error:', error));
    } else {
      fetch('http://localhost:3000/api/v1/DatosPersonales', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoDato)
      })
        .then(response => response.json())
        .then(data => {
          setDatos([...datos, data]);
          setNuevoDato({
            telefono: '',
            direccion: '',
            correo: '',
            genero: '',
            nombre: '',
            apellido: '',
            fechaNac: ''
          });
        })
        .catch(error => console.error('Error:', error));
    }
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:3000/api/v1/DatosPersonales/${id}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          setDatos(datos.filter(dato => dato.id !== id));
        } else {
          console.error('Error al eliminar el dato.');
        }
      })
      .catch(error => console.error('Error:', error));
  };

  const handleEdit = (dato) => {
    setNuevoDato({
      telefono: dato.telefono,
      direccion: dato.direccion,
      correo: dato.correo,
      genero: dato.genero,
      nombre: dato.nombre,
      apellido: dato.apellido,
      fechaNac: dato.fechaNac
    });
    setEditando(true);
    setIdEditando(dato.id);
  };

  return (
    <div className="container mt-5">
      <header className="App-header">
        <h1 className="text-center mb-4">API Endpoints - DatosPersonales</h1>

        {/* Formulario para agregar o actualizar datos */}
        <h2 className="text-center">{editando ? 'Editar dato:' : 'Agregar nuevo dato:'}</h2>
        <form className="mb-4" onSubmit={handleSubmit}>
          <div className="row mb-3">
            <div className="col">
              <label>Teléfono:</label>
              <input type="text" name="telefono" className="form-control" value={nuevoDato.telefono} onChange={handleChange} required />
            </div>
            <div className="col">
              <label>Dirección:</label>
              <input type="text" name="direccion" className="form-control" value={nuevoDato.direccion} onChange={handleChange} required />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col">
              <label>Correo:</label>
              <input type="email" name="correo" className="form-control" value={nuevoDato.correo} onChange={handleChange} required />
            </div>
            <div className="col">
              <label>Género:</label>
              <input type="text" name="genero" className="form-control" value={nuevoDato.genero} onChange={handleChange} required />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col">
              <label>Nombre:</label>
              <input type="text" name="nombre" className="form-control" value={nuevoDato.nombre} onChange={handleChange} required />
            </div>
            <div className="col">
              <label>Apellido:</label>
              <input type="text" name="apellido" className="form-control" value={nuevoDato.apellido} onChange={handleChange} required />
            </div>
          </div>
          <div className="mb-3">
            <label>Fecha de Nacimiento:</label>
            <input type="date" name="fechaNac" className="form-control" value={nuevoDato.fechaNac} onChange={handleChange} required />
          </div>
          <button type="submit" className="btn btn-primary btn-block">
            {editando ? 'Actualizar' : 'Agregar'}
          </button>
        </form>

        {/* Tabla para mostrar los datos */}
        <h2 className="text-center">Datos actuales en la base de datos:</h2>
        <table className="table table-striped table-hover">
          <thead className="thead-dark">
            <tr>
              <th>ID</th>
              <th>Teléfono</th>
              <th>Dirección</th>
              <th>Correo</th>
              <th>Género</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Fecha de Nacimiento</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {datos.length > 0 ? (
              datos.map((dato) => (
                <tr key={dato.id}>
                  <td>{dato.id}</td>
                  <td>{dato.telefono}</td>
                  <td>{dato.direccion}</td>
                  <td>{dato.correo}</td>
                  <td>{dato.genero}</td>
                  <td>{dato.nombre}</td>
                  <td>{dato.apellido}</td>
                  <td>{dato.fechaNac}</td>
                  <td>
                    <button className="btn btn-warning btn-sm mr-2" onClick={() => handleEdit(dato)}>Editar</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(dato.id)}>Eliminar</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9">Cargando datos...</td>
              </tr>
            )}
          </tbody>
        </table>
      </header>
    </div>
  );
}

export default App;
