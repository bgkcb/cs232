document.addEventListener('DOMContentLoaded', () => {
  const images = document.querySelectorAll('.event-image');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dots = document.querySelectorAll('.gallery-dots .dot');

  const popup = document.getElementById('register-popup');
  const popupTitle = document.getElementById('popup-register-title');
  const registerTitleInput = document.getElementById('register-title');
  const registerDateInput = document.getElementById('register-date');
  const confirmBtn = document.getElementById('register-save');
  const cancelBtn = document.getElementById('register-cancel');
  const deleteBtn = document.getElementById('register-delete');

  // แมปชื่อ event กับสี ตามลำดับที่ต้องการ
  const eventColorsMap = {
    "LeaderShip Camp 4": "#f747cb",            // ชมพู
    "2020 BUSINESS CONFERENCE": "#facc15",    // เหลือง
    "Digital marketing seminar grow your business": "#10b981", // เขียว
    "Classmeeting SMP API AL-HUDA": "#ef4444"  // แดง
  };

  // Fixed dates ตามลำดับภาพ (ใช้แค่เพื่อเติม popup)
  const fixedEventDates = {
    "LeaderShip Camp 4": "2025-05-24",
    "2020 BUSINESS CONFERENCE": "2025-05-25",
    "Digital marketing seminar grow your business": "2025-05-26",
    "Classmeeting SMP API AL-HUDA": "2025-05-27"
  };

  let currentIndex = 0;
  let events = JSON.parse(localStorage.getItem('registeredEvents') || '[]');

  function getTodayBangkok() {
    const now = new Date();
    const utc7Offset = 7 * 60 * 60 * 1000;
    const nowBangkok = new Date(now.getTime() + utc7Offset);
    const year = nowBangkok.getUTCFullYear();
    const month = String(nowBangkok.getUTCMonth() + 1).padStart(2, '0');
    const day = String(nowBangkok.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function showImage(index) {
    images.forEach((img, i) => {
      img.classList.toggle('active', i === index);
      dots[i].classList.toggle('active', i === index);
    });
    currentIndex = index;
  }

  prevBtn.addEventListener('click', () => {
    showImage((currentIndex - 1 + images.length) % images.length);
  });

  nextBtn.addEventListener('click', () => {
    showImage((currentIndex + 1) % images.length);
  });

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      showImage(parseInt(dot.getAttribute('data-index')));
    });
  });

  function openPopupWithDate(title, index) {
    currentIndex = index;

    // หา eventDate จากแมปชื่อ event
    const eventDate = fixedEventDates[title] || getTodayBangkok();

    popupTitle.textContent = title;
    registerTitleInput.value = title;

    registerDateInput.value = eventDate;
    registerDateInput.min = eventDate;
    registerDateInput.max = eventDate;
    registerDateInput.disabled = true;

    // กำหนดสีจากแมปชื่อ event ถ้าไม่มีใช้สีเหลืองเป็น default
    const color = eventColorsMap[title] || '#facc15';
    registerDateInput.style.backgroundColor = color;

    popup.classList.remove('hidden');
  }

  images.forEach((img, idx) => {
    img.addEventListener('click', () => openPopupWithDate(img.alt, idx));
  });

  document.querySelectorAll('.event-item').forEach((item, idx) => {
    item.addEventListener('click', e => {
      if (e.target.classList.contains('register-btn')) return;
      openPopupWithDate(item.getAttribute('data-title'), idx);
    });
  });

  document.querySelectorAll('.register-btn').forEach((btn, idx) => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const eventItem = btn.closest('.event-item');
      openPopupWithDate(eventItem.getAttribute('data-title'), idx);
    });
  });

  confirmBtn.addEventListener('click', () => {
    const title = registerTitleInput.value.trim();
    const date = registerDateInput.value;
    const color = eventColorsMap[title] || '#facc15';

    if (!title || !date) {
      alert('Please complete all fields.');
      return;
    }

    events = JSON.parse(localStorage.getItem('registeredEvents') || '[]');

    if (events.some(ev => ev.title === title)) {
      alert('You have already registered this event.');
      return;
    }

    events.push({ title, start: date, end: date, color });
    localStorage.setItem('registeredEvents', JSON.stringify(events));

    popup.classList.add('hidden');

    if (typeof renderCalendar === 'function') renderCalendar('calendar-mini');
    if (typeof updateDocumentsPanel === 'function') updateDocumentsPanel();
  });

  cancelBtn.addEventListener('click', () => {
    popup.classList.add('hidden');
  });

  deleteBtn.addEventListener('click', () => {
    const title = registerTitleInput.value.trim();
    if (!title) return;
    events = JSON.parse(localStorage.getItem('registeredEvents') || '[]');
    events = events.filter(ev => ev.title !== title);
    localStorage.setItem('registeredEvents', JSON.stringify(events));

    popup.classList.add('hidden');

    if (typeof renderCalendar === 'function') renderCalendar('calendar-mini');
    if (typeof updateDocumentsPanel === 'function') updateDocumentsPanel();
  });

  // Confirm popup functions (ถ้ามี)
  let confirmedEvents = JSON.parse(localStorage.getItem('confirmedEvents') || '[]');

  function openConfirmPopup() {
    const popup = document.getElementById('confirm-popup');
    const select = document.getElementById('confirm-event-select');
    const msg = document.getElementById('confirm-msg');
    select.innerHTML = '';
    msg.textContent = '';

    const events = JSON.parse(localStorage.getItem('registeredEvents') || '[]');
    events.forEach((ev, i) => {
      const opt = document.createElement('option');
      opt.value = i;
      opt.textContent = `${ev.title} (${ev.start})`;
      select.appendChild(opt);
    });

    popup.classList.remove('hidden');
  }

  function closeConfirmPopup() {
    document.getElementById('confirm-popup').classList.add('hidden');
  }

  function submitEventCode() {
    const index = document.getElementById('confirm-event-select').value;
    const inputCode = document.getElementById('confirm-code-input').value.trim().toLowerCase();
    const msg = document.getElementById('confirm-msg');

    let events = JSON.parse(localStorage.getItem('registeredEvents') || '[]');
    const event = events[index];

    if (!event) {
      msg.style.color = "red";
      msg.textContent = "Selected event not found.";
      return;
    }

    const today = new Date();
    const todayDate = today.getDate();

    const eventTitleNormalized = event.title.toLowerCase().replace(/\s+/g, '');
    const validCode = eventTitleNormalized + todayDate;

    const startDate = new Date(event.start);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(event.end);
    endDate.setHours(23, 59, 59, 999);
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    if (now < startDate || now > endDate) {
      msg.style.color = "red";
      msg.textContent = "Event registration is not active today.";
      return;
    }

    if (inputCode === validCode) {
      let confirmed = JSON.parse(localStorage.getItem('confirmedEvents') || '[]');

      if (!confirmed.some(ev => ev.title === event.title)) {
        confirmed.push(event);
        events.splice(index, 1);
        localStorage.setItem('confirmedEvents', JSON.stringify(confirmed));
        localStorage.setItem('registeredEvents', JSON.stringify(events));
      }

      msg.style.color = "green";
      msg.textContent = "Valid code!";
      updateConfirmedActivities();
      updateDocumentsPanel();
      setTimeout(closeConfirmPopup, 1000);
    } else {
      msg.style.color = "red";
      msg.textContent = "Invalid code. Please try again.";
    }
  }

  function updateConfirmedActivities() {
    const list = document.getElementById('confirmed-activities-list');
    if (!list) return;

    const confirmed = JSON.parse(localStorage.getItem('confirmedEvents') || '[]');
    list.innerHTML = '';
    confirmed.forEach(ev => {
      const li = document.createElement('li');
      li.textContent = `${ev.title} (${ev.start})`;
      list.appendChild(li);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    updateConfirmedActivities();
  });

  showImage(currentIndex);

  if (typeof renderCalendar === 'function') renderCalendar('calendar-mini');
  if (typeof updateDocumentsPanel === 'function') updateDocumentsPanel();
});
