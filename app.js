(function () {
  'use strict';

  var STORAGE_KEY = 'todo-list-items';
  var THEME_KEY = 'todo-list-theme';

  var form = document.getElementById('todo-form');
  var input = document.getElementById('todo-input');
  var listEl = document.getElementById('todo-list');
  var emptyHint = document.getElementById('empty-hint');
  var filterHint = document.getElementById('filter-hint');
  var remainingEl = document.getElementById('remaining-count');
  var clearDoneBtn = document.getElementById('clear-done');
  var themeBtn = document.getElementById('theme-toggle');
  var filterBtns = document.querySelectorAll('.btn-filter');
  var darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

  var todos = load();
  var filter = 'all'; // all | active | done

  var EMPTY_TEXT = {
    all: '還沒有任何待辦事項,新增一個吧!',
    active: '目前沒有未完成的事項',
    done: '目前沒有已完成的事項'
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

  // 刪除不可復原,需使用者確認後才執行
  function clearDone() {
    var doneCount = todos.filter(function (t) {
      return t.done;
    }).length;
    if (doneCount === 0) return;
    if (!confirm('確定要清除全部 ' + doneCount + ' 筆已完成的項目嗎?此操作無法復原。')) return;
    todos = todos.filter(function (t) {
      return !t.done;
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

    // 沒有已完成項目時停用按鈕(以全部資料判斷,不受篩選影響)
    clearDoneBtn.disabled = remaining === todos.length;

    // 被篩選隱藏的項目只是不顯示,並未刪除,需明確告知使用者
    const hiddenCount = todos.length - visible.length;

    if (todos.length === 0) {
      emptyHint.textContent = EMPTY_TEXT.all;
    } else {
      emptyHint.textContent =
        EMPTY_TEXT[filter] + '。其他 ' + hiddenCount + ' 筆項目仍保留,切換到「全部」即可查看。';
    }
    emptyHint.hidden = visible.length > 0;

    filterHint.textContent = '另有 ' + hiddenCount + ' 筆項目被篩選隱藏(並未刪除)';
    filterHint.hidden = visible.length === 0 || hiddenCount === 0;

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
  clearDoneBtn.addEventListener('click', clearDone);

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
