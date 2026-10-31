(function () {
  'use strict';

  var STORAGE_KEY = 'todo-list-items';
  var THEME_KEY = 'todo-list-theme';

  var form = document.getElementById('todo-form');
  var input = document.getElementById('todo-input');
  var listEl = document.getElementById('todo-list');
  var emptyHint = document.getElementById('empty-hint');
  var remainingEl = document.getElementById('remaining-count');
  var themeBtn = document.getElementById('theme-toggle');
  var filterBtns = document.querySelectorAll('.btn-filter');
  var darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

  var todos = load();
  var filter = 'all'; // all | active | done

  var EMPTY_TEXT = {
    all: '還沒有任何待辦事項,新增一個吧!',
    active: '沒有未完成的項目',
    done: '沒有已完成的項目'
  };

  // 讀取使用者手動選擇的主題;沒有則回傳 null(跟隨系統)
  function getSavedTheme() {
    try {
      var t = localStorage.getItem(THEME_KEY);
      return t === 'dark' || t === 'light' ? t : null;
    } catch (e) {
      return null;
    }
  }

  function currentTheme() {
    return getSavedTheme() || (darkQuery.matches ? 'dark' : 'light');
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    themeBtn.textContent = theme === 'dark' ? '☀️ 淺色模式' : '🌙 深色模式';
  }

  function toggleTheme() {
    var next = currentTheme() === 'dark' ? 'light' : 'dark';
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch (e) {
      // 儲存失敗時,本次仍會套用但重新整理後不保留
    }
    applyTheme(next);
  }

  // 從 localStorage 讀取資料,格式錯誤時回傳空陣列
  function load() {
    try {
      var data = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return Array.isArray(data) ? data : [];
    } catch (e) {
      return [];
    }
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch (e) {
      // 儲存失敗(例如隱私模式)時,僅保留於記憶體
    }
  }

  function addTodo(text) {
    todos.push({ id: Date.now() + Math.random(), text: text, done: false });
    save();
    render();
  }

  function toggleTodo(id) {
    todos.forEach(function (t) {
      if (t.id === id) t.done = !t.done;
    });
    save();
    render();
  }

  function deleteTodo(id) {
    todos = todos.filter(function (t) {
      return t.id !== id;
    });
    save();
    render();
  }

  // 重新繪製清單;文字以 textContent 寫入,避免 XSS
  function render() {
    listEl.innerHTML = '';

    var visible = todos.filter(function (t) {
      if (filter === 'active') return !t.done;
      if (filter === 'done') return t.done;
      return true;
    });

    visible.forEach(function (todo) {
      var li = document.createElement('li');
      li.className = 'todo-item' + (todo.done ? ' done' : '');

      var checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = todo.done;
      checkbox.setAttribute('aria-label', '標記完成');
      checkbox.addEventListener('change', function () {
        toggleTodo(todo.id);
      });

      var span = document.createElement('span');
      span.className = 'todo-text';
      span.textContent = todo.text;

      var del = document.createElement('button');
      del.type = 'button';
      del.className = 'btn btn-delete';
      del.textContent = '刪除';
      del.addEventListener('click', function () {
        deleteTodo(todo.id);
      });

      li.appendChild(checkbox);
      li.appendChild(span);
      li.appendChild(del);
      listEl.appendChild(li);
    });

    // 未完成數量以全部資料計算,不受篩選影響
    var remaining = todos.filter(function (t) {
      return !t.done;
    }).length;
    remainingEl.textContent = '未完成:' + remaining + ' 項';

    emptyHint.textContent = todos.length === 0 ? EMPTY_TEXT.all : EMPTY_TEXT[filter];
    emptyHint.hidden = visible.length > 0;

    filterBtns.forEach(function (btn) {
      var active = btn.getAttribute('data-filter') === filter;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filter = btn.getAttribute('data-filter');
      render();
    });
  });

  themeBtn.addEventListener('click', toggleTheme);

  // 尚未手動選擇時,系統深淺色變更要即時跟隨
  darkQuery.addEventListener('change', function () {
    if (!getSavedTheme()) applyTheme(currentTheme());
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var text = input.value.trim();
    // 空白內容不新增
    if (!text) return;
    addTodo(text);
    input.value = '';
    input.focus();
  });

  applyTheme(currentTheme());
  render();
})();
