/**
 * Controlador de Mascotas
 * @description Maneja las operaciones para la tabla 'mascotas' en AWS RDS
 */
const { pool: db } = require('../config/database');

class MascotaController {

    /**
     * Obtiene todas las mascotas
     * CORRECCIÓN: Nombre de tabla 'mascotas'
     */
    static async getAll(req, res) {
        try {
            // Seleccionamos las columnas reales de tu tabla
            const [rows] = await db.query('SELECT id, nombre, especie, raza, id_usuario FROM mascotas');
            
            res.status(200).json({
                success: true,
                message: 'Mascotas obtenidas correctamente',
                data: rows
            });
        } catch (error) {
            console.error('Error en MascotaController.getAll:', error.message);
            res.status(500).json({ 
                success: false, 
                message: 'Error interno del servidor',
                error: error.message 
            });
        }
    }

    /**
     * Registra una nueva mascota
     */
    static async create(req, res) {
        try {
            const { nombre, tipo, raza, edad, peso, usuario_id } = req.body;

            // Validación básica
            if (!nombre || !tipo || !usuario_id) {
                return res.status(400).json({
                    success: false,
                    message: 'Faltan campos obligatorios (nombre, tipo, usuario_id)'
                });
            }

            const query = 'INSERT INTO mascotas (nombre, tipo, raza, edad, peso, usuario_id) VALUES (?, ?, ?, ?, ?, ?)';
            const [result] = await db.query(query, [nombre, tipo, raza || null, edad || null, peso || null, usuario_id]);

            res.status(201).json({
                success: true,
                message: 'Mascota registrada correctamente',
                id: result.insertId
            });
        } catch (error) {
            console.error('Error en MascotaController.create:', error.message);
            res.status(500).json({ 
                success: false, 
                message: 'Error al registrar mascota',
                error: error.message 
            });
        }
    }
}

module.exports = MascotaController;