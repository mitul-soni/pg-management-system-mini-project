/* ============================================================
   PG Management System — app.js
   ============================================================ */

// ===== LOCAL STORAGE HELPERS =====
const store = {
  get: key => JSON.parse(localStorage.getItem('pgms_' + key) || 'null'),
  set: (key, val) => localStorage.setItem('pgms_' + key, JSON.stringify(val)),
};

// ===== DATA =====
let rooms      = store.get('rooms')      || [];
let students   = store.get('students')   || [];
let payments   = store.get('payments')   || [];
let complaints = store.get('complaints') || [];
let notices    = store.get('notices')    || [];

function saveAll() {
  store.set('rooms',      rooms);
  store.set('students',   students);
  store.set('payments',   payments);
  store.set('complaints', complaints);
  store.set('notices',    notices);
}

// ===== SEED DEMO DATA (runs only once) =====
if (!store.get('seeded')) {
  rooms = [
    { id: 'R1', number: '101', type: 'Single', floor: 1, rent: 6000, status: 'Occupied',    amenities: ['WiFi','Geyser'] },
    { id: 'R2', number: '102', type: 'Double', floor: 1, rent: 4500, status: 'Occupied',    amenities: ['WiFi','AC','Attached Bathroom'] },
    { id: 'R3', number: '103', type: 'Triple', floor: 1, rent: 3500, status: 'Available',   amenities: ['WiFi'] },
    { id: 'R4', number: '201', type: 'Single', floor: 2, rent: 7000, status: 'Occupied',    amenities: ['AC','WiFi','Balcony','Attached Bathroom'] },
    { id: 'R5', number: '202', type: 'Double', floor: 2, rent: 5000, status: 'Maintenance', amenities: ['WiFi','Geyser'] },
    { id: 'R6', number: '203', type: 'Single', floor: 2, rent: 6500, status: 'Available',   amenities: ['AC','WiFi','Balcony'] },
  ];

  students = [
    { id: 'S1', sid: 'STU2024001', name: 'Ravi Kumar',    course: 'B.Tech CSE', year: '3rd', phone: '9876543210', email: 'ravi@email.com',   room: 'R1', joinDate: '2024-07-01', guardian: 'Suresh Kumar',  guardianPhone: '9876543200' },
    { id: 'S2', sid: 'STU2024002', name: 'Priya Sharma',  course: 'B.Sc IT',   year: '2nd', phone: '9876543211', email: 'priya@email.com',  room: 'R2', joinDate: '2024-07-15', guardian: 'Amit Sharma',   guardianPhone: '9876543201' },
    { id: 'S3', sid: 'STU2024003', name: 'Anjali Singh',  course: 'BCA',       year: '1st', phone: '9876543212', email: 'anjali@email.com', room: 'R2', joinDate: '2024-08-01', guardian: 'Ramesh Singh',  guardianPhone: '9876543202' },
    { id: 'S4', sid: 'STU2024004', name: 'Mohit Verma',   course: 'MBA',       year: '2nd', phone: '9876543213', email: 'mohit@email.com',  room: 'R4', joinDate: '2024-06-20', guardian: 'Vikas Verma',   guardianPhone: '9876543203' },
  ];

  payments = [
    { id: 'P1', studentId: 'S1', month: '2026-10', amount: 6000, paidOn: '2026-10-02', mode: 'UPI',  status: 'Paid',    remarks: '' },
    { id: 'P2', studentId: 'S2', month: '2026-10', amount: 4500, paidOn: '2026-10-05', mode: 'Cash', status: 'Paid',    remarks: '' },
    { id: 'P3', studentId: 'S3', month: '2026-10', amount: 4500, paidOn: '',           mode: 'Cash', status: 'Pending', remarks: '' },
    { id: 'P4', studentId: 'S4', month: '2026-10', amount: 7000, paidOn: '',           mode: 'UPI',  status: 'Overdue', remarks: 'Not responding' },
    { id: 'P5', studentId: 'S1', month: '2026-11', amount: 6000, paidOn: '2026-11-01', mode: 'UPI',  status: 'Paid',    remarks: '' },
  ];

  complaints = [
    { id: 'C1', studentId: 'S1', category: 'Plumbing',    desc: 'Bathroom tap leaking since 2 days.', priority: 'High',   status: 'Open',        date: '2026-11-15' },
    { id: 'C2', studentId: 'S3', category: 'Internet',    desc: 'WiFi very slow in room 102.',       priority: 'Medium', status: 'In Progress', date: '2026-11-14' },
    { id: 'C3', studentId: 'S2', category: 'Electrical',  desc: 'Main switch board sparking.',       priority: 'High',   status: 'Resolved',    date: '2026-11-10' },
  ];

  notices = [
    { id: 'N1', title: 'Water Supply Interruption', content: 'Water supply will be off on 22nd Nov from 9 AM to 2 PM due to tank cleaning. Please store water accordingly.', category: 'Maintenance', postedOn: '2026-11-18', expiry: '2026-11-22' },
    { id: 'N2', title: 'Rent Due Reminder',          content: 'Monthly rent for November is due by 5th December. Late fees of ₹200 will be charged after the due date.',    category: 'General',     postedOn: '2026-11-01', expiry: '2026-12-05' },
    { id: 'N3', title: 'No Loud Music After 10PM',   content: 'All residents are reminded to maintain silence after 10 PM. Violation will result in a warning.',            category: 'Rules',       postedOn: '2026-10-20', expiry: '' },
  ];

  saveAll();
  store.set('seeded', true);
}

