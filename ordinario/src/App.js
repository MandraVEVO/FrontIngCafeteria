import React, { useState, useEffect } from 'react';

function App() {
  const [datos, setDatos] = useState([]); // Para almacenar los datos de la base de datos
  const [nuevoDato, setNuevoDato] = useState({
    telefono: '',
    direccion: '',
    correo: '',
    genero: '',
    nombre: '',
    apellido: '',
    fechaNac: ''
  });

  // Obtener todos los datos (GET)
  useEffect(() => {
    fetch('http://localhost:3000/api/v1/DatosPersonales')
      .then(response => response.json())
      .then(data => setDatos(data))
      .catch(error => console.error('Error:', error));
  }, []);

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoDato({ ...nuevoDato, [name]: value });
  };

  // Manejar el envío del formulario (POST)
  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('http://localhost:3000/api/v1/DatosPersonales', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(nuevoDato)
    })
      .then(response => response.json())
      .then(data => {
        // Agregar el nuevo dato a la tabla sin necesidad de hacer otro GET
        setDatos([...datos, data]);
        // Resetear el formulario
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
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>API Endpoints - DatosPersonales</h1>

        {/* Formulario para agregar datos */}
        <h2>Agregar nuevo dato:</h2>
        <form onSubmit={handleSubmit}>
          <label>Teléfono: <input type="text" name="telefono" value={nuevoDato.telefono} onChange={handleChange} required /></label><br />
          <label>Dirección: <input type="text" name="direccion" value={nuevoDato.direccion} onChange={handleChange} required /></label><br />
          <label>Correo: <input type="email" name="correo" value={nuevoDato.correo} onChange={handleChange} required /></label><br />
          <label>Género: <input type="text" name="genero" value={nuevoDato.genero} onChange={handleChange} required /></label><br />
          <label>Nombre: <input type="text" name="nombre" value={nuevoDato.nombre} onChange={handleChange} required /></label><br />
          <label>Apellido: <input type="text" name="apellido" value={nuevoDato.apellido} onChange={handleChange} required /></label><br />
          <label>Fecha de Nacimiento: <input type="date" name="fechaNac" value={nuevoDato.fechaNac} onChange={handleChange} required /></label><br />
          <button type="submit">Agregar</button>
        </form>

        {/* Tabla para mostrar los datos */}
        <h2>Datos actuales en la base de datos:</h2>
        <table border="1">
          <thead>
            <tr>
              <th>ID</th>
              <th>Teléfono</th>
              <th>Dirección</th>
              <th>Correo</th>
              <th>Género</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Fecha de Nacimiento</th>
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
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">Cargando datos...</td>
              </tr>
            )}
          </tbody>
        </table>
      </header>
    </div>
  );
}

export default App;
