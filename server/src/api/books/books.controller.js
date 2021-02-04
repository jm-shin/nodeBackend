const Joi = require('joi');
const Book = require('../../models/book');

const {
  Types: { ObjectId }
} = require('mongoose');

//book 생성
exports.create = async ctx => {
  const { title, authors, publishedDate, price, tags } = ctx.request.body;

  const book = new Book({
    title,
    authors,
    publishedDate,
    price,
    tags
  });

  try {
    await book.save();
  } catch (e) {
    return ctx.throw(500, e);
  }

  ctx.body = book;
};

//book list 조회
exports.list = async ctx => {
  let books;

  try {
    books = await Book.find().sort({ _id: -1 }).limit(3).exec();
  } catch (e) {
    return ctx.throw(500, e);
  }

  ctx.body = books;
};

//book 조회
exports.get = async ctx => {
  const { id } = ctx.params; // URL 파라미터에서 id 값을 읽어옵니다.

  let book;

  try {
    book = await Book.findById(id).exec();
  } catch (e) {
    if (e.name === 'CastError') {
      ctx.status = 400;
      return;
    }
    return ctx.throw(500, e);
  }

  if (!book) {
    // 존재하지 않으면
    ctx.status = 404;
    ctx.body = { message: 'book not found' };
    return;
  }

  ctx.body = book;
};

//book 제거
exports.remove = async ctx => {
  const { id } = ctx.params;

  try {
    await Book.findByIdAndRemove(id).exec();
  } catch (e) {
    if (e.name === 'CastError') {
      ctx.status = 400;
      return;
    }
  }

  ctx.status = 204; //no content
};

//
exports.replace = async ctx => {
  const { id } = ctx.params;

  if (!ObjectId.isValid) {
    ctx.status = 400;
    return;
  }

  //스키마 생성
  const schema = Joi.object().keys({
    // 객체의 field 를 검증합니다.
    // 뒤에 required() 를 붙여주면 필수 항목이라는 의미입니다
    title: Joi.string().required(),
    authors: Joi.array().items(
      Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().email().required() // 이런식으로 이메일도 손쉽게 검증가능합니다
      })
    ),
    publishedDate: Joi.date().required(),
    price: Joi.number().required(),
    tags: Joi.array().items(Joi.string().required())
  });

  const result = schema.validate(ctx.request.body);

  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  let book;

  try {
    book = await Book.findByIdAndUpdate(id, ctx.request.body, {
      upsert: true, //이 값을 넣어주면 데이터가 존재하지 않으면 새로 만들어줌
      new: true // 이 값을 넣어줘야 반환하는 값이 업데이트된 데이터임. false시 업데이트 전의 데이터를 보여줌.
    });
  } catch (e) {
    return ctx.throw(500, e);
  }

  ctx.body = book;
};

exports.update = async ctx => {
  const { id } = ctx.params;

  if (!ObjectId.isValid) {
    ctx.status = 400;
    return;
  }

  let book;

  try {
    book = await Book.findByIdAndUpdate(id, ctx.request.body, {
      new: true
    });
  } catch (e) {
    return ctx.throw(500, e);
  }

  ctx.body = book;
};
