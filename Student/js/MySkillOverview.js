const API_BASE = "https://rszn82uuzi.execute-api.us-east-1.amazonaws.com";
const studentId = localStorage.getItem("studentId");

const skillTypeMap = {
  "Programming": "hard",
  "Database": "hard",
  "Cloud": "hard",
  "Blockchain": "hard",
  "AI": "hard",
  "Cybersecurity": "hard",
  "Teamwork": "soft",
  "Communication": "soft",
  "Problem Solving": "soft",
  "Critical Thinking": "soft",
  "Creativity": "soft"
};

// Badge level by score
function getLevel(count) {
  if (count >= 7) return { text: "ADVANCED", color: "#00B894" };
  if (count >= 4) return { text: "INTERMEDIATE", color: "#FFD700" };
  return { text: "BEGINNER", color: "#FF6B6B" };
}

function renderSkillCard(skill, maxCount) {
  const level = getLevel(skill.count);
  const percent = Math.min((skill.count / maxCount) * 100, 100);

  const card = document.createElement("div");
  card.className = "skill-card";
  card.innerHTML = `
    <div class="skill-header">
      <i class="fas fa-star"></i>
      <strong>${skill.name}</strong><span style="margin-left: auto;">${skill.count}</span>
    </div>
    <div class="skill-progress-bar">
      <div class="skill-progress-fill" style="width: ${percent}%;"></div>
    </div>
    <div class="skill-badge" style="background-color: ${level.color};">${level.text}</div>
  `;
  return card;
}

function renderActivityCard(activity) {
  const card = document.createElement("div");
  card.className = "activity-card";
  const d = new Date(activity.confirmedAt);
  card.innerHTML = `
    <div class="activity-header">
      <i class="fas fa-certificate"></i>
      <strong>${activity.title}</strong>
    </div>
    <p><i class="fas fa-calendar-day"></i> วันที่ยืนยัน: ${d.toLocaleDateString("th-TH")}</p>
  `;
  return card;
}

async function fetchData() {
  const [skillRes, confirmRes] = await Promise.all([
    fetch(`${API_BASE}/student/skills?studentId=${studentId}`),
    fetch(`${API_BASE}/activity/confirmed?studentId=${studentId}`)
  ]);
  const skillCounts = await skillRes.json();
  const confirmed = await confirmRes.json();

  const hardContainer = document.getElementById("hardSkillList");
  const softContainer = document.getElementById("softSkillList");
  const activityList = document.getElementById("learningActivitiesList");

  hardContainer.innerHTML = "";
  softContainer.innerHTML = "";
  activityList.innerHTML = "";

  // หา count ที่มากที่สุดเพื่อใช้เป็น max
  const allCounts = Object.values(skillCounts).map(s => s.count);
  const maxCount = Math.max(...allCounts, 1); // กันไว้ไม่ให้หาร 0

  // render skill cards
  for (const key in skillCounts) {
    const skill = skillCounts[key];
    const type = skillTypeMap[skill.name] || "other";
    const card = renderSkillCard(skill, maxCount);
    if (type === "hard") hardContainer.appendChild(card);
    else if (type === "soft") softContainer.appendChild(card);
  }

  // render activities
  confirmed.forEach(ev => {
    const card = renderActivityCard(ev);
    activityList.appendChild(card);
  });
}


window.onload = () => {
  if (typeof initNavbar === "function") initNavbar();
  fetchData();
};
