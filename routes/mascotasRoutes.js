const express = require('express');
const router = express.Router();
// IMPORTANTE: El nombre del require debe coincidir EXACTAMENTE con el nombre del archivo en controllers/
const MascotaController = require('../controllers/mascotasController'); 

// Ruta para obtener todas las mascotas
router.get('/', MascotaController.getAll);

// Ruta para crear (POST)
router.post('/', MascotaController.create);

module.exports = router;