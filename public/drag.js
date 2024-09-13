const draggables = document.querySelectorAll(".task");
const droppables = document.querySelectorAll(".swim-lane");

draggables.forEach((task) => {
  task.addEventListener("dragstart", () => {
    task.classList.add("is-dragging");
  });
  task.addEventListener("dragend", () => {
    task.classList.remove("is-dragging");
  });
});

droppables.forEach((zone) => {
  zone.addEventListener("dragover", (e) => {
    e.preventDefault();

    const bottomTask = insertAboveTask(zone, e.clientY);
    const curTask = document.querySelector(".is-dragging");

    if (!bottomTask) {
      zone.appendChild(curTask);
    } else {
      zone.insertBefore(curTask, bottomTask);
    }
  });

  zone.addEventListener("drop", async (e) => {
    e.preventDefault();

    const curTask = document.querySelector(".is-dragging");
    const taskId = curTask.dataset.taskId; // ID'yi veri olarak sakladığınızı varsayıyorum
    const newLane = zone.id.replace('-lane', '').replace('-', ' ').toUpperCase(); // Yeni lane adını elde edin

    console.log(`Task ID: ${taskId}, New Lane: ${newLane}`); // Debugging

    // Sunucuya lane güncelleme isteği gönder
    try {
      const response = await fetch(`/tasks/${taskId}/updateLane`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ lane: newLane })
      });

      if (!response.ok) {
        throw new Error('Görev lane güncellenirken hata oluştu.');
      }

      // Eğer başarılıysa, görevi yeni lane'e ekle
      const bottomTask = insertAboveTask(zone, e.clientY);
      if (!bottomTask) {
        zone.appendChild(curTask);
      } else {
        zone.insertBefore(curTask, bottomTask);
      }
    } catch (error) {
      console.error(error);
      alert('Görev lane güncellenirken hata oluştu.');
    }
  });
});

const insertAboveTask = (zone, mouseY) => {
  const els = zone.querySelectorAll(".task:not(.is-dragging)");

  let closestTask = null;
  let closestOffset = Number.NEGATIVE_INFINITY;

  els.forEach((task) => {
    const { top } = task.getBoundingClientRect();
    const offset = mouseY - top;

    if (offset < 0 && offset > closestOffset) {
      closestOffset = offset;
      closestTask = task;
    }
  });

  return closestTask;
};

// Silme butonlarına tıklama olayını ekleyin
document.addEventListener('click', async (e) => {
  if (e.target.classList.contains('delete-btn')) {
    const taskElem = e.target.closest('.task');
    const taskId = taskElem.dataset.taskId;

    if (confirm('Bu görevi silmek istediğinizden emin misiniz?')) {
      try {
        const response = await fetch(`/tasks/${taskId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Görev silinirken hata oluştu.');
        }

        // Görev başarıyla silindiyse, DOM'dan kaldır
        taskElem.remove();
      } catch (error) {
        console.error(error);
        alert('Görev silinirken hata oluştu.');
      }
    }
  }
});