// ===== NAVIGATION =====
const pageNames = { dashboard:'Dashboard', rooms:'Rooms', students:'Students', payments:'Payments', complaints:'Complaints', notices:'Notices' };

document.querySelectorAll('.nav-item').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const page = link.dataset.page;
    navigateTo(page);
    // close sidebar on mobile
    document.getElementById('sidebar').classList.remove('open');
    document.querySelector('.sidebar-overlay')?.classList.remove('show');
  });
});

function navigateTo(page) {
  document.querySelectorAll('.nav-item').forEach(l => l.classList.toggle('active', l.dataset.page === page));
  document.querySelectorAll('.page').forEach(p => p.classList.toggle('active', p.id === 'page-' + page));
  document.getElementById('pageTitle').textContent = pageNames[page] || page;
  refreshPage(page);
}

function refreshPage(page) {
  updateDashboard();
  if (page === 'rooms')      renderRooms();
  if (page === 'students')   renderStudents();
  if (page === 'payments')   renderPayments();
  if (page === 'complaints') renderComplaints();
  if (page === 'notices')    renderNotices();
}

// ===== SIDEBAR TOGGLE =====
const sidebar = document.getElementById('sidebar');
const overlay = document.createElement('div');
overlay.className = 'sidebar-overlay';
document.body.appendChild(overlay);

document.getElementById('menuBtn').addEventListener('click', () => {
  sidebar.classList.toggle('open');
  overlay.classList.toggle('show');
});
document.getElementById('closeSidebar').addEventListener('click', () => {
  sidebar.classList.remove('open');
  overlay.classList.remove('show');
});
overlay.addEventListener('click', () => {
  sidebar.classList.remove('open');
  overlay.classList.remove('show');
});

// ===== MODAL HELPERS =====
function openModal(id) {
  document.getElementById(id).classList.add('open');
}
function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}
// Close modal on overlay click
document.querySelectorAll('.modal-overlay').forEach(o => {
  o.addEventListener('click', e => { if (e.target === o) closeModal(o.id); });
});

// ===== TOAST =====
let toastTimer;
function showToast(msg, type = 'success') {
  const t = document.getElementById('toast');
  const icons = { success: '✅', error: '❌', warning: '⚠️' };
  t.textContent = (icons[type] || '') + ' ' + msg;
  t.className = 'toast show ' + type;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 3000);
}

// ===== CONFIRM DIALOG =====
function confirmDelete(msg, callback) {
  document.getElementById('confirmMessage').textContent = msg;
  openModal('confirmModal');
  const btn = document.getElementById('confirmBtn');
  const handler = () => { callback(); closeModal('confirmModal'); btn.removeEventListener('click', handler); };
  btn.addEventListener('click', handler);
}

