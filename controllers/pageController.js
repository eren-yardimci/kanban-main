// pageController.js
const Task = require('../models/Task');
const User = require('../models/User'); // User modelini içe aktarın


exports.getIndexPage = async (req, res) => {
  try {
    const tasks = req.session.userID
      ? await Task.find({ user: req.session.userID })
      : [];

    const user = req.session.userID // Kullanıcı ID mevcutsa kullanıcıyı DB'den buluyoruz
      ? await User.findById(req.session.userID)
      : null;

    res.render('index', { tasks, userIN: user }); // Boolean yerine kullanıcı objesi gönderiliyor
  } catch (error) {
    console.error('Görevler getirilirken hata:', error);
    res.status(500).send('Görevler getirilirken bir hata meydana geldi');
  }
};


exports.getLoginPage = (req, res)=> {
    res.status(200).render('login', {
        page_name:'login',
    });
};

exports.getRegisterPage =  (req, res)=> {
    res.status(200).render('register', {
        page_name:'register',
    });
}
