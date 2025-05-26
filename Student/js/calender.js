// calender.js (minimal version)

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

function renderCalendar(containerId) {
  const container = document.getElementById(containerId);
  const today = new Date();
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  let html = `
    <div class="calendar-header">
      <button onclick="changeMonth(-1)">‹</button>
      ${monthNames[currentMonth]} ${currentYear}
      <button onclick="changeMonth(1)">›</button>
    </div>
    <table class="calendar-table">
      <thead><tr>${days.map(d => `<th>${d}</th>`).join('')}</tr></thead>
      <tbody><tr>`;

  for (let i = 0; i < firstDay; i++) html += "<td></td>";

  for (let date = 1; date <= daysInMonth; date++) {
    const cellDate = new Date(currentYear, currentMonth, date);
    const isToday = cellDate.toDateString() === today.toDateString();

    html += `<td class="${isToday ? 'today' : ''}">
      <div>${date}</div>
    </td>`;

    if ((firstDay + date) % 7 === 0) html += "</tr><tr>";
  }

  const totalCells = firstDay + daysInMonth;
  const trailingEmpty = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
  for (let i = 0; i < trailingEmpty; i++) html += '<td></td>';
  html += "</tr></tbody></table>";

  container.innerHTML = html;
}

function changeMonth(offset) {
  currentMonth += offset;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  } else if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  renderCalendar("calendar-mini");
}

document.addEventListener("DOMContentLoaded", () => {
  renderCalendar("calendar-mini");
});
