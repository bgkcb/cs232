// เก็บ event ทั้งหมดในตัวแปรนี้ (โหลดจาก localStorage ตอนเริ่ม)
let events = [];
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

// ฟังก์ชันตัดเวลาจาก Date ให้เหลือแค่ปี-เดือน-วัน (ไม่สนใจเวลา)
function onlyDate(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

// สร้างปฏิทิน แสดงวันพร้อมจุดสีและชื่อ event (สีตาม event)
function renderCalendar(containerId) {
  const container = document.getElementById(containerId);
  const today = new Date();
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
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

  // เติมช่องว่างก่อนวันที่ 1 ของเดือน ตาม weekday
  for (let i = 0; i < firstDay; i++) html += "<td></td>";

  for (let date = 1; date <= daysInMonth; date++) {
    const cellDate = new Date(currentYear, currentMonth, date);
    const isToday = cellDate.toDateString() === today.toDateString();
    const isPast = cellDate < today && !isToday;
    const d = onlyDate(cellDate);

    // หา event ของวันนั้น (เทียบแค่ start วันเดียว)
    const dayEvents = events.filter(ev => {
      const evDate = onlyDate(new Date(ev.start));
      return evDate.getTime() === d.getTime();
    });

    // สร้าง dot สี event และชื่อ event สั้น ๆ
    let dotsHTML = '';
    let namesHTML = '';
    dayEvents.forEach(ev => {
      dotsHTML += `<div class="event-dot" style="background:${ev.color}" title="${ev.title}"></div>`;
      const shortTitle = ev.title.length > 12 ? ev.title.slice(0, 12) + '…' : ev.title;
      namesHTML += `<div class="event-name" style="color:${ev.color}; font-size:0.7rem; margin-top:2px;">${shortTitle}</div>`;
    });

    // สร้าง <td> ไม่มี onclick เพื่อไม่ให้เปิด popup เมื่อคลิกวัน
    html += `<td class="${isToday ? 'today' : ''} ${isPast ? 'past-day' : ''}">
      <div>${date}</div>
      <div style="display:flex; gap:4px; flex-wrap:wrap;">${dotsHTML}</div>
      ${namesHTML}
    </td>`;

    // ขึ้นแถวใหม่ทุกอาทิตย์
    if ((firstDay + date) % 7 === 0) html += "</tr><tr>";
  }

  // เติมช่องว่างท้ายเดือนถ้าจำเป็น
  const totalCells = firstDay + daysInMonth;
  const trailingEmpty = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
  for (let i = 0; i < trailingEmpty; i++) {
    html += '<td></td>';
  }
  html += "</tr></tbody></table>";
  container.innerHTML = html;
}

// เปลี่ยนเดือนในปฏิทิน
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
  updateDocumentsPanel();
}

// ฟังก์ชันช่วยแปลงวันที่
function formatDate(y, m, d) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

