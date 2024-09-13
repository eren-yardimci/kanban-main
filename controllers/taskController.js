const Task = require('../models/Task');

// Görev oluşturma
exports.createTask = async (req, res) => {
  try {
    if (!req.session.userID) {
      return res.status(401).json({ message: 'Lütfen giriş yapın' });
    }

    const { title, description, lane } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const task = new Task({
      title,
      description,
      lane, // Görev lane'ini de kaydet
      user: req.session.userID
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    console.error('Task oluşturulurken hata:', error);
    res.status(500).json({ message: 'Task oluşturulurken bir hata meydana geldi' });
  }
};

exports.getAllTasks = async (req, res) => {
  try {
    const userId = req.session.userID; // Kullanıcının ID'sini session'dan al
    if (!userId) {
      return res.status(401).json({ message: 'Lütfen giriş yapın.' });
    }

    // Kullanıcının görevlerini getir
    const tasks = await Task.find({ user: userId }).exec();
    res.json(tasks); // Görevleri JSON formatında gönder
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Görevler alınırken bir hata meydana geldi.' });
  }
};

exports.updateTaskLane = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const { lane } = req.body;

    if (!lane) {
      return res.status(400).json({ message: 'Lane bilgisi gerekli.' });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { lane: lane },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: 'Görev bulunamadı.' });
    }

    res.json(updatedTask);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Görev lane güncellenirken hata oluştu.' });
  }
};

// Görev silme
exports.deleteTask = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const deletedTask = await Task.findByIdAndDelete(taskId);

    if (!deletedTask) {
      return res.status(404).json({ message: 'Görev bulunamadı.' });
    }

    res.status(200).json({ message: 'Görev başarıyla silindi.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Görev silinirken hata oluştu.' });
  }
};
