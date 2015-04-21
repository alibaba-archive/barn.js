/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
var app = app || {};

(function () {
	'use strict';

	// var Todo = barn.database({
	// 	name: 'todomvc',
	// 	version: 1
	// }).model('todo', new barn.Schema({
	// 	keyPath: 'id',
	// 	indexes: [{
	// 		name: 'completed',
	// 		keyPath: 'completed',
 //      options: {
 //        unique: false,
 //        multiEntry: false
 //      }
	// 	}]
	// }))

	var Todo = barn.database({
		name: 'todomvc',
		version: 2
	}).model('todo', new barn.Schema({
		keyPath: 'id',
		indexes: [{
			name: 'completed',
			keyPath: 'completed',
      options: {
        unique: false,
        multiEntry: false
      }
		}, {
			name: 'isDeleted',
			keyPath: 'isDeleted',
      options: {
        unique: false,
        multiEntry: false
      }
		}],
		onUpgrade: function (event) {
			var store
			if (event.oldVersion <= 1) {
				store = event.db.objectStore('todo')
				store.createIndex('isDeleted', 'isDeleted', {
	        unique: false,
	        multiEntry: false
	      })
			}
		}
	}))

	var Utils = app.Utils
	// Generic "model" object. You can use whatever
	// framework you want. For this application it
	// may not even be worth separating this logic
	// out, but we do this to demonstrate one way to
	// separate out parts of your application.
	app.TodoModel = function (key) {
		this.key = key;
		this.todos = [];
		this.onChanges = [];
		this.readTodos()
	};

	app.TodoModel.prototype.readTodos = function () {
		Todo.getAll().then(function (todos) {
			this.todos = todos
			this.inform()
		}.bind(this))
	}

	app.TodoModel.prototype.subscribe = function (onChange) {
		this.onChanges.push(onChange);
	};

	app.TodoModel.prototype.inform = function () {
		this.onChanges.forEach(function (cb) { cb(); });
	};

	app.TodoModel.prototype.addTodo = function (title) {
		Todo.add({
			title: title,
			completed: 0
		}).then(function (todo) {
			this.todos.push(todo)
			this.inform()
		}.bind(this))
	};

	app.TodoModel.prototype.toggleAll = function (checked) {
		this.todos = this.todos.map(function (todo) {
			return Utils.extend({}, todo, {completed: checked});
		})
		Todo.putBatch(this.todos)
		this.inform()
	};

	app.TodoModel.prototype.toggle = function (todoToToggle) {
		this.todos = this.todos.map(function (todo) {
			return todo !== todoToToggle ?
				todo :
				Utils.extend({}, todo, {completed: todo.completed === 0 ? 1 : 0});
		});
		Todo.putBatch(this.todos)
		this.inform();
	};

	app.TodoModel.prototype.destroy = function (todo) {
		Todo.remove(todo.id).then(function () {
			this.todos = this.todos.filter(function (candidate) {
				return candidate !== todo;
			});
			this.inform();
		})
	};

	app.TodoModel.prototype.save = function (todoToSave, text) {
		Todo
			.put(Utils.extend({}, todoToSave, {title: text}))
			.then(function (todoFromDB) {
				this.todos = this.todos.map(function (todo) {
					return todo.id !== todoFromDB.id ? todo : todoFromDB;
				});
			}.bind(this))

		this.inform();
	};

	app.TodoModel.prototype.clearCompleted = function () {
		Todo.removeByIndex('completed', 1).then(function () {
			this.todos = this.todos.filter(function (todo) {
				return !todo.completed;
			});
			this.inform();
		}.bind(this))
	};

})();
