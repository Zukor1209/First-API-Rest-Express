const mongoose = require('mongoose');

// Definir el esquema de usuario
const UserSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true }
});

// Crear y exportar el modelo
module.exports = mongoose.model('User', UserSchema);