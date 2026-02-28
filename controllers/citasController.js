/**
 * Controlador de Citas
 * @description Maneja las operaciones para la tabla 'citas' en AWS RDS
 */
const { pool: db } = require('../config/database');

class CitaController {
    /**
     * Obtiene todas las citas registradas
     */
    static async getAll(req, res) {
        try {
            const [rows] = await db.query('SELECT * FROM citas');
            res.status(200).json({ success: true, data: rows });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    /**
     * Crear una nueva cita
     */
    static async create(req, res) {
        try {
            // Fíjate en el nombre: tipo_servicio
            const { 
                usuario_id, id_Medicos, mascota_id, fecha, hora, 
                tipo_servicio, motivo, estado, costo 
            } = req.body;

            const query = `
                INSERT INTO citas (
                    usuario_id, id_Medicos, mascota_id, fecha, hora, 
                    tipo_servicio, motivo, estado, costo
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            
            const [result] = await db.query(query, [
                usuario_id, 
                id_Medicos, 
                mascota_id, 
                fecha, 
                hora, 
                tipo_servicio, 
                motivo, 
                estado || 'pendiente', 
                costo || 0
            ]);

            res.status(201).json({ success: true, message: 'Cita agendada', id: result.insertId });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
}

module.exports = CitaController;
