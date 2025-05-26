const API_BASE = "https://rszn82uuzi.execute-api.us-east-1.amazonaws.com";
const organizerId = localStorage.getItem("organizerId");

const skillList = [
  { id: "hard1", name: "Programming" },
  { id: "hard2", name: "Database" },
  { id: "hard3", name: "Cloud" },
  { id: "soft1", name: "Teamwork" },
  { id: "soft2", name: "Communication" },
  { id: "soft3", name: "Problem Solving" }
];

function renderSkillCheckboxes() {
  const container = document.getElementById("skillCheckboxes");
  skillList.forEach(skill => {
    const label = document.createElement("label");
    label.innerHTML = `
      <input type="checkbox" value="${skill.id}" data-name="${skill.name}" />
      ${skill.name}
    `;
    container.appendChild(label);
  });
}

async function submitActivity(e) {
  e.preventDefault();

  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const date = document.getElementById("date").value;
  const secretCode = document.getElementById("secretCode").value.trim();
  const maxParticipants = parseInt(document.getElementById("maxParticipants").value);
  const checkboxes = document.querySelectorAll("#skillCheckboxes input:checked");

  const skills = [...checkboxes].map(cb => ({
    id: cb.value,
    name: cb.getAttribute("data-name")
  }));

  const activityId = `ACT${Date.now()}`;

  const payload = {
    activityId,
    title,
    description,
    date,
    organizerId,
    secretCode,
    maxParticipants,
    skills
  };

  const msg = document.getElementById("formMessage");
  try {
    const res = await fetch(`${API_BASE}/activity`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const result = await res.json();
    if (res.ok) {
      msg.textContent = "✅ กิจกรรมถูกสร้างแล้ว";
      document.getElementById("activityForm").reset();
    //   loadActivities();
    } else {
      msg.textContent = "❌ " + (result.message || "ไม่สามารถเพิ่มกิจกรรมได้");
    }
  } catch (err) {
    console.error("Error:", err);
    msg.textContent = "❌ เกิดข้อผิดพลาด";
  }
}

// async function loadActivities() {
//   const list = document.getElementById("activityList");
//   list.innerHTML = "<li>🔄 กำลังโหลด...</li>";

//   try {
//     const res = await fetch(`${API_BASE}/activity`);
//     const data = await res.json();

//     const filtered = data.filter(act => act.organizerId === organizerId);

//     if (filtered.length === 0) {
//       list.innerHTML = "<li>ไม่มีรายการ</li>";
//       return;
//     }

//     list.innerHTML = filtered.map(act => `
//     <li onclick='showActivityDetail(${JSON.stringify(act)})'>
//         <strong>${act.title}</strong> (${act.date})<br/>
//         ผู้เข้าร่วม: ${act.currentParticipants}/${act.maxParticipants}<br/>
//         Skill: ${act.skills.map(s => s.name).join(", ")}
//     </li>
//     `).join("");
//   } catch (err) {
//     list.innerHTML = "<li>❌ โหลดข้อมูลล้มเหลว</li>";
//     console.error(err);
//   }
// }

document.getElementById("activityForm").addEventListener("submit", submitActivity);

window.onload = () => {
  renderSkillCheckboxes();
//   loadActivities();
};

// function showActivityDetail(activity) {
//   document.getElementById("modal-title").textContent = activity.title;
//   document.getElementById("modal-description").textContent = activity.description;
//   document.getElementById("modal-code").textContent = activity.secretCode;
//   document.getElementById("modal-date").textContent = activity.date;

//   // โหลดผู้เข้าร่วม + feedback
//   loadParticipants(activity.activityId);
//   loadFeedback(activity.activityId);

//   document.getElementById("activity-modal").classList.remove("hidden");
// }

// function closeModal() {
//   document.getElementById("activity-modal").classList.add("hidden");
//   document.getElementById("modal-participants").innerHTML = "";
//   document.getElementById("modal-feedbacks").innerHTML = "";
// }

// async function loadParticipants(activityId) {
//   const ul = document.getElementById("modal-participants");
//   ul.innerHTML = "<li>🔄 กำลังโหลด...</li>";

//   try {
//     const res = await fetch(`${API_BASE}/activity/participants?activityId=${activityId}`);
//     const data = await res.json();

//     if (!Array.isArray(data) || data.length === 0) {
//       ul.innerHTML = "<li>ยังไม่มีผู้เข้าร่วม</li>";
//       return;
//     }

//     ul.innerHTML = data.map(p => `<li>${p.fullName} (${p.email})</li>`).join("");
//   } catch (err) {
//     ul.innerHTML = "<li>โหลดรายชื่อไม่สำเร็จ</li>";
//     console.error(err);
//   }
// }


// async function loadFeedback(activityId) {
//   const ul = document.getElementById("modal-feedbacks");
//   ul.innerHTML = "<li>🔄 กำลังโหลด...</li>";

//   try {
//     const res = await fetch(`${API_BASE}/activity/feedbacks?activityId=${activityId}`);
//     const data = await res.json();

//     if (!Array.isArray(data) || data.length === 0) {
//       ul.innerHTML = "<li>ยังไม่มี feedback</li>";
//       return;
//     }

//     ul.innerHTML = data.map(f => `<li>${f.feedback}</li>`).join("");
//   } catch (err) {
//     ul.innerHTML = "<li>โหลด feedback ไม่สำเร็จ</li>";
//     console.error(err);
//   }
// }
