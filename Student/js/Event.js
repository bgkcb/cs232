const API_BASE = "https://rszn82uuzi.execute-api.us-east-1.amazonaws.com";
const studentId = localStorage.getItem("studentId");
const fullName = localStorage.getItem("fullName");
const email = localStorage.getItem("email");

let registeredActivityIds = [];

document.addEventListener("DOMContentLoaded", fetchActivities);

// โหลดกิจกรรมทั้งหมด + รายการที่นักศึกษาลงทะเบียนไว้
async function fetchActivities() {
  try {
    const [activityRes, registeredRes] = await Promise.all([
      fetch(`${API_BASE}/activity`),
      fetch(`${API_BASE}/activity/registered?studentId=${studentId}`)
    ]);

    const activities = await activityRes.json();
    const registered = await registeredRes.json();

    registeredActivityIds = Array.isArray(registered)
      ? registered.map(a => a.activityId)
      : [];

    renderActivities(activities);
  } catch (err) {
    console.error("โหลดกิจกรรมล้มเหลว:", err);
  }
}

// แสดงกิจกรรม
function renderActivities(activities) {
  const ul = document.querySelector(".event-list ul");
  ul.innerHTML = "";

  if (!Array.isArray(activities) || activities.length === 0) {
    ul.innerHTML = `<li style="color: gray;">ยังไม่มีกิจกรรมในขณะนี้</li>`;
    return;
  }

  activities.forEach(act => {
    const hasRegistered = registeredActivityIds.includes(act.activityId);
    const li = document.createElement("li");

    li.innerHTML = `
      <strong>${act.title}</strong> (${act.date})<br/>
      Skill: ${act.skills?.map(s => s.name).join(", ") || "-"}<br/>
      ${act.description}<br/>
      ${!hasRegistered ? `
        <button
          class="register-btn"
          data-id="${act.activityId}"
          data-title="${act.title}"
          data-date="${act.date}"
        >ลงทะเบียน</button>
      ` : `<span style="color: green;">✅ ลงทะเบียนแล้ว</span>`}
    `;

    ul.appendChild(li);
  });

  document.querySelectorAll(".register-btn").forEach(btn => {
    btn.addEventListener("click", handleRegister);
  });
}

// สมัครกิจกรรม
async function handleRegister(e) {
  const btn = e.target;
  const activityId = btn.getAttribute("data-id");
  const title = btn.getAttribute("data-title");
  const date = btn.getAttribute("data-date");

  if (!studentId || !fullName || !email) {
    alert("ไม่พบข้อมูลนักศึกษา กรุณา login ใหม่");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/activity/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentId,
        fullName,
        email,
        activityId,
        title,
        date
      })
    });

    const data = await res.json();

    if (res.ok) {
      alert("ลงทะเบียนสำเร็จ");

      // บันทึกใน localStorage
      const newEvent = {
        title,
        start: date,
        color: "#10b981",
        activityId
      };
      const stored = JSON.parse(localStorage.getItem("registeredEvents") || "[]");
      stored.push(newEvent);
      localStorage.setItem("registeredEvents", JSON.stringify(stored));

      // อัปเดต Documents panel และปฏิทิน (ถ้ามี)
      if (typeof updateDocumentsPanel === "function") updateDocumentsPanel();
      if (typeof renderCalendar === "function") renderCalendar("calendar-mini");

      // ปิดปุ่ม
      btn.disabled = true;
      btn.textContent = "ลงทะเบียนแล้ว";
      btn.style.backgroundColor = "#ccc";
    } else {
      alert("ไม่สามารถลงทะเบียนได้: " + (data.message || "ไม่ทราบข้อผิดพลาด"));
    }
  } catch (err) {
    console.error("Error registering activity:", err);
    alert("เกิดข้อผิดพลาดระหว่างการลงทะเบียน");
  }
}
