/**
 * Semantic Dictionary — Frontend Application
 * Live search, bookmarks, keyboard navigation, and copy-to-clipboard.
 */

(() => {
  'use strict';

  // --- DOM Elements ---
  const searchInput = document.getElementById('search-input');
  const searchClear = document.getElementById('search-clear');
  const searchLoading = document.getElementById('search-loading');
  const modeToggle = document.getElementById('mode-toggle');
  const resultsGrid = document.getElementById('results-grid');
  const resultsMeta = document.getElementById('results-meta');
  const resultsCount = document.getElementById('results-count');
  const emptyState = document.getElementById('empty-state');
  const discoverySection = document.getElementById('discovery-section');
  const discoveryGrid = document.getElementById('discovery-grid');
  const bookmarksToggle = document.getElementById('bookmarks-toggle');
  const bookmarksBadge = document.getElementById('bookmarks-badge');
  const bookmarksDrawer = document.getElementById('bookmarks-drawer');
  const bookmarksOverlay = document.getElementById('bookmarks-overlay');
  const bookmarksClose = document.getElementById('bookmarks-close');
  const bookmarksList = document.getElementById('bookmarks-list');
  const bookmarksEmpty = document.getElementById('bookmarks-empty');
  const toast = document.getElementById('toast');

  // --- State ---
  let currentMode = 'semantic';
  let searchTimeout = null;
  let currentResults = [];
  let bookmarks = JSON.parse(localStorage.getItem('sd-bookmarks') || '[]');
  let toastTimeout = null;

  // --- Placeholders per mode ---
  const PLACEHOLDERS = {
    semantic: 'Describe the word you\'re looking for...',
    keyword: 'Type a word to look up...',
  };

  // --- Initialization ---
  function init() {
    updateBookmarksBadge();
    loadDiscoveryWords();
    setupEventListeners();
    searchInput.focus();
  }

  // --- Event Listeners ---
  function setupEventListeners() {
    // Mode toggle
    modeToggle.addEventListener('click', (e) => {
      const btn = e.target.closest('.mode-btn');
      if (!btn || btn.classList.contains('active')) return;

      document.querySelectorAll('.mode-btn').forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      currentMode = btn.dataset.mode;
      searchInput.placeholder = PLACEHOLDERS[currentMode];

      // Re-search if there's a query
      if (searchInput.value.trim()) {
        performSearch(searchInput.value.trim());
      }
    });

    // Search input with debounce
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.trim();
      searchClear.classList.toggle('visible', query.length > 0);

      clearTimeout(searchTimeout);

      if (!query) {
        clearResults();
        showEmptyState();
        return;
      }

      searchTimeout = setTimeout(() => performSearch(query), 300);
    });

    // Clear button
    searchClear.addEventListener('click', () => {
      searchInput.value = '';
      searchClear.classList.remove('visible');
      clearResults();
      showEmptyState();
      searchInput.focus();
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      // Focus search on "/" press
      if (e.key === '/' && document.activeElement !== searchInput) {
        e.preventDefault();
        searchInput.focus();
        searchInput.select();
      }

      // Escape to clear or close bookmarks
      if (e.key === 'Escape') {
        if (bookmarksDrawer.classList.contains('open')) {
          closeBookmarks();
        } else if (searchInput.value) {
          searchInput.value = '';
          searchClear.classList.remove('visible');
          clearResults();
          showEmptyState();
        }
      }
    });

    // Bookmarks
    bookmarksToggle.addEventListener('click', openBookmarks);
    bookmarksClose.addEventListener('click', closeBookmarks);
    bookmarksOverlay.addEventListener('click', closeBookmarks);

    // Delegate click events on results
    resultsGrid.addEventListener('click', handleResultClick);
    discoveryGrid.addEventListener('click', handleResultClick);
  }

  // --- Search ---
  async function performSearch(query) {
    showLoading(true);
    hideEmptyState();

    try {
      const params = new URLSearchParams({ q: query, mode: currentMode, limit: 20 });
      const response = await fetch(`/api/search?${params}`);
      const data = await response.json();

      currentResults = data.results || [];
      renderResults(currentResults);

      // Update meta
      if (currentResults.length > 0) {
        resultsMeta.style.display = 'flex';
        resultsCount.textContent = `${currentResults.length} word${currentResults.length !== 1 ? 's' : ''} found`;
        discoverySection.style.display = 'none';
      } else {
        resultsMeta.style.display = 'none';
        showNoResults(query);
      }
    } catch (err) {
      console.error('Search error:', err);
      showError();
    } finally {
      showLoading(false);
    }
  }

  // --- Rendering ---
  function renderResults(results) {
    resultsGrid.innerHTML = results.map((entry, i) => createWordCardHTML(entry, i)).join('');
  }

  function createWordCardHTML(entry, index) {
    const posClass = entry.pos.replace(/\s+/g, '-');
    const isBookmarked = bookmarks.some(b => b.word === entry.word && b.pos === entry.pos);
    const delay = Math.min(index * 60, 400);

    // Limit to first 3 senses for readability
    const senses = entry.senses.slice(0, 3);

    return `
      <article class="word-card" style="animation-delay: ${delay}ms"
               data-word="${escapeAttr(entry.word)}" data-pos="${escapeAttr(entry.pos)}">
        <div class="word-card-header">
          <div style="display:flex; align-items:center; gap: var(--space-sm); flex-wrap: wrap;">
            <span class="word-title">${escapeHTML(entry.word)}</span>
            <span class="word-pos ${posClass}">${escapeHTML(entry.pos)}</span>
          </div>
          <div class="word-card-actions">
            <button class="action-btn copy-btn" title="Copy word" data-copy="${escapeAttr(entry.word)}">
              📋 Copy
            </button>
            <button class="action-btn bookmark-btn ${isBookmarked ? 'bookmarked' : ''}"
                    title="${isBookmarked ? 'Remove bookmark' : 'Bookmark this word'}"
                    data-bookmark='${escapeAttr(JSON.stringify({ word: entry.word, pos: entry.pos, definition: senses[0]?.definition || '' }))}'>
              ${isBookmarked ? '★' : '☆'} Save
            </button>
          </div>
        </div>
        ${senses.map(sense => `
          <div class="word-sense">
            <p class="word-definition">${escapeHTML(sense.definition)}</p>
            ${sense.examples.map(ex => `<p class="word-example">${escapeHTML(ex)}</p>`).join('')}
            ${sense.synonyms.length > 0 ? `
              <div class="word-synonyms">
                ${sense.synonyms.slice(0, 8).map(syn => `
                  <span class="synonym-tag" data-synonym="${escapeAttr(syn)}" title="Search for '${escapeAttr(syn)}'">${escapeHTML(syn)}</span>
                `).join('')}
              </div>
            ` : ''}
          </div>
        `).join('')}
        ${entry.senses.length > 3 ? `<p style="color: var(--text-tertiary); font-size: 0.8rem; margin-top: var(--space-sm);">+ ${entry.senses.length - 3} more sense${entry.senses.length - 3 !== 1 ? 's' : ''}</p>` : ''}
      </article>
    `;
  }

  // --- Click Handlers ---
  function handleResultClick(e) {
    // Copy button
    const copyBtn = e.target.closest('.copy-btn');
    if (copyBtn) {
      const word = copyBtn.dataset.copy;
      navigator.clipboard.writeText(word).then(() => {
        showToast(`"${word}" copied to clipboard`);
      });
      return;
    }

    // Bookmark button
    const bookmarkBtn = e.target.closest('.bookmark-btn');
    if (bookmarkBtn) {
      const data = JSON.parse(bookmarkBtn.dataset.bookmark);
      toggleBookmark(data);
      bookmarkBtn.classList.toggle('bookmarked');
      const isNowBookmarked = bookmarkBtn.classList.contains('bookmarked');
      bookmarkBtn.innerHTML = `${isNowBookmarked ? '★' : '☆'} Save`;
      bookmarkBtn.title = isNowBookmarked ? 'Remove bookmark' : 'Bookmark this word';
      showToast(isNowBookmarked ? `"${data.word}" bookmarked` : `"${data.word}" removed`);
      return;
    }

    // Synonym tag — search for that word
    const synonymTag = e.target.closest('.synonym-tag');
    if (synonymTag) {
      const syn = synonymTag.dataset.synonym;
      searchInput.value = syn;
      searchClear.classList.add('visible');

      // Switch to keyword mode for synonym lookup
      document.querySelectorAll('.mode-btn').forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      const keywordBtn = document.querySelector('[data-mode="keyword"]');
      keywordBtn.classList.add('active');
      keywordBtn.setAttribute('aria-selected', 'true');
      currentMode = 'keyword';
      searchInput.placeholder = PLACEHOLDERS.keyword;

      performSearch(syn);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // --- Bookmarks ---
  function toggleBookmark(data) {
    const idx = bookmarks.findIndex(b => b.word === data.word && b.pos === data.pos);
    if (idx >= 0) {
      bookmarks.splice(idx, 1);
    } else {
      bookmarks.push(data);
    }
    localStorage.setItem('sd-bookmarks', JSON.stringify(bookmarks));
    updateBookmarksBadge();
    renderBookmarks();
  }

  function updateBookmarksBadge() {
    bookmarksBadge.textContent = bookmarks.length > 0 ? bookmarks.length : '';
  }

  function renderBookmarks() {
    if (bookmarks.length === 0) {
      bookmarksEmpty.style.display = 'block';
      bookmarksList.querySelectorAll('.bookmark-item').forEach(el => el.remove());
      return;
    }

    bookmarksEmpty.style.display = 'none';

    // Clear old items (keep the empty state element)
    bookmarksList.querySelectorAll('.bookmark-item').forEach(el => el.remove());

    bookmarks.forEach(bm => {
      const item = document.createElement('div');
      item.className = 'bookmark-item';
      item.innerHTML = `
        <button class="bookmark-item-remove" data-rm-word="${escapeAttr(bm.word)}" data-rm-pos="${escapeAttr(bm.pos)}" title="Remove">✕</button>
        <div class="bookmark-item-word">${escapeHTML(bm.word)}</div>
        <div class="bookmark-item-def">${escapeHTML(bm.definition)}</div>
      `;

      // Click to search
      item.addEventListener('click', (e) => {
        if (e.target.closest('.bookmark-item-remove')) {
          e.stopPropagation();
          toggleBookmark({ word: bm.word, pos: bm.pos });
          return;
        }
        searchInput.value = bm.word;
        searchClear.classList.add('visible');
        currentMode = 'keyword';
        document.querySelectorAll('.mode-btn').forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        document.querySelector('[data-mode="keyword"]').classList.add('active');
        document.querySelector('[data-mode="keyword"]').setAttribute('aria-selected', 'true');
        searchInput.placeholder = PLACEHOLDERS.keyword;
        performSearch(bm.word);
        closeBookmarks();
      });

      bookmarksList.appendChild(item);
    });
  }

  function openBookmarks() {
    renderBookmarks();
    bookmarksDrawer.classList.add('open');
    bookmarksOverlay.classList.add('open');
  }

  function closeBookmarks() {
    bookmarksDrawer.classList.remove('open');
    bookmarksOverlay.classList.remove('open');
  }

  // --- Discovery Words ---
  async function loadDiscoveryWords() {
    try {
      const response = await fetch('/api/random?count=5');
      const data = await response.json();
      if (data.results && data.results.length) {
        discoveryGrid.innerHTML = data.results
          .map((entry, i) => createWordCardHTML(entry, i))
          .join('');
        discoverySection.style.display = 'block';
      }
    } catch (err) {
      console.error('Error loading discovery words:', err);
      discoverySection.style.display = 'none';
    }
  }

  // --- UI State Helpers ---
  function showLoading(show) {
    searchLoading.classList.toggle('visible', show);
    if (show) searchClear.classList.remove('visible');
    else if (searchInput.value.trim()) searchClear.classList.add('visible');
  }

  function clearResults() {
    resultsGrid.innerHTML = '';
    resultsMeta.style.display = 'none';
    currentResults = [];
  }

  function showEmptyState() {
    emptyState.style.display = 'block';
    discoverySection.style.display = 'block';
  }

  function hideEmptyState() {
    emptyState.style.display = 'none';
    discoverySection.style.display = 'none';
  }

  function showNoResults(query) {
    resultsGrid.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🤔</div>
        <h2 class="empty-state-title">No words found</h2>
        <p class="empty-state-text">Try rephrasing your description or switching to ${currentMode === 'semantic' ? 'keyword' : 'semantic'} mode.</p>
      </div>
    `;
  }

  function showError() {
    resultsGrid.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">⚠️</div>
        <h2 class="empty-state-title">Something went wrong</h2>
        <p class="empty-state-text">Please make sure the server is running and try again.</p>
      </div>
    `;
  }

  function showToast(message) {
    clearTimeout(toastTimeout);
    toast.textContent = message;
    toast.classList.add('visible');
    toastTimeout = setTimeout(() => toast.classList.remove('visible'), 2200);
  }

  // --- Utilities ---
  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function escapeAttr(str) {
    return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // --- Boot ---
  init();
})();
