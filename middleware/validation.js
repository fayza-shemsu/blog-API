const Joi = require("joi");

const postValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string().min(3).max(200).required(),
    content: Joi.string().min(10).required(),
    categories: Joi.array().items(Joi.string()),
    tags: Joi.array().items(Joi.string()),
  });
  return schema.validate(data);
};


const roleValidation = (data) => {
  const schema = Joi.object({
    role: Joi.string().valid("user", "author", "admin").required(),
  });
  return schema.validate(data);
};

module.exports = { postValidation, roleValidation };
