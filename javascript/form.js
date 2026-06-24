const overlay   = document.getElementById('overlay');
    const btnClose  = document.getElementById('btn-close');
    const btnSubmit = document.getElementById('btn-submit');
    const successMsg = document.getElementById('success-msg');
 
    
    btnClose.addEventListener('click', () => {
      overlay.classList.add('hidden');
    });
 
    
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.add('hidden');
      }
    });
 
   
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        overlay.classList.add('hidden');
      }
    });
 
    
    btnSubmit.addEventListener('click', () => {
      const name  = document.getElementById('full-name').value.trim();
      const email = document.getElementById('email').value.trim();
 
      if (!name || !email) {
        alert('Пожалуйста, заполните поля "Полное имя" и "Электронная почта".');
        return;
      }
 
      successMsg.style.display = 'block';
      btnSubmit.disabled = true;
      btnSubmit.style.opacity = '0.6';
 
      setTimeout(() => {
        // overlay.classList.add('hidden');
        window.location.href = "about.html"
        successMsg.style.display = 'none';
        btnSubmit.disabled = false;
        btnSubmit.style.opacity = '1';
      }, 2500);
    });