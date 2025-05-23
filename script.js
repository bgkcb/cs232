document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
  
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
  
    if (username === "6609650251" && password === "6609650251") {
      Swal.fire({
        icon: 'success',
        title: 'Login Successful',
        text: 'You are logged in as: Student',
        confirmButtonText: 'Continue'
      }).then(() => {
        window.location.href = 'afterlogin/student.html';
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: 'Invalid username or password.'
      });
    }
  });
  