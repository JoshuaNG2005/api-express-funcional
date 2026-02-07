/**
 * Controlador de Autenticación
 * @description Maneja las operaciones de registro, login y autenticación
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validationResult } = require('express-validator');

/**
 * Clase que maneja las operaciones de autenticación
 */
class AuthController {
    /**
     * Registra un nuevo usuario
     * @param {Object} req - Objeto de solicitud Express
     * @param {Object} res - Objeto de respuesta Express
     * @returns {Promise<void>}
     */
    static async register(req, res) {
        try {
            // Verificar errores de validación
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Errores de validación',
                    errors: errors.array()
                });
            }

            const { nombre, email, telefono, password } = req.body;

            // Normalizar email
            const normalizedEmail = email.toLowerCase().trim();

            // Verificar si el email ya existe
            const existingUser = await User.findByEmail(normalizedEmail);
            if (existingUser) {
                return res.status(409).json({
                    success: false,
                    message: 'El email ya está registrado'
                });
            }

            // Hashear la contraseña
            const saltRounds = 12;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // Crear el usuario
            const newUser = await User.create({
                nombre,
                email: normalizedEmail,
                telefono,
                password: hashedPassword
            });

            // Generar JWT token
            const token = jwt.sign(
                { 
                    userId: newUser.id, 
                    email: newUser.email 
                },
                process.env.JWT_SECRET || 'default_secret_key',
                { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
            );

            res.status(201).json({
                success: true,
                message: 'Usuario registrado correctamente',
                data: {
                    user: newUser,
                    token,
                    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
                }
            });
        } catch (error) {
            console.error('Error en register:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    /**
     * Autentica un usuario (login)
     * @param {Object} req - Objeto de solicitud Express
     * @param {Object} res - Objeto de respuesta Express
     * @returns {Promise<void>}
     */
    static async login(req, res) {
        try {
            // Verificar errores de validación
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Errores de validación',
                    errors: errors.array()
                });
            }

            const { email, password } = req.body;

            // 🔍 LOG DE DEBUGGING - Remover después de solucionar
            console.log('🔐 Intento de login:', {
                email: email,
                emailLength: email?.length,
                emailTrimmed: email?.trim(),
                passwordLength: password?.length,
                hasPassword: !!password,
                headers: req.headers['content-type'],
                origin: req.headers['origin']
            });

            // Normalizar email (convertir a minúsculas y trim)
            const normalizedEmail = email.toLowerCase().trim();

            // Buscar usuario por email (con contraseña)
            const user = await User.findByEmailWithPassword(normalizedEmail);
            
            // 🔍 LOG DE DEBUGGING
            console.log('👤 Usuario encontrado:', user ? 'SÍ' : 'NO', user ? `ID: ${user.id}` : '');
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Credenciales inválidas'
                });
            }

            // Verificar contraseña
            const isPasswordValid = await bcrypt.compare(password, user.password);
            
            // 🔍 LOG DE DEBUGGING
            console.log('🔑 Contraseña válida:', isPasswordValid);
            
            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: 'Credenciales inválidas'
                });
            }

            // Generar JWT token
            const token = jwt.sign(
                { 
                    userId: user.id, 
                    email: user.email 
                },
                process.env.JWT_SECRET || 'default_secret_key',
                { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
            );

            // Remover password del objeto user antes de enviarlo
            delete user.password;

            res.status(200).json({
                success: true,
                message: 'Login exitoso',
                data: {
                    user,
                    token,
                    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
                }
            });
        } catch (error) {
            console.error('Error en login:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    /**
     * Obtiene el perfil del usuario autenticado
     * @param {Object} req - Objeto de solicitud Express
     * @param {Object} res - Objeto de respuesta Express
     * @returns {Promise<void>}
     */
    static async getProfile(req, res) {
        try {
            const userId = req.user.userId;

            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuario no encontrado'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Perfil obtenido correctamente',
                data: user
            });
        } catch (error) {
            console.error('Error en getProfile:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    /**
     * Actualiza el perfil del usuario autenticado
     * @param {Object} req - Objeto de solicitud Express
     * @param {Object} res - Objeto de respuesta Express
     * @returns {Promise<void>}
     */
    static async updateProfile(req, res) {
        try {
            // Verificar errores de validación
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Errores de validación',
                    errors: errors.array()
                });
            }

            const userId = req.user.userId;
            const { nombre, email, telefono, currentPassword, newPassword } = req.body;

            // Verificar si el usuario existe
            const existingUser = await User.findByEmailWithPassword(req.user.email);
            if (!existingUser) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuario no encontrado'
                });
            }

            let updateData = { nombre, email, telefono };

            // Si se quiere cambiar la contraseña
            if (newPassword) {
                if (!currentPassword) {
                    return res.status(400).json({
                        success: false,
                        message: 'La contraseña actual es requerida para cambiar la contraseña'
                    });
                }

                // Verificar contraseña actual
                const isCurrentPasswordValid = await bcrypt.compare(currentPassword, existingUser.password);
                if (!isCurrentPasswordValid) {
                    return res.status(401).json({
                        success: false,
                        message: 'Contraseña actual incorrecta'
                    });
                }

                // Hashear nueva contraseña
                const saltRounds = 12;
                updateData.password = await bcrypt.hash(newPassword, saltRounds);
            }

            // Verificar si el email ya existe en otro usuario
            if (email !== existingUser.email) {
                const emailUser = await User.findByEmail(email);
                if (emailUser && emailUser.id !== userId) {
                    return res.status(409).json({
                        success: false,
                        message: 'El email ya está registrado en otro usuario'
                    });
                }
            }

            // Actualizar el usuario
            const updatedUser = await User.update(userId, updateData);

            res.status(200).json({
                success: true,
                message: 'Perfil actualizado correctamente',
                data: updatedUser
            });
        } catch (error) {
            console.error('Error en updateProfile:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    /**
     * Renueva el token JWT
     * @param {Object} req - Objeto de solicitud Express
     * @param {Object} res - Objeto de respuesta Express
     * @returns {Promise<void>}
     */
    static async refreshToken(req, res) {
        try {
            const userId = req.user.userId;
            const email = req.user.email;

            // Generar nuevo token
            const newToken = jwt.sign(
                { userId, email },
                process.env.JWT_SECRET || 'default_secret_key',
                { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
            );

            res.status(200).json({
                success: true,
                message: 'Token renovado correctamente',
                data: {
                    token: newToken,
                    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
                }
            });
        } catch (error) {
            console.error('Error en refreshToken:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    /**
     * Logout (en el cliente simplemente eliminar el token)
     * @param {Object} req - Objeto de solicitud Express
     * @param {Object} res - Objeto de respuesta Express
     * @returns {Promise<void>}
     */
    static async logout(req, res) {
        try {
            // En una implementación más avanzada, aquí podrías:
            // - Agregar el token a una lista negra
            // - Invalidar el token en una base de datos de sesiones
            // - Registrar el logout en logs de auditoría

            res.status(200).json({
                success: true,
                message: 'Logout exitoso',
                data: {
                    message: 'Token invalidado. Elimina el token del cliente.'
                }
            });
        } catch (error) {
            console.error('Error en logout:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }
}

module.exports = AuthController;