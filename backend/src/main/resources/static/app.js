/* ═══════════════════════════════════════════════════ */
/* app.js — Placement Prep Tracker                     */
/* ═══════════════════════════════════════════════════ */

const API = '/api';

// ── State ───────────────────────────────────────────
let allTopics = [];
let stats = null;
let activeFilter = 'all';   // 'all' | 'done' | 'pending'
let searchQuery = '';
let notesModal = { topicId: null };

// ── Category config (display + slugs) ───────────────
const CAT_CONFIG = {
  'Aptitude': { icon: '🧮', cls: 'aptitude', ring: 'ring-aptitude' },
  'Core CS': { icon: '💻', cls: 'corecs', ring: 'ring-corecs' },
  'Coding & DSA': { icon: '⚡', cls: 'dsa', ring: 'ring-dsa' },
  'HR Interview': { icon: '🤝', cls: 'hr', ring: 'ring-hr' },
};

// ── Utility ─────────────────────────────────────────
const $ = id => document.getElementById(id);

function formatDate(isoStr) {
  if (!isoStr) return '';
  const d = new Date(isoStr);
  return d.toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

// ── Toast notification ───────────────────────────────
function showToast(msg, type = 'info') {
  const container = $('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// ── Confetti burst ───────────────────────────────────
function launchConfetti() {
  const colors = ['#a78bfa', '#38bdf8', '#34d399', '#fb923c', '#f472b6', '#facc15'];
  for (let i = 0; i < 60; i++) {
    const p = document.createElement('div');
    p.className = 'confetti-piece';
    p.style.cssText = `
      left: ${Math.random() * 100}vw;
      top: 0;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      animation-duration: ${1.2 + Math.random() * 1.5}s;
      animation-delay: ${Math.random() * 0.4}s;
      width: ${6 + Math.random() * 8}px;
      height: ${6 + Math.random() * 8}px;
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
    `;
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 3000);
  }
}

// ═══════════════════════════════════════════════════
// API Calls
// ═══════════════════════════════════════════════════
async function fetchTopics() {
  const res = await fetch(`${API}/topics`);
  if (!res.ok) throw new Error('Failed to fetch topics');
  return res.json();
}

async function fetchStats() {
  const res = await fetch(`${API}/stats`);
  if (!res.ok) throw new Error('Failed to fetch stats');
  return res.json();
}

async function toggleTopic(id) {
  const res = await fetch(`${API}/topics/${id}/toggle`, { method: 'PUT' });
  if (!res.ok) throw new Error('Failed to toggle topic');
  return res.json();
}

async function saveNotes(id, notes) {
  const res = await fetch(`${API}/topics/${id}/notes`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ notes })
  });
  if (!res.ok) throw new Error('Failed to save notes');
  return res.json();
}

// ═══════════════════════════════════════════════════
// Progress Rings
// ═══════════════════════════════════════════════════
function updateProgressRings(statsData) {
  const circumference = 245; // 2π × 39 ≈ 245

  // Overall banner
  const overallPct = statsData.overallPercentage;
  $('overallPct').textContent = overallPct.toFixed(1) + '%';
  $('overallCount').textContent = `${statsData.completedTopics} / ${statsData.totalTopics} topics`;
  setTimeout(() => {
    $('overallBarFill').style.width = overallPct + '%';
  }, 100);

  // Per-category rings
  statsData.categoryStats.forEach(cat => {
    const cfg = CAT_CONFIG[cat.category];
    if (!cfg) return;
    const ringId = cfg.ring;
    const fill = document.querySelector(`.${ringId} .ring-fill`);
    const pctEl = document.querySelector(`.${ringId} .ring-pct`);
    const doneEl = document.querySelector(`.${ringId} .ring-done`);
    if (!fill) return;

    const offset = circumference - (cat.percentage / 100) * circumference;
    setTimeout(() => {
      fill.style.strokeDashoffset = offset;
    }, 200);
    if (pctEl) pctEl.textContent = cat.percentage.toFixed(0) + '%';
    if (doneEl) doneEl.textContent = `${cat.completed}/${cat.total}`;

    // Mini bar in category header
    const miniBar = document.querySelector(`[data-cat="${cat.category}"] .cat-mini-fill`);
    const miniText = document.querySelector(`[data-cat="${cat.category}"] .cat-progress-text`);
    if (miniBar) setTimeout(() => { miniBar.style.width = cat.percentage + '%'; }, 200);
    if (miniText) miniText.textContent = `${cat.completed} / ${cat.total} done`;
  });
}

// ═══════════════════════════════════════════════════
// Render
// ═══════════════════════════════════════════════════
function groupTopics(topics) {
  const cats = {};
  topics.forEach(t => {
    if (!cats[t.category]) cats[t.category] = {};
    if (!cats[t.category][t.subcategory]) cats[t.category][t.subcategory] = [];
    cats[t.category][t.subcategory].push(t);
  });
  return cats;
}