// ===== UTILITY =====
function uid() { return '_' + Math.random().toString(36).slice(2, 9); }
function fmt(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr + (dateStr.length <= 7 ? '-01' : ''));
  return d.toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
}
function getStudent(id) { return students.find(s => s.id === id); }
function getRoom(id)    { return rooms.find(r => r.id === id); }
function getRoomByNumber(num) { return rooms.find(r => r.number === num); }

function statusBadge(status) {
  const map = {
    'Available': 'badge-success', 'Occupied': 'badge-warning', 'Maintenance': 'badge-danger',
    'Paid': 'badge-success', 'Pending': 'badge-warning', 'Overdue': 'badge-danger',
    'Open': 'badge-danger', 'In Progress': 'badge-info', 'Resolved': 'badge-success',
    'High': 'badge-danger', 'Medium': 'badge-warning', 'Low': 'badge-success',
  };
  return `<span class="badge ${map[status] || 'badge-secondary'}">${status}</span>`;
}

// ===== DASHBOARD =====
function updateDashboard() {
  const totalRooms  = rooms.length;
  const occupied    = rooms.filter(r => r.status === 'Occupied').length;
  const vacant      = rooms.filter(r => r.status === 'Available').length;
  const totalStu    = students.length;
  const monthRevenue = payments.filter(p => p.status === 'Paid' && p.month === currentMonth()).reduce((a,p) => a + p.amount, 0);
  const pending     = payments.filter(p => p.status === 'Pending' || p.status === 'Overdue').length;

  document.getElementById('stat-total-rooms').textContent = totalRooms;
  document.getElementById('stat-occupied').textContent    = occupied;
  document.getElementById('stat-vacant').textContent      = vacant;
  document.getElementById('stat-students').textContent    = totalStu;
  document.getElementById('stat-revenue').textContent     = '₹' + monthRevenue.toLocaleString('en-IN');
  document.getElementById('stat-pending').textContent     = pending;

  // Recent payments
  const tbody = document.getElementById('dash-payments-body');
  const recent = [...payments].reverse().slice(0, 5);
  tbody.innerHTML = recent.length ? recent.map(p => {
    const stu = getStudent(p.studentId);
    const rm  = stu ? getRoom(stu.room) : null;
    return `<tr>
      <td>${stu ? stu.name : '—'}</td>
      <td>${rm ? rm.number : '—'}</td>
      <td>₹${p.amount.toLocaleString('en-IN')}</td>
      <td>${statusBadge(p.status)}</td>
    </tr>`;
  }).join('') : `<tr><td colspan="4" class="empty-state" style="padding:1.5rem;text-align:center;color:var(--text-muted)">No payments yet</td></tr>`;

  // Active notices
  const noticesList = document.getElementById('dash-notices-list');
  const activeN = notices.slice(0, 4);
  noticesList.innerHTML = activeN.length ? activeN.map(n => `
    <div class="notice-preview-item">
      <div class="notice-dot"></div>
      <div class="notice-text">
        <strong>${n.title}</strong>
        <span>${fmt(n.postedOn)} · ${n.category}</span>
      </div>
    </div>
  `).join('') : `<p style="padding:1rem;color:var(--text-muted);font-size:0.85rem;">No notices posted.</p>`;
}

function currentMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
}

