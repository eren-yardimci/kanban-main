document.addEventListener("DOMContentLoaded", function() {
    const toggleThemeBtn = document.getElementById("toggle-theme-btn");
  
    // Kullanıcı önceden tema seçtiyse, onu uygula
    const currentTheme = localStorage.getItem("theme") || "light";
    document.body.classList.add(`${currentTheme}-mode`);
  
    // Tema değiştirildiğinde, sınıfları güncelle ve localStorage'a kaydet
    toggleThemeBtn.addEventListener("click", function() {
      if (document.body.classList.contains("light-mode")) {
        document.body.classList.replace("light-mode", "dark-mode");
        localStorage.setItem("theme", "dark");
      } else {
        document.body.classList.replace("dark-mode", "light-mode");
        localStorage.setItem("theme", "light");
      }
    });
  });
  