function renderTopicRow(topic) {
  const row = document.createElement('div');
  row.className = `topic-row ${topic.completed ? 'completed' : ''}`;
  row.dataset.id = topic.id;
  row.dataset.name = topic.name.toLowerCase();
  row.dataset.completed = topic.completed ? '1' : '0';

  const dateStr = topic.completedAt ? formatDate(topic.completedAt) : '';
  const hasNotes = topic.notes && topic.notes.trim().length > 0;

  row.innerHTML = `
    <input type="checkbox" class="topic-checkbox" id="chk-${topic.id}"
      ${topic.completed ? 'checked' : ''} data-id="${topic.id}" aria-label="${topic.name}">
    <label for="chk-${topic.id}" class="topic-name">${topic.name}</label>
    <div class="completion-badge ${topic.completed ? 'visible' : ''}" id="badge-${topic.id}">
      <span class="badge-icon">✓</span>
      <span>${dateStr}</span>
    </div>
    <button class="notes-btn ${hasNotes ? 'has-notes' : ''}"
      data-id="${topic.id}" title="${hasNotes ? 'View/Edit notes' : 'Add notes'}"
      aria-label="Notes for ${topic.name}">
      📝
    </button>
  `;

  // Checkbox toggle
  row.querySelector('.topic-checkbox').addEventListener('change', async (e) => {
    const id = parseInt(e.target.dataset.id);
    e.target.disabled = true;
    try {
      const updated = await toggleTopic(id);
      // Update local data
      const idx = allTopics.findIndex(t => t.id === id);
      if (idx !== -1) allTopics[idx] = updated;

      // Update row UI
      const badge = $(`badge-${id}`);
      if (updated.completed) {
        row.classList.add('completed');
        row.dataset.completed = '1';
        badge.querySelector('span:last-child').textContent = formatDate(updated.completedAt);
        badge.classList.add('visible');
        showToast(`✅ "${updated.name}" marked done!`, 'success');
      } else {
        row.classList.remove('completed');
        row.dataset.completed = '0';
        badge.classList.remove('visible');
        showToast(`↩ "${updated.name}" reset`, 'info');
      }
      e.target.checked = updated.completed;

      // Refresh stats
      stats = await fetchStats();
      updateProgressRings(stats);

      // Confetti if a category hits 100%
      const catStat = stats.categoryStats.find(c => c.category === allTopics[idx]?.category);
      if (catStat && catStat.percentage === 100 && updated.completed) {
        launchConfetti();
        showToast(`🎉 ${catStat.category} complete!`, 'success');
      }
    } catch (err) {
      console.error(err);
      e.target.checked = !e.target.checked; // revert
      showToast('Error toggling topic. Is the server running?', 'error');
    } finally {
      e.target.disabled = false;
    }
  });

  // Notes button
  row.querySelector('.notes-btn').addEventListener('click', () => openNotesModal(topic.id));

  return row;
}

function renderAll() {
  const container = $('topicsContainer');
  container.innerHTML = '';

  const grouped = groupTopics(allTopics);

  Object.keys(grouped).forEach((cat, catIdx) => {
    const cfg = CAT_CONFIG[cat] || { icon: '📌', cls: 'aptitude', ring: 'ring-aptitude' };
    const subcats = grouped[cat];
    const totalCat = Object.values(subcats).flat().length;
    const doneCat = Object.values(subcats).flat().filter(t => t.completed).length;

    const section = document.createElement('div');
    section.className = `category-section cat-${cfg.cls}`;
    section.dataset.category = cat;
    if (catIdx === 0) section.classList.add('open'); // First open by default

    section.innerHTML = `
      <div class="category-header" data-cat="${cat}">
        <div class="cat-icon">${cfg.icon}</div>
        <div class="cat-info">
          <div class="cat-name">${cat}</div>
          <div class="cat-progress-text">${doneCat} / ${totalCat} done</div>
        </div>
        <div class="cat-mini-bar-wrap">
          <div class="cat-mini-bar">
            <div class="cat-mini-fill" style="width:${totalCat ? doneCat / totalCat * 100 : 0}%"></div>
          </div>
        </div>
        <span class="cat-chevron">▼</span>
      </div>
      <div class="category-body"></div>
    `;

    const body = section.querySelector('.category-body');

    Object.keys(subcats).forEach((sub, subIdx) => {
      const topics = subcats[sub];
      const subSection = document.createElement('div');
      subSection.className = `subcategory-section ${subIdx === 0 ? 'open' : ''}`;

      const doneCount = topics.filter(t => t.completed).length;
      subSection.innerHTML = `
        <div class="subcategory-header">
          <span class="sub-title">${sub}</span>
          <span class="sub-count">${doneCount}/${topics.length}</span>
          <span class="sub-chevron">▾</span>
        </div>
        <div class="topic-list"></div>
      `;

      const topicList = subSection.querySelector('.topic-list');
      topics.forEach(t => topicList.appendChild(renderTopicRow(t)));

      subSection.querySelector('.subcategory-header').addEventListener('click', () => {
        subSection.classList.toggle('open');
      });

      body.appendChild(subSection);
    });

    // Category header toggle
    section.querySelector('.category-header').addEventListener('click', () => {
      section.classList.toggle('open');
    });

    container.appendChild(section);
  });

  applyFilters();
}

