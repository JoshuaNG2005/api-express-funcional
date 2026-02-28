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
                    c.id, c.fecha, c.hora, c.motivo, c.estado,
                    u.nombre AS nombre_usuario,
                    m.nombre AS nombre_mascota,
                    med.nombre AS nombre_medico
                FROM citas c
                JOIN usuarios u ON c.id_usuario = u.id
                JOIN mascotas m ON c.id_mascota = m.id
                JOIN medicos med ON c.id_medico = med.id_Medicos 
            `;
            const [rows] = await db.query(query);
            
            res.status(200).json({
                success: true,
                message: 'Citas obtenidas correctamente',
                data: rows
            });
        } catch (error) {
            console.error('Error en CitaController.getAll:', error.message);
            res.status(500).json({ 
                success: false, 
                message: 'Error al obtener las citas',
                error: error.message 
            });
        }
    }

    /**
     * Crear una nueva cita
     */
    static async create(req, res) {
        try {
            // Ajustamos los nombres a como los tienes en la DB (usuario_id)
            const { usuario_id, mascota_id, medico_id, fecha, hora, motivo } = req.body;

            const query = `
                INSERT INTO citas (usuario_id, mascota_id, medico_id, fecha, hora, motivo) 
                VALUES (?, ?, ?, ?, ?, ?)
            `;
            
            const [result] = await db.query(query, [
                usuario_id, 
                mascota_id, 
                medico_id, 
                fecha, 
                hora, 
                motivo
            ]);

            res.status(201).json({
                success: true,
                message: 'Cita creada correctamente',
                id: result.insertId
            });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
}

module.exports = CitaController;
