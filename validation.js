const Joi = require('joi');

const suplaConfigValidation = Joi.object({
  kiedySmieciURL: Joi.string().required(),
  regions: Joi.array().items(
    Joi.object({
      bearer: Joi.string().required(),
      suplaBaseServerURL: Joi.string().required(),
      region: Joi.string().required(),
      channel: Joi.string().required(),
      prefix: Joi.string().required(),
      printTypes: Joi.alternatives().try(Joi.string().pattern(/^(true|false)$/), Joi.boolean()).required(),
      notifications: Joi.object({
        devices: Joi.array().items(Joi.object({
          name: Joi.string().required(),
          when: Joi.string().pattern(/^([0-1][0-9]|[2][0-3]):([0-5][0-9])$/),
          days: Joi.alternatives().try(Joi.number(), Joi.string()).required(),
        })).required(),
      }).optional()
    })
  )
})
const iconsConfigValidation = Joi.array().items(Joi.object({
  icon: Joi.alternatives().try(Joi.number(), Joi.string()).required(),
  types: Joi.array().items(Joi.string())
}))

const notificationsConfigValidation = Joi.object().pattern(/^/, Joi.object({
  provider: Joi.string().valid("Expo", "Pushover").required(),
  //Expo notifi
  tokenExpo: Joi.string().pattern(/^ExponentPushToken\[.+\]$/).when("provider", { is: "Expo", then: Joi.required(), otherwise: Joi.forbidden()}),
  //Pushover notif
  tokenPushover: Joi.string().when("provider", { is: "Pushover", then: Joi.required(), otherwise: Joi.forbidden()}),
  user: Joi.string().when("provider", { is: "Pushover", then: Joi.required(), otherwise: Joi.forbidden()}),
  device: Joi.string().when("provider", { is: "Pushover", then: Joi.required(), otherwise: Joi.forbidden()}),
}))


module.exports = {
  iconsConfigValidation,
  suplaConfigValidation,
  notificationsConfigValidation
}