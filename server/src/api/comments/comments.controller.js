const Joi = require('joi');
const {
  Types: { ObjectId }
} = require('mongoose');

exports.replace = async ctx => {
  const { id } = ctx.params;

  if (!ObjectId.isValid) {
    ctx.status = 400;
    return;
  }

  //스키마 생성
  const schema = Joi.object().keys({
    title: Joi.string().required(),
    authors: Joi.array().items(
      Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().email().required()
      })
    ),
    publishedDate: Joi.date().required(),
    price: Joi.number().required(),
    tags: Joi.array().items(Joi.string()).required()
  });

  const result = schema.validate(ctx.request.body);

  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }
};