// อัพเดตรายการ event ด้านข้าง พร้อมปุ่มลบอย่างเดียว (ลบปุ่มแก้ไขออก)
function updateDocumentsPanel() {
  const docList = document.querySelector('.panel:nth-child(4) ul');
  if (!docList) return;

  events = JSON.parse(localStorage.getItem('registeredEvents') || '[]');
  docList.innerHTML = '';

  events.forEach((ev, idx) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span class="event-dot" style="background:${ev.color}; margin-right:8px;"></span>
      ${ev.title} on ${ev.start}
      <button onclick="deleteEvent(${idx})">🗑</button>
    `;
    docList.appendChild(li);
  });
}

// ลบ event ตาม index แล้วอัพเดต localStorage และ UI
function deleteEvent(index) {
  events.splice(index, 1);
  localStorage.setItem('registeredEvents', JSON.stringify(events));
  renderCalendar("calendar-mini");
  updateDocumentsPanel();
}

// โหลดข้อมูล event และแสดงปฏิทินกับรายการตอนหน้าโหลดเสร็จ
document.addEventListener("DOMContentLoaded", () => {
  events = JSON.parse(localStorage.getItem('registeredEvents') || '[]');
  renderCalendar("calendar-mini");
  updateDocumentsPanel();
});
// เปิด confirm popup พร้อมโหลด event ใน dropdown
function openConfirmPopup() {
  const popup = document.getElementById('confirm-popup');
  const select = document.getElementById('confirm-event-select');
  const msg = document.getElementById('confirm-msg');

  // ล้างข้อมูลก่อน
  select.innerHTML = '';
  msg.textContent = '';

  // ดึง event จาก localStorage
  const events = JSON.parse(localStorage.getItem('registeredEvents') || '[]');

  // สร้าง option สำหรับ dropdown
  events.forEach((ev, i) => {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = `${ev.title} (${ev.start})`;
    select.appendChild(opt);
  });

  popup.classList.remove('hidden');
}

// ปิด confirm popup
function closeConfirmPopup() {
  document.getElementById('confirm-popup').classList.add('hidden');
}

// ฟังก์ชันตรวจสอบโค้ดและยืนยัน
function submitEventCode() {
  const select = document.getElementById('confirm-event-select');
  const inputCode = document.getElementById('confirm-code-input').value.trim().toLowerCase();
  const msg = document.getElementById('confirm-msg');

  const events = JSON.parse(localStorage.getItem('registeredEvents') || '[]');
  const index = select.value;
  const event = events[index];

  if (!event) {
    msg.style.color = 'red';
    msg.textContent = 'Please select an event.';
    return;
  }

  // สร้างโค้ดที่ถูกต้อง: ชื่อกิจกรรม (พิมพ์เล็ก ไม่มีช่องว่าง) + วันที่ (เลขวัน)
  const eventNameCode = event.title.toLowerCase().replace(/\s+/g, '');
  const eventDay = new Date(event.start).getDate();
  const validCode = eventNameCode + eventDay;

  // ตรวจสอบว่า วันนี้ตรงกับวันที่จัดกิจกรรมหรือไม่ (หมดอายุถ้าไม่ใช่)
  const today = new Date();
  const todayDate = today.getDate();
  const eventDate = new Date(event.start);
  eventDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  if (today.getTime() !== eventDate.getTime()) {
    msg.style.color = 'red';
    msg.textContent = 'Event registration is not active today.';
    return;
  }

  if (inputCode === validCode) {
    // โหลด confirmedEvents จาก localStorage หรือสร้างใหม่ถ้ายังไม่มี
    let confirmedEvents = JSON.parse(localStorage.getItem('confirmedEvents') || '[]');

    // ถ้ายังไม่เคยยืนยัน event นี้ ให้เพิ่ม
    if (!confirmedEvents.some(ev => ev.title === event.title)) {
      confirmedEvents.push(event);

      // ลบ event ออกจาก registeredEvents (ถ้าต้องการ)
      events.splice(index, 1);

      // บันทึกข้อมูลใหม่กลับ localStorage
      localStorage.setItem('confirmedEvents', JSON.stringify(confirmedEvents));
      localStorage.setItem('registeredEvents', JSON.stringify(events));
    }

    msg.style.color = 'green';
    msg.textContent = 'Valid code! Your participation is confirmed.';
    updateConfirmedActivities();
    updateDocumentsPanel();

    setTimeout(closeConfirmPopup, 1500);
  } else {
    msg.style.color = 'red';
    msg.textContent = 'Invalid code. Please try again.';
  }
}

// ฟังก์ชันแสดงกิจกรรมที่ยืนยันแล้ว
function updateConfirmedActivities() {
  const list = document.getElementById('confirmed-activities-list');
  if (!list) return;

  const confirmedEvents = JSON.parse(localStorage.getItem('confirmedEvents') || '[]');
  list.innerHTML = '';

  confirmedEvents.forEach(ev => {
    const li = document.createElement('li');
    li.textContent = `${ev.title} (${ev.start})`;
    list.appendChild(li);
  });
}

// โหลดกิจกรรมที่ยืนยันแล้วตอนหน้าโหลด
document.addEventListener('DOMContentLoaded', () => {
  updateConfirmedActivities();
});
