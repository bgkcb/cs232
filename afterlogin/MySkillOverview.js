const hardSkills = [
  { name: "Coding", score: 1 },
  { name: "Design", score: 5 },
  { name: "Leadership", score: 2 },
  { name: "Data Analysis", score: 3 },
  { name: "Cloud Computing", score: 5 },
  { name: "Cybersecurity", score: 2 },
];

const softSkills = [
  { name: "Communication", score: 4 },
  { name: "Teamwork", score: 6 },
  { name: "Problem Solving", score: 4 },
  { name: "Critical Thinking", score: 3 },
  { name: "Creativity", score: 4 },
  { name: "Emotional Intelligence", score: 5 },
];

// Mock registeredEvents ให้เหมาะกับคะแนนสกิล
const registeredEvents = [
  // Coding (score 1)
  { title: "Intro to Coding", start: "2025-05-01", skills: ["Coding"] },

  // Design (score 5) — 3 events
  { title: "Design Basics Workshop", start: "2025-04-01", skills: ["Design"] },
  { title: "Advanced UI/UX Design", start: "2025-04-15", skills: ["Design"] },
  { title: "Creative Graphic Design", start: "2025-04-25", skills: ["Design"] },

  // Leadership (score 2)
  { title: "Leadership 101", start: "2025-03-10", skills: ["Leadership"] },
  { title: "Team Leadership Skills", start: "2025-03-20", skills: ["Leadership", "Teamwork"] },

  // Data Analysis (score 3)
  { title: "Data Analysis Basics", start: "2025-02-10", skills: ["Data Analysis"] },
  { title: "Excel for Data Analysis", start: "2025-02-20", skills: ["Data Analysis"] },

  // Cloud Computing (score 5) — 3 events
  { title: "Cloud Computing Intro", start: "2025-01-05", skills: ["Cloud Computing"] },
  { title: "AWS Fundamentals", start: "2025-01-15", skills: ["Cloud Computing"] },
  { title: "Azure Cloud Services", start: "2025-01-25", skills: ["Cloud Computing"] },

  // Cybersecurity (score 2)
  { title: "Cybersecurity Basics", start: "2025-01-30", skills: ["Cybersecurity"] },
  { title: "Network Security", start: "2025-02-10", skills: ["Cybersecurity"] },

  // Soft Skills

  // Communication (score 4)
  { title: "Effective Communication", start: "2025-05-05", skills: ["Communication"] },
  { title: "Public Speaking", start: "2025-05-15", skills: ["Communication"] },

  // Teamwork (score 6)
  { title: "Team Building Workshop", start: "2025-04-05", skills: ["Teamwork"] },
  { title: "Collaborative Projects", start: "2025-04-20", skills: ["Teamwork"] },
  { title: "Conflict Resolution", start: "2025-04-30", skills: ["Teamwork"] },

  // Problem Solving (score 4)
  { title: "Creative Problem Solving", start: "2025-03-05", skills: ["Problem Solving"] },
  { title: "Critical Thinking Skills", start: "2025-03-15", skills: ["Problem Solving", "Critical Thinking"] },

  // Critical Thinking (score 3)
  { title: "Logical Reasoning", start: "2025-02-05", skills: ["Critical Thinking"] },

  // Creativity (score 4)
  { title: "Creative Workshops", start: "2025-01-10", skills: ["Creativity"] },
  { title: "Design Thinking", start: "2025-01-20", skills: ["Creativity"] },

  // Emotional Intelligence (score 5)
  { title: "Emotional Intelligence Basics", start: "2025-02-01", skills: ["Emotional Intelligence"] },
  { title: "Stress Management", start: "2025-02-15", skills: ["Emotional Intelligence"] },
];

function getActivitiesForSkill(skillName) {
  return registeredEvents.filter(event => event.skills && event.skills.includes(skillName));
}

