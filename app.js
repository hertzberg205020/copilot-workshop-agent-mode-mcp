(function () {
  'use strict';

  var STORAGE_KEY = 'todo-list-items';

  var form = document.getElementById('todo-form');
  var input = document.getElementById('todo-input');
  var listEl = document.getElementById('todo-list');
  var emptyHint = document.getElementById('empty-hint');
  var remainingEl = document.getElementById('remaining-count');

  var todos = load();

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

    todos.forEach(function (todo) {
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

    var remaining = todos.filter(function (t) {
      return !t.done;
    }).length;
    remainingEl.textContent = '未完成:' + remaining + ' 項';
    emptyHint.hidden = todos.length > 0;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var text = input.value.trim();
    // 空白內容不新增
    if (!text) return;
    addTodo(text);
    input.value = '';
    input.focus();
  });

  render();
})();