// ===== ROOMS =====
function renderRooms() {
  const typeF   = document.getElementById('roomTypeFilter').value;
  const statusF = document.getElementById('roomStatusFilter').value;
  const grid    = document.getElementById('rooms-grid');

  let list = rooms.filter(r =>
    (!typeF   || r.type   === typeF)   &&
    (!statusF || r.status === statusF)
  );

  if (!list.length) {
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><i class="fa-solid fa-door-closed"></i><p>No rooms found.</p></div>`;
    return;
  }

  const dotClass = { 'Available':'dot-available', 'Occupied':'dot-occupied', 'Maintenance':'dot-maintenance' };
  grid.innerHTML = list.map(r => {
    const stuCount = students.filter(s => s.room === r.id).length;
    return `
    <div class="room-card">
      <div class="room-card-top">
        <div class="room-number">
          <span class="room-status-dot ${dotClass[r.status] || ''}"></span>
          #${r.number}
        </div>
        <span class="room-type-badge">${r.type}</span>
      </div>
      <div class="room-info">Floor: <strong>${r.floor ?? '—'}</strong> &nbsp;|&nbsp; Rent: <strong>₹${r.rent.toLocaleString('en-IN')}/mo</strong></div>
      <div class="room-info">Residents: <strong>${stuCount}</strong> &nbsp;|&nbsp; ${statusBadge(r.status)}</div>
      <div class="room-amenities">
        ${(r.amenities || []).map(a => `<span class="amenity-chip">${a}</span>`).join('')}
      </div>
      <div class="room-card-actions">
        <button class="btn btn-sm btn-secondary" onclick="editRoom('${r.id}')"><i class="fa-solid fa-pen"></i> Edit</button>
        <button class="btn btn-sm btn-danger"    onclick="deleteRoom('${r.id}')"><i class="fa-solid fa-trash"></i></button>
      </div>
    </div>`;
  }).join('');
}

function openRoomModal() {
  document.getElementById('roomModalTitle').textContent = 'Add Room';
  document.getElementById('roomForm').reset();
  document.getElementById('roomId').value = '';
  document.querySelectorAll('.amenity').forEach(c => c.checked = false);
  openModal('roomModal');
}

function editRoom(id) {
  const r = getRoom(id);
  if (!r) return;
  document.getElementById('roomModalTitle').textContent = 'Edit Room';
  document.getElementById('roomId').value     = r.id;
  document.getElementById('roomNumber').value = r.number;
  document.getElementById('roomType').value   = r.type;
  document.getElementById('roomFloor').value  = r.floor;
  document.getElementById('roomRent').value   = r.rent;
  document.getElementById('roomStatus').value = r.status;
  document.querySelectorAll('.amenity').forEach(c => { c.checked = (r.amenities || []).includes(c.value); });
  openModal('roomModal');
}

function submitRoom(e) {
  e.preventDefault();
  const id      = document.getElementById('roomId').value;
  const number  = document.getElementById('roomNumber').value.trim();
  const type    = document.getElementById('roomType').value;
  const floor   = parseInt(document.getElementById('roomFloor').value) || 0;
  const rent    = parseFloat(document.getElementById('roomRent').value);
  const status  = document.getElementById('roomStatus').value;
  const amenities = [...document.querySelectorAll('.amenity:checked')].map(c => c.value);

  // Check duplicate room number (excluding self)
  if (rooms.some(r => r.number === number && r.id !== id)) {
    showToast('Room number already exists!', 'error'); return;
  }

  if (id) {
    const idx = rooms.findIndex(r => r.id === id);
    rooms[idx] = { ...rooms[idx], number, type, floor, rent, status, amenities };
    showToast('Room updated successfully!');
  } else {
    rooms.push({ id: uid(), number, type, floor, rent, status, amenities });
    showToast('Room added successfully!');
  }
  saveAll(); closeModal('roomModal'); renderRooms(); updateDashboard();
  populateStudentRoomSelect();
}

function deleteRoom(id) {
  if (students.some(s => s.room === id)) {
    showToast('Cannot delete — students are assigned to this room!', 'error'); return;
  }
  confirmDelete('Delete this room permanently?', () => {
    rooms = rooms.filter(r => r.id !== id);
    saveAll(); renderRooms(); updateDashboard();
    showToast('Room deleted.', 'warning');
  });
}

// ===== STUDENTS =====
function renderStudents() {
  const search = document.getElementById('studentSearch').value.toLowerCase();
  const roomF  = document.getElementById('studentRoomFilter').value;
  const tbody  = document.getElementById('students-body');

  // Populate room filter
  const roomSel = document.getElementById('studentRoomFilter');
  const curVal  = roomSel.value;
  roomSel.innerHTML = '<option value="">All Rooms</option>' +
    rooms.map(r => `<option value="${r.id}" ${curVal===r.id?'selected':''}>${r.number}</option>`).join('');

  let list = students.filter(s =>
    (!search || s.name.toLowerCase().includes(search) || s.sid.toLowerCase().includes(search)) &&
    (!roomF  || s.room === roomF)
  );

  if (!list.length) {
    tbody.innerHTML = `<tr><td colspan="7"><div class="empty-state"><i class="fa-solid fa-user-slash"></i><p>No students found.</p></div></td></tr>`;
    return;
  }

  tbody.innerHTML = list.map(s => {
    const rm = getRoom(s.room);
    return `<tr>
      <td><span style="font-size:0.75rem;color:var(--text-muted)">${s.sid}</span></td>
      <td><strong>${s.name}</strong></td>
      <td>${s.course} (${s.year})</td>
      <td>${rm ? '#' + rm.number : '—'}</td>
      <td>${s.phone}</td>
      <td>${fmt(s.joinDate)}</td>
      <td>
        <div class="action-btns">
          <button class="btn btn-sm btn-secondary" onclick="editStudent('${s.id}')"><i class="fa-solid fa-pen"></i></button>
          <button class="btn btn-sm btn-danger"    onclick="deleteStudent('${s.id}')"><i class="fa-solid fa-trash"></i></button>
        </div>
      </td>
    </tr>`;
  }).join('');
}

function populateStudentRoomSelect() {
  const sel = document.getElementById('studentRoom');
  const cur = sel.value;
  sel.innerHTML = '<option value="">Select Room</option>' +
    rooms.map(r => `<option value="${r.id}" ${cur===r.id?'selected':''}>#${r.number} (${r.type}) - ${r.status}</option>`).join('');
}

function openStudentModal() {
  document.getElementById('studentModalTitle').textContent = 'Add Student';
  document.getElementById('studentForm').reset();
  document.getElementById('studentId').value = '';
  document.getElementById('studentJoinDate').value = new Date().toISOString().split('T')[0];
  populateStudentRoomSelect();
  openModal('studentModal');
}

function editStudent(id) {
  const s = getStudent(id);
  if (!s) return;
  document.getElementById('studentModalTitle').textContent = 'Edit Student';
  document.getElementById('studentId').value           = s.id;
  document.getElementById('studentSID').value          = s.sid;
  document.getElementById('studentName').value         = s.name;
  document.getElementById('studentCourse').value       = s.course;
  document.getElementById('studentYear').value         = s.year;
  document.getElementById('studentPhone').value        = s.phone;
  document.getElementById('studentEmail').value        = s.email;
  document.getElementById('studentJoinDate').value     = s.joinDate;
  document.getElementById('studentGuardian').value     = s.guardian;
  document.getElementById('studentGuardianPhone').value= s.guardianPhone;
  populateStudentRoomSelect();
  document.getElementById('studentRoom').value         = s.room;
  openModal('studentModal');
}

function submitStudent(e) {
  e.preventDefault();
  const id    = document.getElementById('studentId').value;
  const sid   = document.getElementById('studentSID').value.trim();
  const name  = document.getElementById('studentName').value.trim();
  const course= document.getElementById('studentCourse').value.trim();
  const year  = document.getElementById('studentYear').value;
  const phone = document.getElementById('studentPhone').value.trim();
  const email = document.getElementById('studentEmail').value.trim();
  const room  = document.getElementById('studentRoom').value;
  const joinDate = document.getElementById('studentJoinDate').value;
  const guardian = document.getElementById('studentGuardian').value.trim();
  const guardianPhone = document.getElementById('studentGuardianPhone').value.trim();

  if (phone.length !== 10 || isNaN(phone)) { showToast('Phone must be 10 digits!', 'error'); return; }
  if (students.some(s => s.sid === sid && s.id !== id)) { showToast('Student ID already exists!', 'error'); return; }

  if (id) {
    const idx = students.findIndex(s => s.id === id);
    students[idx] = { ...students[idx], sid, name, course, year, phone, email, room, joinDate, guardian, guardianPhone };
    showToast('Student updated!');
  } else {
    students.push({ id: uid(), sid, name, course, year, phone, email, room, joinDate, guardian, guardianPhone });
    // Auto-mark room occupied
    const rm = getRoom(room);
    if (rm && rm.status === 'Available') { rm.status = 'Occupied'; }
    showToast('Student added!');
  }
  saveAll(); closeModal('studentModal'); renderStudents(); updateDashboard();
}

function deleteStudent(id) {
  confirmDelete('Delete this student record? Their payment history will remain.', () => {
    students = students.filter(s => s.id !== id);
    saveAll(); renderStudents(); updateDashboard();
    showToast('Student removed.', 'warning');
  });
}

// ===== PAYMENTS =====
function renderPayments() {
  const statusF = document.getElementById('paymentStatusFilter').value;
  const monthF  = document.getElementById('paymentMonthFilter').value;
  const tbody   = document.getElementById('payments-body');

  let list = payments.filter(p =>
    (!statusF || p.status === statusF) &&
    (!monthF  || p.month  === monthF)
  );

  if (!list.length) {
    tbody.innerHTML = `<tr><td colspan="8"><div class="empty-state"><i class="fa-solid fa-file-invoice-dollar"></i><p>No payments found.</p></div></td></tr>`;
    return;
  }

  tbody.innerHTML = list.map((p, i) => {
    const stu = getStudent(p.studentId);
    const rm  = stu ? getRoom(stu.room) : null;
    return `<tr>
      <td>${i+1}</td>
      <td><strong>${stu ? stu.name : '—'}</strong></td>
      <td>${rm ? '#' + rm.number : '—'}</td>
      <td>${fmt(p.month)}</td>
      <td>₹${p.amount.toLocaleString('en-IN')}<br><span style="font-size:0.72rem;color:var(--text-muted)">${p.mode}</span></td>
      <td>${fmt(p.paidOn)}</td>
      <td>${statusBadge(p.status)}</td>
      <td>
        <div class="action-btns">
          <button class="btn btn-sm btn-secondary" onclick="editPayment('${p.id}')"><i class="fa-solid fa-pen"></i></button>
          <button class="btn btn-sm btn-danger"    onclick="deletePayment('${p.id}')"><i class="fa-solid fa-trash"></i></button>
        </div>
      </td>
    </tr>`;
  }).join('');
}

function populatePaymentStudentSelect() {
  const sel = document.getElementById('paymentStudent');
  const cur = sel.value;
  sel.innerHTML = '<option value="">Select Student</option>' +
    students.map(s => `<option value="${s.id}" ${cur===s.id?'selected':''}>${s.name} (${s.sid})</option>`).join('');
}

function openPaymentModal() {
  document.getElementById('paymentForm').reset();
  document.getElementById('paymentId').value = '';
  document.getElementById('paymentDate').value = new Date().toISOString().split('T')[0];
  document.getElementById('paymentMonth').value = currentMonth();
  populatePaymentStudentSelect();
  openModal('paymentModal');
}

function editPayment(id) {
  const p = payments.find(x => x.id === id);
  if (!p) return;
  document.getElementById('paymentId').value     = p.id;
  document.getElementById('paymentMonth').value  = p.month;
  document.getElementById('paymentAmount').value = p.amount;
  document.getElementById('paymentDate').value   = p.paidOn;
  document.getElementById('paymentMode').value   = p.mode;
  document.getElementById('paymentStatus').value = p.status;
  document.getElementById('paymentRemarks').value= p.remarks;
  populatePaymentStudentSelect();
  document.getElementById('paymentStudent').value= p.studentId;
  openModal('paymentModal');
}

function autoFillRent() {
  const stuId = document.getElementById('paymentStudent').value;
  const stu   = getStudent(stuId);
  if (!stu) return;
  const rm = getRoom(stu.room);
  if (rm) document.getElementById('paymentAmount').value = rm.rent;
}

function submitPayment(e) {
  e.preventDefault();
  const id        = document.getElementById('paymentId').value;
  const studentId = document.getElementById('paymentStudent').value;
  const month     = document.getElementById('paymentMonth').value;
  const amount    = parseFloat(document.getElementById('paymentAmount').value);
  const paidOn    = document.getElementById('paymentDate').value;
  const mode      = document.getElementById('paymentMode').value;
  const status    = document.getElementById('paymentStatus').value;
  const remarks   = document.getElementById('paymentRemarks').value.trim();

  if (id) {
    const idx = payments.findIndex(p => p.id === id);
    payments[idx] = { ...payments[idx], studentId, month, amount, paidOn, mode, status, remarks };
    showToast('Payment updated!');
  } else {
    payments.push({ id: uid(), studentId, month, amount, paidOn, mode, status, remarks });
    showToast('Payment recorded!');
  }
  saveAll(); closeModal('paymentModal'); renderPayments(); updateDashboard();
}

function deletePayment(id) {
  confirmDelete('Delete this payment record?', () => {
    payments = payments.filter(p => p.id !== id);
    saveAll(); renderPayments(); updateDashboard();
    showToast('Payment deleted.', 'warning');
  });
}

// ===== COMPLAINTS =====
function renderComplaints() {
  const statusF = document.getElementById('complaintStatusFilter').value;
  const list    = document.getElementById('complaints-list');

  let filtered = complaints.filter(c => !statusF || c.status === statusF).reverse();

  if (!filtered.length) {
    list.innerHTML = `<div class="empty-state"><i class="fa-solid fa-face-smile"></i><p>No complaints found. Great!</p></div>`;
    return;
  }

  const catIcons = { Plumbing:'fa-droplet', Electrical:'fa-bolt', Housekeeping:'fa-broom', Internet:'fa-wifi', Noise:'fa-volume-high', Other:'fa-circle-exclamation' };
  const priorityClass = { High:'priority-high', Medium:'priority-medium', Low:'priority-low' };

  list.innerHTML = filtered.map(c => {
    const stu = getStudent(c.studentId);
    const rm  = stu ? getRoom(stu.room) : null;
    const icon = catIcons[c.category] || 'fa-circle-exclamation';
    return `
    <div class="complaint-card">
      <div class="complaint-icon ${priorityClass[c.priority]}">
        <i class="fa-solid ${icon}"></i>
      </div>
      <div class="complaint-body">
        <div class="complaint-header">
          <span class="complaint-title">${c.category} Issue</span>
          ${statusBadge(c.status)}
        </div>
        <div class="complaint-meta">
          <i class="fa-solid fa-user" style="font-size:0.7rem"></i> ${stu ? stu.name : '—'}
          &nbsp;·&nbsp; <i class="fa-solid fa-door-open" style="font-size:0.7rem"></i> Room ${rm ? rm.number : '—'}
          &nbsp;·&nbsp; ${fmt(c.date)}
          &nbsp;·&nbsp; Priority: ${statusBadge(c.priority)}
        </div>
        <div class="complaint-desc">${c.desc}</div>
      </div>
      <div class="complaint-actions">
        <button class="btn btn-sm btn-secondary" onclick="editComplaint('${c.id}')"><i class="fa-solid fa-pen"></i></button>
        <button class="btn btn-sm btn-danger"    onclick="deleteComplaint('${c.id}')"><i class="fa-solid fa-trash"></i></button>
      </div>
    </div>`;
  }).join('');
}

function populateComplaintStudentSelect() {
  const sel = document.getElementById('complaintStudent');
  const cur = sel.value;
  sel.innerHTML = '<option value="">Select Student</option>' +
    students.map(s => `<option value="${s.id}" ${cur===s.id?'selected':''}>${s.name} (${s.sid})</option>`).join('');
}

function openComplaintModal() {
  document.getElementById('complaintForm').reset();
  document.getElementById('complaintId').value = '';
  populateComplaintStudentSelect();
  openModal('complaintModal');
}

function editComplaint(id) {
  const c = complaints.find(x => x.id === id);
  if (!c) return;
  document.getElementById('complaintId').value          = c.id;
  document.getElementById('complaintCategory').value    = c.category;
  document.getElementById('complaintDesc').value        = c.desc;
  document.getElementById('complaintPriority').value    = c.priority;
  document.getElementById('complaintStatus').value      = c.status;
  populateComplaintStudentSelect();
  document.getElementById('complaintStudent').value     = c.studentId;
  openModal('complaintModal');
}

function submitComplaint(e) {
  e.preventDefault();
  const id        = document.getElementById('complaintId').value;
  const studentId = document.getElementById('complaintStudent').value;
  const category  = document.getElementById('complaintCategory').value;
  const desc      = document.getElementById('complaintDesc').value.trim();
  const priority  = document.getElementById('complaintPriority').value;
  const status    = document.getElementById('complaintStatus').value;
  const date      = new Date().toISOString().split('T')[0];

  if (id) {
    const idx = complaints.findIndex(c => c.id === id);
    complaints[idx] = { ...complaints[idx], studentId, category, desc, priority, status };
    showToast('Complaint updated!');
  } else {
    complaints.push({ id: uid(), studentId, category, desc, priority, status, date });
    showToast('Complaint submitted!');
  }
  saveAll(); closeModal('complaintModal'); renderComplaints();
}

function deleteComplaint(id) {
  confirmDelete('Delete this complaint?', () => {
    complaints = complaints.filter(c => c.id !== id);
    saveAll(); renderComplaints();
    showToast('Complaint deleted.', 'warning');
  });
}

// ===== NOTICES =====
function renderNotices() {
  const grid = document.getElementById('notices-grid');
  const catColors = { General:'badge-secondary', Maintenance:'badge-warning', Rules:'badge-info', Event:'badge-success', Emergency:'badge-danger' };
  const catClass  = { General:'', Maintenance:'cat-maintenance', Rules:'cat-rules', Event:'cat-event', Emergency:'cat-emergency' };

  if (!notices.length) {
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><i class="fa-solid fa-bell-slash"></i><p>No notices posted yet.</p></div>`;
    return;
  }

  grid.innerHTML = [...notices].reverse().map(n => `
    <div class="notice-card ${catClass[n.category] || ''}">
      <div class="notice-header">
        <span class="notice-title">${n.title}</span>
        <span class="badge ${catColors[n.category] || 'badge-secondary'} notice-category">${n.category}</span>
      </div>
      <div class="notice-content">${n.content}</div>
      <div class="notice-footer">
        <span><i class="fa-solid fa-calendar-days"></i> ${fmt(n.postedOn)}</span>
        <div style="display:flex;gap:0.4rem;">
          ${n.expiry ? `<span style="color:var(--warning)"><i class="fa-solid fa-clock"></i> Expires ${fmt(n.expiry)}</span>` : ''}
          <button class="btn btn-sm btn-secondary" onclick="deleteNotice('${n.id}')"><i class="fa-solid fa-trash"></i></button>
        </div>
      </div>
    </div>
  `).join('');
}

function openNoticeModal() {
  document.getElementById('noticeForm').reset();
  document.getElementById('noticeId').value = '';
  openModal('noticeModal');
}

function submitNotice(e) {
  e.preventDefault();
  const id       = document.getElementById('noticeId').value;
  const title    = document.getElementById('noticeTitle').value.trim();
  const content  = document.getElementById('noticeContent').value.trim();
  const category = document.getElementById('noticeCategory').value;
  const expiry   = document.getElementById('noticeExpiry').value;
  const postedOn = new Date().toISOString().split('T')[0];

  notices.push({ id: uid(), title, content, category, postedOn, expiry });
  saveAll(); closeModal('noticeModal'); renderNotices(); updateDashboard();
  showToast('Notice posted!');
}

function deleteNotice(id) {
  confirmDelete('Delete this notice?', () => {
    notices = notices.filter(n => n.id !== id);
    saveAll(); renderNotices(); updateDashboard();
    showToast('Notice removed.', 'warning');
  });
}

// ===== WIRE UP "Add" buttons on nav pages =====
// (Buttons in the HTML already call the right functions)

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  navigateTo('dashboard');
});
