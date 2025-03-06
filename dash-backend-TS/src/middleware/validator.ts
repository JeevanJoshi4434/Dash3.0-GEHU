const {body} = require('express-validator');


export const validateCreateUser = [
    body('phone').isLength({ min: 10 }).withMessage('Please provide a valid phone number.'),
    body('password').isLength({ min: 6 }).withMessage('Password should be at least 6 characters long.'),
    body('id').notEmpty().withMessage('ID is required'),
    body('name').notEmpty().withMessage('Name is required'),
    body('type').isIn(['asha', 'user', 'admin']).withMessage('User type should be asha, user, or admin'),
    body('location').notEmpty().withMessage('Location is required'),
];
