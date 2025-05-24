document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault();
    // เปลี่ยนหน้าไปโฟลเดอร์ afterlogin/student.html
    window.location.href = 'signin.html';
  });
  