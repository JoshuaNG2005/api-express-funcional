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
            // Consulta SQL uniendo tablas para que los datos sean legibles
            const query = `
                SELECT 
                    c.*, m.nombre as nombre_mascota, med.nombre as nombre_medico
                FROM citas c
                LEFT JOIN mascotas m ON c.mascota_id = m.id
                LEFT JOIN medicos med ON c.id_Medicos = med.id_Medicos
            `;
            const [rows] = await db.query(query);
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
            // Usamos los nombres que aparecen en tu captura de la tabla citas
            const { usuario_id, mascota_id, fecha, hora, id_Medicos, motivo } = req.body;

            const query = `
                INSERT INTO citas (usuario_id, mascota_id, fecha, hora, id_Medicos, motivo) 
                VALUES (?, ?, ?, ?, ?, ?)
            `;
            
            const [result] = await db.query(query, [
                usuario_id, 
                mascota_id, 
                fecha, 
                hora, 
                id_Medicos, 
                motivo
            ]);

            res.status(201).json({ success: true, message: 'Cita agendada', id: result.insertId });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
}

module.exports = CitaController;
