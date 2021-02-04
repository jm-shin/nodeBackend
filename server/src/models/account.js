const mongoose = require('mongoose');
const { Schema } = mongoose;
const crypto = require('crypto');
const { generateToken } = require('../lib/token');

function hash(password) {
  return crypto
    .createHmac('sha256', process.env.SECRET_KEY)
    .update(password)
    .digest('hex');
}

const Account = new Schema({
  profile: {
    username: String,
    thumbnail: { type: String, default: '/static/image/default_thumbnail.png' }
  },
  email: { type: String },
  social: {
    facebook: {
      id: String,
      accessToken: String
    },
    google: {
      id: String,
      accessToken: String
    }
  },
  password: String,
  thoughtCount: { type: Number, default: 0 }, //서비스에서 포스트를 작성할 때 마다 1씩 증가
  createAt: { type: Date, default: Date.now }
});

//.statics는 this가 모델 자체를 가르킴.
Account.statics.findByUsername = function (username) {
  return this.findOne({ 'profile.username': username }).exec();
};

Account.statics.findByEmail = function (email) {
  return this.findOne({ email }).exec();
};

Account.statics.findByEmailOrUserName = function ({ username, email }) {
  return this.findOne({
    //$or 연산자 사용
    $or: [{ 'profile.username': username }, { email }]
  }).exec();
};

Account.statics.localRegister = function ({ username, email, password }) {
  //데이터를 생성 할 때는 new this() 를 사용합니다.
  const account = new this({
    profile: {
      username
      //썸네일을 설정하지 않으면 기본값으로 사용
    },
    email,
    password: hash(password)
  });

  return account.save();
};

//.methods는 this가 데이터 인스턴스를 가르킴
Account.methods.validatePassword = function (password) {
  //함수로 전달받은 password의 해시값과, 데이터에 담겨있는 해시값을 비교.
  const hashed = hash(password);
  return this.password === hashed;
};

Account.methods.generateToken = function () {
  //JWT에 담을 내용
  const payload = {
    _id: this._id,
    profile: this.profile
  };

  return generateToken(payload, 'account');
};

module.exports = mongoose.model('Account', Account);
