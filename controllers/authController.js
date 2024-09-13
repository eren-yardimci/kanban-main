const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);

    res.status(201).redirect('/login');
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
      const user = await User.findOne({ email });

      if (!user) {
          req.flash('error', 'Yanlış Kullanıcı Adı veya Şifre');
          return res.redirect('/login');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
          req.flash('error', 'Yanlış Kullanıcı Adı veya Şifre');
          return res.redirect('/login');
      }

      // Eğer şifre doğruysa oturumu başlat
      req.session.userID = user._id;
      res.redirect('/');
  } catch (error) {
      req.flash('error', 'Bir hata oluştu, lütfen tekrar deneyin');
      res.redirect('/login');
  }
};

exports.logoutUser = (req, res) => {
  req.session.destroy(()=> {
    res.redirect('/');
  })
}
