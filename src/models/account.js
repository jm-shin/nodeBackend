const mongoose = require('mongoose');
const { Schema } = mongoose;
const crypto = require('crypto');

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

/**
 * 모델 메소드는 두 종류로 만들 수 가 있습니다.
 * .statics 와 .methods 인데요, 각 종류는 서로 가르키는 this 값이 다른데요,
 * 전자의 경우엔 모델 자체를 가르키고, 후자의 경우엔 데이터 인스턴스를 가르킵니다.
 * 메소드를 만들땐, 스키마를 모델화 하기 전에, .statics 혹은 .methods 를 사용하여 정의를 해주어야합니다.
 * 이렇게 메소드를 만들면, 우리가 원하는 작업마다 이름을 붙여 줄 수있게 되고 코드를 분리시킬 수 있게 되어 가독성도 높아지고,
 * 쿼리를 작성 할 때 데이터 구조를 확인하기 위하여 컨트롤러 파일과 모델 파일을 동시에 볼 필요도 없어서 편해집니다.
 */

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

module.exports = mongoose.model('Account', Account);
