document.addEventListener('DOMContentLoaded', async () => {
    const createTaskBtn = document.querySelector('#create-task-btn');
    const taskFormContainer = document.querySelector('#task-form-container');
    const taskForm = document.querySelector('#task-form');
    const taskTitleInput = document.querySelector('#task-title');
    const taskDescriptionInput = document.querySelector('#task-description');
  
    // Görev oluşturma formunu göster/gizle
    createTaskBtn.addEventListener('click', () => {
      taskFormContainer.classList.toggle('hidden');
    });
  
    // Görev ekleme işlemi
    taskForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const taskTitle = taskTitleInput.value;
  const taskDescription = taskDescriptionInput.value;

  if (!taskTitle) {
    alert('Görev başlığı gereklidir.');
    return;
  }

  try {
    const response = await fetch('/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: taskTitle,
        description: taskDescription,
        status: 'Backlog' // Yeni görev varsayılan olarak Backlog lane'inde olacak
      }),
    });

    if (!response.ok) {
      throw new Error('Görev oluşturulurken hata oluştu.');
    }

    const task = await response.json();
    addTaskToLane(task);
    taskFormContainer.classList.add('hidden');
    taskTitleInput.value = '';
    taskDescriptionInput.value = '';
  } catch (error) {
    console.error(error);
    alert('Görev oluşturulurken hata oluştu.');
  }
});
  
    // Sayfa yüklendiğinde görevleri getir
    try {
      const response = await fetch('/tasks');
      if (!response.ok) {
        throw new Error('Görevler alınırken hata oluştu.');
      }
  
      const tasks = await response.json();
      tasks.forEach(task => addTaskToLane(task));
    } catch (error) {
      console.error(error);
      alert('Görevler alınırken hata oluştu.');
    }
  });
  
  function addTaskToLane(task) {
    const taskElem = document.createElement('div');
    taskElem.classList.add('task');
    taskElem.setAttribute('draggable', 'true');
    taskElem.dataset.taskId = task._id; // Görev ID'sini veri olarak sakla
  
    // Başlık
    const titleElem = document.createElement('div');
    titleElem.classList.add('task-title');
    titleElem.innerText = task.title;
    taskElem.appendChild(titleElem);
  
    // Açıklama
    if (task.description) {
      const descElem = document.createElement('div');
      descElem.classList.add('task-description');
      descElem.innerText = task.description;
      taskElem.appendChild(descElem);
    }
  
    // Silme butonu
    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-btn');
    deleteBtn.innerText = '✖';
    taskElem.appendChild(deleteBtn);
  
    // Drag & Drop event listener'ları
    taskElem.addEventListener('dragstart', () => {
      taskElem.classList.add('is-dragging');
    });
  
    taskElem.addEventListener('dragend', () => {
      taskElem.classList.remove('is-dragging');
    });
  
    // Görevi uygun lane'e ekle
    const laneId = task.lane ? `${task.lane.toLowerCase().replace(/ /g, '-')}-lane` : 'backlog-lane'; // Varsayılan lane
    console.log(`Lane ID: ${laneId}`); // Debugging için log ekleyin
    const lane = document.querySelector(`#${laneId}`);
    if (lane) {
      lane.appendChild(taskElem);
    } else {
      console.error(`Lane bulunamadı: ${laneId}`);
    }
  }
