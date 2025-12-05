function Todo(name, state) {
  this.name = name;
  this.state = state;
}

var todos = [];
var states = ["active", "inactive", "done"];
var tabs = ["all"].concat(states);
var currentTab = "all";

var form = document.getElementById("new-todo-form");
var input = document.getElementById("new-todo-title");

form.onsubmit = function(event) {
  event.preventDefault();
  if (input.value && input.value.length) {
    todos.push(new Todo(input.value, "active"));
    saveTodos();
    input.value = "";
    renderTodos();
  }
};

function updateBadges() {
    var tabs = document.getElementsByClassName("todo-tab");

    // Count todos by state
    var counts = {
        all: todos.length,
        active: todos.filter(t => t.state === "active").length,
        inactive: todos.filter(t => t.state === "inactive").length,
        done: todos.filter(t => t.state === "done").length
    };

    // Update each tab's badge
    Array.prototype.forEach.call(tabs, function (tab) {
        var tabName = tab.getAttribute("data-tab-name");
        var badge = tab.querySelector(".badge");

        if (badge) {
            badge.textContent = counts[tabName] || 0;
        }
    });
}


var buttons = [
  { action: "up", icon: "chevron-up" },
  { action: "down", icon: "chevron-down" },
  { action: "done", icon: "ok" },
  { action: "active", icon: "plus" },
  { action: "inactive", icon: "minus" },
  { action: "remove", icon: "trash" }
];
function renderTodos() {
  var todoList = document.getElementById("todo-list");
  todoList.innerHTML = "";

  updateBadges();

  todos
    .filter(function(todo) {
      return todo.state === currentTab || currentTab === "all";
    })
    .forEach(function(todo) {
      var div1 = document.createElement("div");
      div1.className = "row";

      var div2 = document.createElement("div");
      div2.innerHTML =
        '<a class="list-group-item" href="#">' + todo.name + "</a>";
      div2.className = "col-xs-6 col-sm-9 col-md-10";

      var div3 = document.createElement("div");
      div3.className = "col-xs-6 col-sm-3 col-md-2 btn-group text-right";
      buttons.forEach(function(button) {
        var btn = document.createElement("button");
        btn.className = "btn btn-default btn-xs";
        btn.innerHTML =
          '<i class="glyphicon glyphicon-' + button.icon + '"></i>';
        div3.appendChild(btn);

        if (button.action === todo.state) {
          btn.disabled = true;
        }

      if (button.action === "up") {
          btn.title = "Move Up";
          btn.onclick = function() {
              moveTodo(todo, -1);
          };
      } else if (button.action === "down") {
          btn.title = "Move Down";
          btn.onclick = function() {
              moveTodo(todo, 1);
          };
      } else if (button.action === "remove") {
          btn.title = "Remove";
          btn.onclick = function() {
              if (confirm("Are you sure you want to delete the item titled " + todo.name)) {
                  todos.splice(todos.indexOf(todo), 1);
                  saveTodos();
                  renderTodos();
              }
          };
      } else {
          btn.title = "Mark as " + button.action;
          btn.onclick = function() {
              todo.state = button.action;
              saveTodos();
              renderTodos();
          };
      }

      });

      div1.appendChild(div2);
      div1.appendChild(div3);

      todoList.appendChild(div1);
    });
}

function moveTodo(todo, direction) {
    // Get filtered list of todos based on current tab
    var filtered = todos.filter(function(t) {
        return t.state === currentTab || currentTab === "all";
    });

    // Find index in filtered list
    var index = filtered.indexOf(todo);
    if (index === -1) return;

    var newIndex = index + direction;
    if (newIndex < 0 || newIndex >= filtered.length) return;

    // Swap todos in the main todos array
    var todoA = filtered[index];
    var todoB = filtered[newIndex];

    var idxA = todos.indexOf(todoA);
    var idxB = todos.indexOf(todoB);

    todos[idxA] = todoB;
    todos[idxB] = todoA;

    saveTodos();
    renderTodos();
}

function saveTodos() {
    localStorage.setItem("todos", JSON.stringify(todos));
}

function loadTodos() {
    var stored = localStorage.getItem("todos");
    if (stored) {
        // Convert stored array objects back into Todo instances
        var parsed = JSON.parse(stored);
        todos = parsed.map(function(t) {
            return new Todo(t.name, t.state);
        });
    }
}

loadTodos();
renderTodos();

function selectTab(element) {
  var tabName = element.attributes["data-tab-name"].value;
  currentTab = tabName;
  var todoTabs = document.getElementsByClassName("todo-tab");
  for (var i = 0; i < todoTabs.length; i++) {
    todoTabs[i].classList.remove("active");
  }
  element.classList.add("active");
  renderTodos();
}
