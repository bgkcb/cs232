// navbar.js (เวอร์ชันแก้ไขสมบูรณ์ สำหรับ notification แบบ static list)

function initNotificationDropdown() {
  const notifBtn = document.getElementById("notification-btn");
  const notifDropdown = document.getElementById("notification-dropdown");
  const notifCount = document.getElementById("notification-count");
  const notifList = document.getElementById("notification-list");

  if (!notifBtn || !notifDropdown || !notifCount || !notifList) return;

  // รายชื่อกิจกรรมแบบคงที่ (แก้ไขชื่อและลิงก์ตามต้องการ)
  const staticEvents = [
  ];

  // แสดงจำนวน notification badge
  notifCount.textContent = staticEvents.length > 0 ? staticEvents.length : "";

  if (staticEvents.length === 0) {
    notifList.style.display = 'none';
    notifDropdown.querySelector('.empty-msg').style.display = 'block';
  } else {
    notifList.style.display = 'block';
    notifDropdown.querySelector('.empty-msg').style.display = 'none';

    notifList.innerHTML = '';
    staticEvents.forEach(ev => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.textContent = ev.title;
      a.href = ev.url;
      a.style.cursor = 'pointer';
      a.style.display = 'block';
      a.style.padding = '8px 12px';
      a.style.color = '#333';
      a.style.textDecoration = 'none';
      a.addEventListener('mouseover', () => { a.style.backgroundColor = '#f0f0f0'; });
      a.addEventListener('mouseout', () => { a.style.backgroundColor = 'transparent'; });
      li.appendChild(a);
      notifList.appendChild(li);
    });
  }

  notifBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    notifDropdown.classList.toggle("hidden");
  });

  document.addEventListener("click", () => {
    notifDropdown.classList.add("hidden");
  });
}

function initUserDropdown() {
  const toggle = document.getElementById("user-toggle");
  const dropdown = document.getElementById("dropdown-menu");
  const logoutBtn = document.getElementById("logout-btn");

  if (!toggle || !dropdown) return;

  const icon = toggle.querySelector("i.fa-chevron-down");

  toggle.addEventListener("click", (event) => {
    dropdown.classList.toggle("hidden");
    if (icon) {
      icon.classList.toggle("rotated");
    }
    event.stopPropagation();
  });

  document.addEventListener("click", (e) => {
    const clickedOutside = !dropdown.contains(e.target) && !toggle.contains(e.target);
    if (clickedOutside) {
      dropdown.classList.add("hidden");
      if (icon && icon.classList.contains("rotated")) {
        icon.classList.remove("rotated");
      }
    }
  });

  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      // เคลียร์ข้อมูล session/localStorage ตามต้องการ (ถ้าต้องการ)
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = "../index.html";
    });
  }
}

function setActiveSidebarMenu() {
  const currentPath = window.location.pathname.split('/').pop().toLowerCase();
  const menuItems = document.querySelectorAll('.sidebar .menu-item');

  menuItems.forEach(item => {
    const href = item.getAttribute('href')?.toLowerCase();
    if (href && href.includes(currentPath)) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  fetch('navbar.html')
    .then(response => response.text())
    .then(html => {
      document.getElementById('navbar-container').innerHTML = html;
      initUserDropdown();
      initNotificationDropdown();
      setActiveSidebarMenu();
    })
    .catch(error => {
      console.error('Error loading navbar:', error);
    });
});

document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = "../index.html";
    });
  }
});
