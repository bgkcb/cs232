const API_BASE = "https://rszn82uuzi.execute-api.us-east-1.amazonaws.com";
const advisorId = localStorage.getItem("advisorId"); // ชั่วคราว

let pieChart;

async function loadDashboard() {
  try {
    const res = await fetch(`${API_BASE}/advisor/dashboard?advisorId=${advisorId}`);
    const data = await res.json();

    if (!res.ok) {
      alert("เกิดข้อผิดพลาด: " + (data.error || "ไม่สามารถโหลดข้อมูลได้"));
      return;
    }

    if (!Array.isArray(data.students)) {
      alert("ข้อมูลผิดพลาด: ไม่พบรายชื่อนักศึกษา");
      return;
    }

    renderStudentTable(data.students);
    renderSkillPieChart(data.skillAverage);
  } catch (err) {
    alert("เกิดข้อผิดพลาดในการโหลดข้อมูล");
    console.error(err);
  }
}


function renderStudentTable(students) {
  const tbody = document.getElementById("studentTableBody");
  tbody.innerHTML = students.map(stu => {
    const skillText = Object.values(stu.skillCounts || {})
      .map(s => `${s.name}: ${s.count}`)
      .join(", ");

    const activityList = stu.confirmedActivities?.map(a => a.title).join(", ") || "-";

    return `
      <tr>
        <td>${stu.fullName}</td>
        <td>${skillText}</td>
        <td>${activityList}</td>
      </tr>
    `;
  }).join("");
}

function renderSkillPieChart(averages) {
  const labels = [];
  const data = [];
  const colors = [];

  Object.entries(averages).forEach(([id, s]) => {
    labels.push(s.name);
    data.push(s.average);
    colors.push(randomColor());
  });

  const ctx = document.getElementById("skillPieChart").getContext("2d");
  if (pieChart) pieChart.destroy();

  pieChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels,
      datasets: [{
        label: "Skill Avg",
        data,
        backgroundColor: colors
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom"
        },
        title: {
          display: true,
          text: "ค่าเฉลี่ยสกิลจากนักศึกษาทั้งหมด"
        }
      }
    }
  });
}

function randomColor() {
  return `hsl(${Math.floor(Math.random() * 360)}, 70%, 65%)`;
}

window.onload = loadDashboard;
