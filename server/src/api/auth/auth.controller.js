const Joi = require('joi');
const Account = require('../../models/account');
const { generateToken } = require('../../lib/token');

//로컬 회원가입
exports.localRegister = async ctx => {
  //데이터 검증
  const schema = Joi.object().keys({
    username: Joi.string().alphanum().min(4).max(15).required(),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6)
  });

  const result = schema.validate(ctx.request.body);

  //스키마 검증 실패시
  if (result.error) {
    ctx.status = 400;
    return;
  }

  /* TODO: 아이디 / 이메일 중복처리 구현 */

  //계정생성
  let accout = null;
  try {
    accout = await Account.localRegister(ctx.request.body);
  } catch (e) {
    ctx.throw(500, e);
  }

  let token = null;

  try {
    token = await accout.generateToken();
  } catch (e) {
    ctx.throw(500, e);
  }

  ctx.cookies.set('access_token', token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7
  });
  ctx.body = accout.profile; //프로필 정보로 응답.
};

//로컬 로그인
exports.localLogin = async ctx => {
  //데이터 검증
  const schema = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  });

  const result = schema.validate(ctx.request.body);

  if (result.error) {
    ctx.status = 400;
    return;
  }

  const { email, password } = ctx.request.body;

  let accout = null;

  try {
    accout = await Account.findByEmail(email);
  } catch (e) {
    ctx.throw(500, e);
  }

  if (!accout || !accout.validatePassword(password)) {
    ctx.status = 403;
    return;
  }

  let token = null;

  try {
    token = await accout.generateToken();
  } catch (e) {
    ctx.throw(500, e);
  }

  ctx.cookies.set('access_token', token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7
  });
  ctx.body = accout.profile;
};

//이메일/아이디 존재 유무 확인
exports.exists = async ctx => {
  const { key, value } = ctx.params;
  let account = null;

  try {
    account = await (key === 'email'
      ? Account.findByEmail(value)
      : Account.findByUsername(value));
  } catch (e) {
    ctx.throw(500, e);
  }

  ctx.body = {
    exists: account !== null
  };
};

//로그아웃
exports.logout = async ctx => {
  ctx.cookies.set('access_token', null, {
    maxAge: 0,
    httpOnly: true
  });
  ctx.status = 204;
};