function renderSkills() {
  const hardSkillList = document.getElementById("hardSkillList");
  const softSkillList = document.getElementById("softSkillList");

  hardSkillList.innerHTML = "";
  softSkillList.innerHTML = "";

  const maxHardScore = Math.max(...hardSkills.map(s => s.score));
  const maxSoftScore = Math.max(...softSkills.map(s => s.score));

  hardSkills.forEach(skill => {
    const widthPercent = maxHardScore > 0 ? (skill.score / maxHardScore) * 100 : 0;
    const div = document.createElement("div");
    div.className = "skill-item";
    div.innerHTML = `
      <div class="skill-name">${skill.name}</div>
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${widthPercent}%; ">
          ${skill.score}
        </div>
      </div>
    `;
    hardSkillList.appendChild(div);
  });

  softSkills.forEach(skill => {
    const widthPercent = maxSoftScore > 0 ? (skill.score / maxSoftScore) * 100 : 0;
    const div = document.createElement("div");
    div.className = "skill-item";
    div.innerHTML = `
      <div class="skill-name">${skill.name}</div>
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${widthPercent}%; ">
          ${skill.score}
        </div>
      </div>
    `;
    softSkillList.appendChild(div);
  });
}

function renderLearningActivities() {
  const container = document.getElementById("learningActivitiesList");
  container.innerHTML = "";

  const hardContainer = document.createElement("div");
  hardContainer.className = "learning-activities-hard";

  const softContainer = document.createElement("div");
  softContainer.className = "learning-activities-soft";

  const hardHeader = document.createElement("h4");
  hardHeader.textContent = "Hard Skill Learning Activities";
  hardContainer.appendChild(hardHeader);

  const softHeader = document.createElement("h4");
  softHeader.textContent = "Soft Skill Learning Activities";
  softContainer.appendChild(softHeader);

  hardSkills.forEach(skill => {
    const activities = getActivitiesForSkill(skill.name);
    const skillDiv = document.createElement("div");
    skillDiv.className = "learning-skill-group";

    const skillTitle = document.createElement("h5");
    skillTitle.textContent = skill.name;
    skillDiv.appendChild(skillTitle);

    if (activities.length === 0) {
      const noAct = document.createElement("p");
      noAct.textContent = "No activities recorded.";
      skillDiv.appendChild(noAct);
    } else {
      const ul = document.createElement("ul");
      activities.forEach(act => {
        const li = document.createElement("li");
        const dateObj = new Date(act.start);
        const formattedDate = `${(dateObj.getMonth() + 1).toString().padStart(2,'0')}/${dateObj.getDate().toString().padStart(2,'0')}/${dateObj.getFullYear()}`;
        li.textContent = `${act.title} (Event Date: ${formattedDate})`;
        ul.appendChild(li);
      });
      skillDiv.appendChild(ul);
    }

    hardContainer.appendChild(skillDiv);
  });

  softSkills.forEach(skill => {
    const activities = getActivitiesForSkill(skill.name);
    const skillDiv = document.createElement("div");
    skillDiv.className = "learning-skill-group";

    const skillTitle = document.createElement("h5");
    skillTitle.textContent = skill.name;
    skillDiv.appendChild(skillTitle);

    if (activities.length === 0) {
      const noAct = document.createElement("p");
      noAct.textContent = "No activities recorded.";
      skillDiv.appendChild(noAct);
    } else {
      const ul = document.createElement("ul");
      activities.forEach(act => {
        const li = document.createElement("li");
        const dateObj = new Date(act.start);
        const formattedDate = `${(dateObj.getMonth() + 1).toString().padStart(2,'0')}/${dateObj.getDate().toString().padStart(2,'0')}/${dateObj.getFullYear()}`;
        li.textContent = `${act.title} (Event Date: ${formattedDate})`;
        ul.appendChild(li);
      });
      skillDiv.appendChild(ul);
    }

    softContainer.appendChild(skillDiv);
  });

  container.appendChild(hardContainer);
  container.appendChild(softContainer);
}

window.onload = () => {
  if (typeof initNavbar === "function") initNavbar();
  renderSkills();
  renderLearningActivities();

  const currentPath = window.location.pathname.split('/').pop().toLowerCase();
  const menuItems = document.querySelectorAll('.sidebar .menu-item');

  menuItems.forEach(item => {
    const href = item.getAttribute('href');
    if (href && href.toLowerCase().includes(currentPath)) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
};
