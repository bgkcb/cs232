const poolData = {
  UserPoolId: 'us-east-1_ez00Hahfd',
  ClientId: '25mkjfdrg1dl2ku19icjvkun93'
};
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

let currentCognitoUser;
let authDetails;

document.getElementById("login-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const msg = document.getElementById("msg");

  authDetails = new AmazonCognitoIdentity.AuthenticationDetails({
    Username: email,
    Password: password
  });

  currentCognitoUser = new AmazonCognitoIdentity.CognitoUser({
    Username: email,
    Pool: userPool
  });

  currentCognitoUser.authenticateUser(authDetails, {
    onSuccess: onLoginSuccess,
    onFailure: err => {
      msg.textContent = err.message || "เข้าสู่ระบบล้มเหลว";
    },
    newPasswordRequired: () => {
      // ซ่อนฟอร์ม login → แสดงฟอร์มรหัสผ่านใหม่
      document.getElementById("login-form").style.display = "none";
      document.getElementById("new-password-form").style.display = "block";
    }
  });
});

document.getElementById("new-password-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const newPassword = document.getElementById("new-password").value;
  const msg = document.getElementById("new-pass-msg");

  currentCognitoUser.completeNewPasswordChallenge(newPassword, {}, {
    onSuccess: onLoginSuccess,
    onFailure: err => {
      msg.textContent = err.message || "เปลี่ยนรหัสผ่านล้มเหลว";
    }
  });
});

function onLoginSuccess(result) {
  currentCognitoUser.getUserAttributes((err, attributes) => {
    if (err) {
      document.getElementById("msg").textContent = err.message;
      return;
    }

    const role = attributes.find(attr => attr.getName() === "custom:role")?.getValue();
    const email = attributes.find(attr => attr.getName() === "email")?.getValue();
    const username = currentCognitoUser.getUsername();

    // เก็บ email และ id ใน localStorage
    localStorage.setItem("email", email);
    localStorage.setItem("userId", username);

    if (role === "Organizer") {
        const id = attributes.find(attr => attr.getName() === "custom:organizerId")?.getValue();
        localStorage.setItem("organizerId", id);
        window.location.href = "Organizer/organizer.html";
    } else if (role === "Advisor") {
      const advisorId = attributes.find(attr => attr.getName() === "custom:advisorId")?.getValue();
        localStorage.setItem("advisorId", advisorId);
        window.location.href = "Advisor/advisor.html";
    } else {
      window.location.href = "Student/student.html";
    }
  });
}
