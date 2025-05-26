const API_BASE = "https://rszn82uuzi.execute-api.us-east-1.amazonaws.com";

let studentId = localStorage.getItem("studentId");
const email = localStorage.getItem("email");

document.addEventListener("DOMContentLoaded", () => {
  fetchStudentProfile(); // จะ update studentId แล้วดึงกิจกรรมต่อ
  renderCalendar("calendar-mini");
});

// ✅ ดึงข้อมูลนักศึกษา
async function fetchStudentProfile() {
  if (!email) return;
  try {
    const res = await fetch(`${API_BASE}/getstudent?email=${encodeURIComponent(email)}`);
    const data = await res.json();

    document.getElementById("studentId").textContent = data.studentId;
    document.getElementById("fullName").textContent = data.fullName;
    document.getElementById("email").textContent = data.email;

    // อัปเดต localStorage และตัวแปร studentId
    localStorage.setItem("studentId", data.studentId);
    localStorage.setItem("fullName", data.fullName);
    localStorage.setItem("email", data.email);
    studentId = data.studentId; // อัปเดตตัวแปร local ด้วย

    updateConfirmedActivities();
    updateDocumentsPanel();
    updateCheckinDropdown();
  } catch (err) {
    console.error("Error loading student profile:", err);
  }
}

// ✅ แสดงกิจกรรมที่ยืนยันแล้ว
async function updateConfirmedActivities() {
  const currentStudentId = localStorage.getItem("studentId") || studentId;
  if (!currentStudentId) return;
  try {
    const res = await fetch(`${API_BASE}/activity/confirmed?studentId=${currentStudentId}`);
    const data = await res.json();
    const list = document.getElementById("confirmed-activities-list");

    if (!Array.isArray(data) || data.length === 0) {
      list.innerHTML = `<li style="color: gray;">ยังไม่มีกิจกรรมที่ยืนยัน</li>`;
      return;
    }

    list.innerHTML = data.map(act =>
      `<li><strong>${act.title}</strong> (${new Date(act.confirmedAt).toLocaleDateString()})</li>`
    ).join("");
  } catch (err) {
    console.error("Error loading confirmed activities:", err);
  }
}

// ✅ แสดงกิจกรรมที่สมัครไว้ (Documents panel)
async function updateDocumentsPanel() {
  const currentStudentId = localStorage.getItem("studentId") || studentId;
  if (!currentStudentId) return;
  try {
    const [regRes, confirmRes] = await Promise.all([
      fetch(`${API_BASE}/activity/registered?studentId=${currentStudentId}`),
      fetch(`${API_BASE}/activity/confirmed?studentId=${currentStudentId}`)
    ]);

    const registered = await regRes.json();
    const confirmed = await confirmRes.json();
    const confirmedIds = confirmed.map(c => c.activityId);

    const list = document.getElementById("documents-list");

    const filtered = registered.filter(act => {
      const id = act.activityId || (act.SK?.startsWith("REG#") ? act.SK.replace("REG#", "") : undefined);
      return !confirmedIds.includes(id);
    });

    if (!Array.isArray(filtered) || filtered.length === 0) {
      list.innerHTML = `<li style="color: gray;">ยังไม่มีการลงทะเบียนกิจกรรมที่ยังไม่ยืนยัน</li>`;
      return;
    }

    list.innerHTML = filtered.map(act => `
      <li>
        <strong>${act.title}</strong><br/>
        วันที่: ${act.date}<br/>
        ลงทะเบียนเมื่อ: ${new Date(act.registeredAt).toLocaleDateString()}
      </li>
    `).join("");
  } catch (err) {
    console.error("Error loading documents:", err);
  }
}