// ═══════════════════════════════════════════════════
// Search & Filter
// ═══════════════════════════════════════════════════
function applyFilters() {
  const query = searchQuery.toLowerCase().trim();
  const filter = activeFilter;
  let anyVisible = false;

  document.querySelectorAll('.topic-row').forEach(row => {
    const nameMatch = !query || row.dataset.name.includes(query);
    const isDone = row.dataset.completed === '1';
    const filterMatch =
      filter === 'all' ? true :
        filter === 'done' ? isDone :
          filter === 'pending' ? !isDone : true;

    if (nameMatch && filterMatch) {
      row.classList.remove('hidden');
      anyVisible = true;
    } else {
      row.classList.add('hidden');
    }
  });

  // Show/hide category sections if all rows hidden
  document.querySelectorAll('.category-section').forEach(section => {
    const visible = section.querySelectorAll('.topic-row:not(.hidden)').length;
    section.style.display = visible ? '' : 'none';
  });

  $('noResults').style.display = anyVisible ? 'none' : 'block';
}

// ═══════════════════════════════════════════════════
// Notes Modal
// ═══════════════════════════════════════════════════
function openNotesModal(topicId) {
  const topic = allTopics.find(t => t.id === topicId);
  if (!topic) return;

  notesModal.topicId = topicId;
  $('modalTopicName').textContent = topic.name;
  $('notesTextarea').value = topic.notes || '';
  $('notesModal').classList.add('open');
  setTimeout(() => $('notesTextarea').focus(), 100);
}

function closeNotesModal() {
  $('notesModal').classList.remove('open');
  notesModal.topicId = null;
}

async function handleSaveNotes() {
  const id = notesModal.topicId;
  if (!id) return;
  const notes = $('notesTextarea').value.trim();
  try {
    const updated = await saveNotes(id, notes);
    const idx = allTopics.findIndex(t => t.id === id);
    if (idx !== -1) allTopics[idx] = updated;

    // Update notes button appearance
    const notesBtn = document.querySelector(`.notes-btn[data-id="${id}"]`);
    if (notesBtn) {
      notesBtn.classList.toggle('has-notes', notes.length > 0);
      notesBtn.title = notes.length > 0 ? 'View/Edit notes' : 'Add notes';
    }
    showToast('📝 Notes saved!', 'success');
    closeNotesModal();
  } catch (err) {
    console.error(err);
    showToast('Error saving notes', 'error');
  }
}

// ═══════════════════════════════════════════════════
// Dark / Light Mode
// ═══════════════════════════════════════════════════
function initTheme() {
  const saved = localStorage.getItem('theme') || 'dark';
  document.body.classList.toggle('light', saved === 'light');
  $('themeToggle').textContent = saved === 'light' ? '🌙' : '☀️';
}

function toggleTheme() {
  const isLight = document.body.classList.toggle('light');
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
  $('themeToggle').textContent = isLight ? '🌙' : '☀️';
}

// ═══════════════════════════════════════════════════
// Bootstrap
// ═══════════════════════════════════════════════════
async function init() {
  initTheme();

  // Theme toggle
  $('themeToggle').addEventListener('click', toggleTheme);

  // Search
  $('searchInput').addEventListener('input', e => {
    searchQuery = e.target.value;
    console.log(searchQuery);
    applyFilters();
  });

  // Filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.filter;
      applyFilters();
    });
  });

  // Modal controls
  $('modalClose').addEventListener('click', closeNotesModal);
  $('modalCancel').addEventListener('click', closeNotesModal);
  $('modalSave').addEventListener('click', handleSaveNotes);
  $('notesModal').addEventListener('click', e => {
    if (e.target === $('notesModal')) closeNotesModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeNotesModal();
  });

  // Load data
  try {
    $('topicsContainer').innerHTML = `
      <div class="loader">
        <div class="spinner"></div>
        <p>Loading your preparation checklist...</p>
      </div>`;

    [allTopics, stats] = await Promise.all([fetchTopics(), fetchStats()]);
    renderAll();
    updateProgressRings(stats);
  } catch (err) {
    console.error(err);
    $('topicsContainer').innerHTML = `
      <div class="loader">
        <p>⚠️ Could not connect to backend.<br>
        Make sure Spring Boot is running on port 8080.</p>
      </div>`;
  }
}

document.addEventListener('DOMContentLoaded', init);
