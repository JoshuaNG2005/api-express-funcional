const express = require('express');
const router = express.Router();
const CitaController = require('../controllers/citasController');

// Obtener todas las citas
router.get('/', CitaController.getAll);

// Crear una nueva cita
router.post('/', CitaController.create);

module.exports = router;