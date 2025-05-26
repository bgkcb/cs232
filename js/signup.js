  const poolData = {
  UserPoolId: 'us-east-1_ez00Hahfd',
  ClientId: '25mkjfdrg1dl2ku19icjvkun93'
};
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

let currentEmail = '';
let currentFullName = '';
let currentStudentId = '';
let currentAdvisorId = '';

document.getElementById("signup-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const fullname = document.getElementById("fullname").value;
  const studentId = document.getElementById("studentId").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const advisorId = document.getElementById("advisorId").value;

  currentEmail = email;
  currentFullName = fullname;
  currentStudentId = studentId;
  currentAdvisorId = advisorId;

  const attributeList = [
    new AmazonCognitoIdentity.CognitoUserAttribute({ Name: "email", Value: email }),
    new AmazonCognitoIdentity.CognitoUserAttribute({ Name: "name", Value: fullname })
  ];

  userPool.signUp(email, password, attributeList, null, function (err, result) {
    const msg = document.getElementById("msg");

    if (err) {
      msg.textContent = err.message || JSON.stringify(err);
      msg.style.color = "red";
      return;
    }

    msg.textContent = "สมัครสำเร็จ! กรุณากรอกรหัสยืนยันจากอีเมล";
    msg.style.color = "green";

    document.getElementById("verify-section").style.display = "block";
  });
});

document.getElementById("confirmBtn").addEventListener("click", function () {
  const code = document.getElementById("verifyCode").value;
  const userData = {
    Username: currentEmail,
    Pool: userPool
  };
  const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

  cognitoUser.confirmRegistration(code, true, function (err, result) {
    const msg = document.getElementById("msg");
    if (err) {
      msg.textContent = "รหัสไม่ถูกต้อง: " + (err.message || JSON.stringify(err));
      msg.style.color = "red";
      return;
    }

    msg.textContent = "ยืนยันสำเร็จ! กำลังสร้างบัญชี...";
    msg.style.color = "blue";

    // เรียก Lambda API หลังยืนยันสำเร็จ
    fetch("https://rszn82uuzi.execute-api.us-east-1.amazonaws.com/setstudent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        studentId: currentStudentId,
        fullName: currentFullName,
        email: currentEmail,
        advisorId: currentAdvisorId
      })
    })
    .then(res => res.json())
    .then(data => {
      msg.textContent = "สมัครและยืนยันสำเร็จ! ✅ สามารถเข้าสู่ระบบได้แล้ว";
      msg.style.color = "green";
      window.location.href = 'signin.html';
    })
    .catch(err => {
      msg.textContent = "สมัครสำเร็จ แต่ไม่สามารถลงทะเบียนข้อมูลในระบบได้";
      msg.style.color = "orange";
      console.error("Lambda error:", err);
    });
  });
});

// document.getElementById('signupForm').addEventListener('submit', function(e) {
//     e.preventDefault();
//     // เปลี่ยนหน้าไปโฟลเดอร์ afterlogin/student.html
//     window.location.href = 'signin.html';
//   });
  