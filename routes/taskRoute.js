const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// Yeni görev oluştur
router.post('/', taskController.createTask);

// Görevleri al
router.get('/', taskController.getAllTasks);

// Görev lane güncelleme
router.put('/:taskId/updateLane', taskController.updateTaskLane);

// Görev silme route'u
router.delete('/:taskId', taskController.deleteTask);

module.exports = router;
