import Joi from 'joi';
import User from '../../models/user';

export const register = async ctx => {
  //회원가입
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  });

  const result = schema.validateAsync(ctx.request.body);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const { username, password } = ctx.request.body;

  try {
    const exists = await User.findByUsername(username);
    if (exists) {
      ctx.status = 409; // Conflict
      return;
    }

    const user = new User({
      username,
    });

    await user.setPassword(password);
    await user.save();
    ctx.body = user.serialize();

    const token = user.generataToken();
    ctx.cookies.set('access_token', token, {
      maxAge: 1000 * 60 * 60 * 24 * 7, //7일
      httpOnly: true,
    });
  } catch (error) {
    ctx.throw(500, error);
  }
};

export const login = async ctx => {
  //로그인
  const { username, password } = ctx.request.body;

  if (!username || !password) {
    ctx.status = 401; //unauthorized
    return;
  }

  try {
    const user = await User.findByUsername(username);
    if (!user) {
      ctx.status = 401;
      return;
    }
    const valid = await user.checkPassword(password);
    if (!valid) {
      ctx.status = 401;
      return;
    }
    ctx.body = user.serialize();

    const token = user.generataToken();
    ctx.cookies.set('access_token', token, {
      maxAge: 1000 * 60 * 60 * 24 * 7, //7일
      httpOnly: true,
    });
  } catch (error) {
    ctx.throw(500, error);
  }
};

export const check = async ctx => {
  //로그인 상태확인
  const { user } = ctx.state;
  if (!user) {
    ctx.status = 401;
    return;
  }
  ctx.body = user;
};

export const logout = async ctx => {
  //로그아웃
  ctx.cookies.set('access_token');
  ctx.status = 204; //no content
};