// ✅ เตรียม dropdown สำหรับเลือกกิจกรรม check-in
async function updateCheckinDropdown() {
  const currentStudentId = localStorage.getItem("studentId") || studentId;
  if (!currentStudentId) return;
  try {
    const [regRes, confirmRes] = await Promise.all([
      fetch(`${API_BASE}/activity/registered?studentId=${currentStudentId}`),
      fetch(`${API_BASE}/activity/confirmed?studentId=${currentStudentId}`)
    ]);

    const registered = await regRes.json();
    const confirmed = await confirmRes.json();
    const confirmedIds = confirmed.map(c => c.activityId);

    const select = document.getElementById("confirm-event-select");
    select.innerHTML = "";

    const filtered = registered.filter(act => {
      const id = act.activityId || (act.SK?.startsWith("REG#") ? act.SK.replace("REG#", "") : undefined);
      return !confirmedIds.includes(id);
    });

    if (filtered.length === 0) {
      const option = document.createElement("option");
      option.textContent = "ไม่มีรายการกิจกรรม";
      option.disabled = true;
      option.selected = true;
      select.appendChild(option);
      return;
    }

    const defaultOption = document.createElement("option");
    defaultOption.textContent = "เลือกกิจกรรม";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    select.appendChild(defaultOption);

    filtered.forEach(act => {
      const activityId = act.activityId || (act.SK?.startsWith("REG#") ? act.SK.replace("REG#", "") : undefined);
      if (!activityId) return;

      const option = document.createElement("option");
      option.value = activityId;
      option.textContent = act.title;
      select.appendChild(option);
    });
  } catch (err) {
    console.error("Error loading registered for check-in:", err);
  }
}



// ✅ เปิด / ปิด popup
function openConfirmPopup() {
  document.getElementById("confirm-popup").classList.remove("hidden");
}
function closeConfirmPopup() {
  document.getElementById("confirm-popup").classList.add("hidden");
  document.getElementById("confirm-msg").textContent = "";
}

// ✅ ยืนยันรหัสกิจกรรม
async function submitEventCode() {
  const activityId = document.getElementById("confirm-event-select").value;
  const code = document.getElementById("confirm-code-input").value.trim();
  const msg = document.getElementById("confirm-msg");

  if (!code) {
    msg.textContent = "กรุณากรอกรหัสกิจกรรม";
    msg.style.color = "red";
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/activity/confirm`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId, activityId, code })
    });

    const result = await res.json();
    if (res.ok) {
      closeConfirmPopup();
      openFeedbackPopup(activityId);
      updateConfirmedActivities();
      updateDocumentsPanel();
      updateCheckinDropdown();
    } else {
      msg.textContent = result.message || "รหัสไม่ถูกต้อง";
      msg.style.color = "red";
    }
  } catch (err) {
    msg.textContent = "เกิดข้อผิดพลาด";
    msg.style.color = "red";
    console.error(err);
  }
}


async function submitFeedback() {
  const feedback = document.getElementById("feedback-text").value.trim();
  const activityId = document.getElementById("feedback-popup").dataset.activityId;
  const msg = document.getElementById("feedback-msg"); // เปลี่ยนจาก confirm-msg

  if (!feedback) {
    msg.style.color = "red";
    msg.textContent = "กรุณากรอกความคิดเห็นก่อนส่ง";
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/activity/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId, activityId, feedback })
    });

    const result = await res.json();
    if (res.ok) {
      msg.style.color = "green";
      msg.textContent = "✅ ส่งความคิดเห็นเรียบร้อยแล้ว";
      document.getElementById("feedback-text").value = "";

      setTimeout(() => {
        closeFeedbackPopup();
      }, 1000);
    } else {
      msg.style.color = "red";
      msg.textContent = result.message || "❌ ไม่สามารถส่งความคิดเห็นได้";
    }
  } catch (err) {
    console.error("Error submitting feedback:", err);
    msg.style.color = "red";
    msg.textContent = "❌ เกิดข้อผิดพลาดในการส่งความคิดเห็น";
  }
}

function openFeedbackPopup(activityId) {
  document.getElementById("feedback-popup").classList.remove("hidden");
  document.getElementById("feedback-popup").dataset.activityId = activityId;
  document.getElementById("feedback-text").value = "";
  document.getElementById("feedback-msg").textContent = "";
}


function closeFeedbackPopup() {
  document.getElementById("feedback-popup").classList.add("hidden");
}
