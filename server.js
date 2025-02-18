const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const User = require('./models/User'); // Importamos el modelo

// Configurar variables de entorno
dotenv.config();

// Inicializar Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware para procesar JSON
app.use(express.json());
app.use(cors());

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB conectado'))
    .catch(err => console.error('❌ Error de conexión:', err));

// Rutas CRUD con MongoDB

// 1️⃣ Obtener todos los usuarios (GET)
app.get('/usuarios', async (req, res) => {
    const usuarios = await User.find();
    res.json(usuarios);
});

// 2️⃣ Obtener un usuario por ID (GET)
app.get('/usuarios/:id', async (req, res) => {
    try {
        const usuario = await User.findById(req.params.id);
        if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// 3️⃣ Crear un usuario (POST)
app.post('/usuarios', async (req, res) => {
    try {
        const { nombre, email } = req.body;
        const nuevoUsuario = new User({ nombre, email });
        await nuevoUsuario.save();
        res.status(201).json(nuevoUsuario);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear usuario' });
    }
});

// 4️⃣ Actualizar un usuario (PUT)
app.put('/usuarios/:id', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ error: 'ID inválido' });
        const usuarioActualizado = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!usuarioActualizado) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json(usuarioActualizado);
    } catch (error) {
        console.error('❌ Error en PUT:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

app.delete('/usuarios/:id', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ error: 'ID inválido' });
        const usuarioEliminado = await User.findByIdAndDelete(req.params.id);
        if (!usuarioEliminado) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json({ mensaje: 'Usuario eliminado' });
    } catch (error) {
        console.error('❌ Error en DELETE:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});