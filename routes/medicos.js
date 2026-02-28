const express = require('express');
const router = express.Router();
const MedicoController = require('../controllers/medicoController');

// Obtener lista de médicos
router.get('/', MedicoController.getAll);

// Registrar nuevo médico
router.post('/', MedicoController.create);

module.exports = router;
