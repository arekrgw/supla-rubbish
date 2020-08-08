const Joi = require('joi');

const suplaConfigValidation = Joi.object({
  kiedySmieciURL: Joi.string().required(),
  regions: Joi.array().items(
    Joi.object({
      bearer: Joi.string().required(),
      suplaBaseServerURL: Joi.string().required(),
      functionId: Joi.string().required(),
      region: Joi.string().required(),
      channel: Joi.string().required(),
      prefix: Joi.string().required(),
      printTypes: Joi.alternatives().try(Joi.string().pattern(/^(true|false)$/), Joi.boolean()).required(),
      notifications: Joi.object({
        devices: Joi.array().items(Joi.string()).required(),
        howManyDaysBefore: Joi.alternatives().try(Joi.number(), Joi.string().pattern(/^\d$/)).required()
      }).optional()
    })
  )
})
const iconsConfigValidation = Joi.array().items(Joi.object({
  icon: Joi.alternatives().try(Joi.number(), Joi.string()).required(),
  types: Joi.array().items(Joi.string())
}))

const notificationsConfigValidation = Joi.object().pattern(/^/, Joi.object({
  token: Joi.string().pattern(/^ExponentPushToken\[.+\]$/)
}))

module.exports = {
  iconsConfigValidation,
  suplaConfigValidation,
  notificationsConfigValidation
}