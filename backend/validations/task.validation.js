const Joi = require('joi');

const taskSchema = Joi.object({
  title: Joi.string()
    .min(1)
    .max(100)
    .required()
    .trim()
    .messages({
      'string.empty': 'Task title is required',
      'string.max': 'Title cannot exceed 100 characters'
    }),
  
  description: Joi.string()
    .max(500)
    .allow('')
    .trim()
    .messages({
      'string.max': 'Description cannot exceed 500 characters'
    }),
  
  priority: Joi.string()
    .valid('low', 'medium', 'high')
    .default('medium')
    .messages({
      'any.only': 'Priority must be one of: low, medium, high'
    }),
  
  dueDate: Joi.date()
    .iso()
    .allow(null)
    .messages({
      'date.format': 'Due date must be a valid ISO date format'
    }),
  
  completed: Joi.boolean()
    .default(false)
});

const bulkOperationSchema = Joi.object({
  action: Joi.string()
    .valid('markCompleted', 'markPending', 'updatePriority', 'delete')
    .required()
    .messages({
      'string.empty': 'Action is required',
      'any.only': 'Action must be one of: markCompleted, markPending, updatePriority, delete'
    }),
  
  taskIds: Joi.array()
    .items(Joi.string().hex().length(24))
    .min(1)
    .required()
    .messages({
      'array.min': 'At least one task ID is required',
      'string.hex': 'Invalid task ID format'
    }),
  
  data: Joi.object({
    priority: Joi.string().valid('low', 'medium', 'high')
  }).when('action', {
    is: 'updatePriority',
    then: Joi.required(),
    otherwise: Joi.optional()
  })
});

const validateTask = (req, res, next) => {
  const { error } = taskSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.details.map(detail => detail.message)
    });
  }
  
  next();
};

const validateBulkOperation = (req, res, next) => {
  const { error } = bulkOperationSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.details.map(detail => detail.message)
    });
  }
  
  next();
};

module.exports = {
  validateTask,
  validateBulkOperation
};