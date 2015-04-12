var React = require('react')
var mui = require('material-ui')
var Paper = mui.Paper
var TextField = mui.TextField
var barn = require('./barn/barn')
var Schema = barn.Schema

var TodoShema = new Schema({
  keyPath: 'id',
  indexes: [{
    name: 'state',
    keyPath: 'state',
    options: {
      unique: false,
      multiEntry: false
    }
  }]
})
var TodoDatabase = barn.database('todo', 1)
var TodoModel = TodoDatabase.model('todo', TodoShema)

var Todo = React.createClass({
  propTypes: {
    todo:React.PropTypes.object
  },
  getDefaultProps: function () {
    return {
      todo: {}
    }
  },
  render: function () {
    <li>{this.props.content}</li>
  }
})

var TodoList = React.createClass({
  propTypes: {
    todos:React.PropTypes.array
  },
  getDefaultProps: function () {
    return {
      todos: []
    }
  },
  render: function() {
    var self = this
    var todos = []
    this.props.todos.forEach(function (todo) {
      todos.push(<Todo todo={todo}></Todo>)
    })
    return (
      <ul>{todos.join('')}</ul>
    )
  }
})

var TodoApp = React.createClass({
  getInitialState: function () {
    return {
      todos: []
    }
  },
  componentDidMount: function () {
    var self = this
    TodoModel.getAll().then(function (todos) {
      self.setState({todos: todos})
    })
  },
  render: function () {
    return (
      <div className={'todo-app'}>
        <h1>Todos</h1>
        <Paper zDepth={1}>
          <div className={'todo-panel'}>
            <TextField className={'todo-input'}
              hintText="What needs to be done?" />
            <TodoList todos={this.state.todos}></TodoList>
          </div>
        </Paper>
      </div>
    )
  }
})

React.render(
  <TodoApp />,
  document.body
)