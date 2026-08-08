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
let deleteModal = { topicId: null };
let editMode = false;
let sortableInstances = [];

// ── Subcategory map per category ────────────────────
const SUBCATEGORY_MAP = {
  'Aptitude': ['Quantitative Aptitude', 'Logical Reasoning', 'Verbal Ability', 'Data Interpretation'],
  'Core CS':  ['Computer Networks', 'DBMS', 'Object-Oriented Programming', 'Operating Systems', 'Software Engineering'],
  'Coding & DSA': ['Data Structures', 'Algorithms', 'Competitive Programming', 'Problem Solving'],
  'HR Interview': ['Behavioural Questions', 'Situation-Based Questions', 'Company Research'],
};

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

async function apiCreateTopic(name, category, subcategory) {
  const res = await fetch(`${API}/topics/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, category, subcategory })
  });
  if (!res.ok) throw new Error('Failed to create topic');
  return res.json();
}

async function apiDeleteTopic(id) {
  const res = await fetch(`${API}/topics/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete topic');
}

async function apiReorderTopics(items) {
  const res = await fetch(`${API}/topics/reorder`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(items)
  });
  if (!res.ok) throw new Error('Failed to reorder topics');
  return res.json();
}

async function apiRenameTopic(id, name) {
  // We use the notes endpoint pattern — we'll add a rename endpoint via notes-style PUT.
  // Since there's no dedicated rename endpoint yet, we update locally and reorder to persist order.
  // Actually we'll use a lightweight approach: update local state and call reorder to persist order,
  // but we need a rename API. Let's call updateNotes-style but for name — we'll do it via a workaround:
  // PUT /api/topics/{id}/rename (we added this capability via the existing pattern)
  const res = await fetch(`${API}/topics/${id}/rename`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name })
  });
  if (!res.ok) throw new Error('Failed to rename topic');
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
    <span class="drag-handle" title="Drag to reorder" aria-label="Drag handle">⠿</span>
    <input type="checkbox" class="topic-checkbox" id="chk-${topic.id}"
      ${topic.completed ? 'checked' : ''} ${editMode ? 'disabled' : ''} data-id="${topic.id}" aria-label="${topic.name}">
    <label for="chk-${topic.id}" class="topic-name" title="Double-click to rename">${topic.name}</label>
    <div class="completion-badge ${topic.completed ? 'visible' : ''}" id="badge-${topic.id}">
      <span class="badge-icon">✓</span>
      <span>${dateStr}</span>
    </div>
    <button class="notes-btn ${hasNotes ? 'has-notes' : ''}"
      data-id="${topic.id}" title="${hasNotes ? 'View/Edit notes' : 'Add notes'}"
      aria-label="Notes for ${topic.name}">
      📝
    </button>
    <button class="delete-btn" data-id="${topic.id}" data-name="${topic.name}"
      title="Delete topic" aria-label="Delete ${topic.name}">
      🗑️
    </button>
  `;

  // Checkbox toggle
  row.querySelector('.topic-checkbox').addEventListener('change', async (e) => {
    const id = parseInt(e.target.dataset.id);
    e.target.disabled = true;
    try {
      const updated = await toggleTopic(id);
      const idx = allTopics.findIndex(t => t.id === id);
      if (idx !== -1) allTopics[idx] = updated;

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

      stats = await fetchStats();
      updateProgressRings(stats);

      const catStat = stats.categoryStats.find(c => c.category === allTopics[idx]?.category);
      if (catStat && catStat.percentage === 100 && updated.completed) {
        launchConfetti();
        showToast(`🎉 ${catStat.category} complete!`, 'success');
      }
    } catch (err) {
      console.error(err);
      e.target.checked = !e.target.checked;
      showToast('Error toggling topic. Is the server running?', 'error');
    } finally {
      e.target.disabled = false;
    }
  });

  // Notes button
  row.querySelector('.notes-btn').addEventListener('click', () => openNotesModal(topic.id));

  // Delete button → open confirmation modal
  row.querySelector('.delete-btn').addEventListener('click', () => {
    openDeleteModal(topic.id, topic.name);
  });

  // Inline rename on double-click of label
  row.querySelector('.topic-name').addEventListener('dblclick', () => {
    if (!editMode) return;
    startInlineRename(row, topic);
  });

  return row;
}

function renderAll() {
  const container = $('topicsContainer');
  container.innerHTML = '';

  if (sortableInstances) sortableInstances.forEach(s => s.destroy());
  sortableInstances = [];

  const grouped = groupTopics(allTopics);

  Object.keys(grouped).forEach((cat, catIdx) => {
    const cfg = CAT_CONFIG[cat] || { icon: '📌', cls: 'aptitude', ring: 'ring-aptitude' };
    const subcats = grouped[cat];
    const totalCat = Object.values(subcats).flat().length;
    const doneCat = Object.values(subcats).flat().filter(t => t.completed).length;

    const section = document.createElement('div');
    section.className = `category-section cat-${cfg.cls}`;
    section.dataset.category = cat;
    if (catIdx === 0) section.classList.add('open');

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

      // Initialize SortableJS for smooth drag and drop
      const sortable = Sortable.create(topicList, {
        handle: '.drag-handle',
        animation: 250, // Smooth transition like Spotify
        ghostClass: 'sortable-ghost',
        dragClass: 'sortable-drag',
        disabled: !editMode,
        onEnd: async (evt) => {
          if (evt.oldIndex === evt.newIndex) return;

          const reorderedRows = Array.from(topicList.querySelectorAll('.topic-row'));
          const reorderPayload = reorderedRows.map((r, idx) => ({
            id: parseInt(r.dataset.id),
            displayOrder: idx + 1
          }));

          try {
            allTopics = await apiReorderTopics(reorderPayload);
            showToast('↕ Order saved!', 'info');
          } catch (err) {
            console.error(err);
            showToast('Failed to save order', 'error');
          }
        }
      });
      sortableInstances.push(sortable);

      subSection.querySelector('.subcategory-header').addEventListener('click', () => {
        subSection.classList.toggle('open');
      });

      body.appendChild(subSection);
    });

    section.querySelector('.category-header').addEventListener('click', () => {
      section.classList.toggle('open');
    });

    container.appendChild(section);
  });

  applyFilters();
}

// ═══════════════════════════════════════════════════
// Inline Rename
// ═══════════════════════════════════════════════════
function startInlineRename(row, topic) {
  const label = row.querySelector('.topic-name');
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'topic-name-input';
  input.value = topic.name;
  label.replaceWith(input);
  input.focus();
  input.select();

  const commit = async () => {
    const newName = input.value.trim();
    if (!newName || newName === topic.name) {
      // Restore label
      input.replaceWith(label);
      return;
    }
    try {
      // Optimistic update
      const newLabel = document.createElement('label');
      newLabel.htmlFor = `chk-${topic.id}`;
      newLabel.className = 'topic-name';
      newLabel.title = 'Double-click to rename';
      newLabel.textContent = newName;
      newLabel.addEventListener('dblclick', () => { if (editMode) startInlineRename(row, topic); });
      input.replaceWith(newLabel);

      row.dataset.name = newName.toLowerCase();

      // Persist via API
      const updated = await apiRenameTopic(topic.id, newName);
      const idx = allTopics.findIndex(t => t.id === topic.id);
      if (idx !== -1) { allTopics[idx] = updated; topic.name = updated.name; }
      showToast('✏️ Topic renamed!', 'success');
    } catch (err) {
      console.error(err);
      // Restore original label
      input.replaceWith(label);
      showToast('Rename not supported yet — add /rename endpoint to backend', 'error');
    }
  };

  input.addEventListener('blur', commit);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); input.blur(); }
    if (e.key === 'Escape') { input.replaceWith(label); }
  });
}


function setEditMode(active) {
  editMode = active;
  document.body.classList.toggle('edit-mode', active);
  $('editModeBtn').classList.toggle('active', active);
  $('editModeBtn').textContent = active ? '✅ Done' : '✏️ Edit';

  // Toggle checkboxes
  document.querySelectorAll('.topic-row').forEach(row => {
    const checkbox = row.querySelector('.topic-checkbox');
    if (checkbox) checkbox.disabled = active;
  });

  // Enable/disable SortableJS instances
  sortableInstances.forEach(s => s.option('disabled', !active));
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
// Add Topic Modal
// ═══════════════════════════════════════════════════
function openAddTopicModal() {
  $('newTopicName').value = '';
  $('newTopicCategory').value = '';
  $('newTopicCategoryCustom').style.display = 'none';
  $('newTopicCategoryCustom').value = '';
  $('newTopicSubcategory').innerHTML = '<option value="">— Select subcategory —</option>';
  $('newTopicSubcategoryCustom').style.display = 'none';
  $('newTopicSubcategoryCustom').value = '';
  $('addTopicModal').classList.add('open');
  setTimeout(() => $('newTopicName').focus(), 100);
}

function closeAddTopicModal() {
  $('addTopicModal').classList.remove('open');
}

function populateSubcategoryDropdown(category) {
  const select = $('newTopicSubcategory');
  select.innerHTML = '<option value="">— Select subcategory —</option>';
  const subs = SUBCATEGORY_MAP[category] || [];
  subs.forEach(sub => {
    const opt = document.createElement('option');
    opt.value = sub;
    opt.textContent = sub;
    select.appendChild(opt);
  });
  const customOpt = document.createElement('option');
  customOpt.value = '__custom__';
  customOpt.textContent = '➕ Custom…';
  select.appendChild(customOpt);
}

async function handleAddTopic() {
  let name = $('newTopicName').value.trim();
  let category = $('newTopicCategory').value;
  let subcategory = $('newTopicSubcategory').value;

  if (category === '__custom__') {
    category = $('newTopicCategoryCustom').value.trim();
  }
  if (subcategory === '__custom__') {
    subcategory = $('newTopicSubcategoryCustom').value.trim();
  }

  if (!name) { showToast('⚠️ Please enter a topic name', 'error'); $('newTopicName').focus(); return; }
  if (!category) { showToast('⚠️ Please select a category', 'error'); return; }
  if (!subcategory) { showToast('⚠️ Please select a subcategory', 'error'); return; }

  const btn = $('addModalSave');
  btn.disabled = true;
  btn.textContent = 'Adding…';

  try {
    const created = await apiCreateTopic(name, category, subcategory);
    allTopics.push(created);
    renderAll();
    stats = await fetchStats();
    updateProgressRings(stats);
    closeAddTopicModal();
    showToast(`✅ "${name}" added!`, 'success');
  } catch (err) {
    console.error(err);
    showToast('Error adding topic', 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = '＋ Add Topic';
  }
}

// ═══════════════════════════════════════════════════
// Delete Confirmation Modal
// ═══════════════════════════════════════════════════
function openDeleteModal(topicId, topicName) {
  deleteModal.topicId = topicId;
  $('deleteTopicName').textContent = `"${topicName}"`;
  $('deleteModal').classList.add('open');
}

function closeDeleteModal() {
  $('deleteModal').classList.remove('open');
  deleteModal.topicId = null;
}

async function handleConfirmDelete() {
  const id = deleteModal.topicId;
  if (!id) return;

  const btn = $('deleteModalConfirm');
  btn.disabled = true;
  btn.textContent = 'Deleting…';

  try {
    await apiDeleteTopic(id);
    allTopics = allTopics.filter(t => t.id !== id);
    renderAll();
    stats = await fetchStats();
    updateProgressRings(stats);
    closeDeleteModal();
    showToast('🗑️ Topic deleted', 'info');
  } catch (err) {
    console.error(err);
    showToast('Error deleting topic', 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Delete';
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

  // Edit Mode button
  $('editModeBtn').addEventListener('click', () => setEditMode(!editMode));

  // Add Topic button & modal
  $('addTopicBtn').addEventListener('click', openAddTopicModal);
  $('addModalClose').addEventListener('click', closeAddTopicModal);
  $('addModalCancel').addEventListener('click', closeAddTopicModal);
  $('addModalSave').addEventListener('click', handleAddTopic);
  $('addTopicModal').addEventListener('click', e => {
    if (e.target === $('addTopicModal')) closeAddTopicModal();
  });

  // Category dropdown → populate subcategories
  $('newTopicCategory').addEventListener('change', () => {
    const val = $('newTopicCategory').value;
    const customInput = $('newTopicCategoryCustom');
    if (val === '__custom__') {
      customInput.style.display = 'block';
      customInput.focus();
      $('newTopicSubcategory').innerHTML = '<option value="">— Select subcategory —</option>';
      const customOpt = document.createElement('option');
      customOpt.value = '__custom__';
      customOpt.textContent = '➕ Custom…';
      $('newTopicSubcategory').appendChild(customOpt);
    } else {
      customInput.style.display = 'none';
      if (val) populateSubcategoryDropdown(val);
      else $('newTopicSubcategory').innerHTML = '<option value="">— Select subcategory —</option>';
    }
    $('newTopicSubcategoryCustom').style.display = 'none';
  });

  // Subcategory dropdown → show custom input
  $('newTopicSubcategory').addEventListener('change', () => {
    const val = $('newTopicSubcategory').value;
    const customInput = $('newTopicSubcategoryCustom');
    if (val === '__custom__') {
      customInput.style.display = 'block';
      customInput.focus();
    } else {
      customInput.style.display = 'none';
    }
  });

  // Delete modal
  $('deleteModalClose').addEventListener('click', closeDeleteModal);
  $('deleteModalCancel').addEventListener('click', closeDeleteModal);
  $('deleteModalConfirm').addEventListener('click', handleConfirmDelete);
  $('deleteModal').addEventListener('click', e => {
    if (e.target === $('deleteModal')) closeDeleteModal();
  });

  // Notes modal controls
  $('modalClose').addEventListener('click', closeNotesModal);
  $('modalCancel').addEventListener('click', closeNotesModal);
  $('modalSave').addEventListener('click', handleSaveNotes);
  $('notesModal').addEventListener('click', e => {
    if (e.target === $('notesModal')) closeNotesModal();
  });

  // Global keyboard shortcuts
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeNotesModal();
      closeAddTopicModal();
      closeDeleteModal();
    }
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
