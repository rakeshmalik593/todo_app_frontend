import React, { Component } from "react";
import axios from "axios";
import Modal from "./components/Modal";
import "react-datepicker/dist/react-datepicker.css";
// CSS Modules, react-datepicker-cssmodules.css//
import "react-datepicker/dist/react-datepicker-cssmodules.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.css";

const mapping = {
  1: "Low",
  2: "Medium",
  3: "High",
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewCompleted: false,
      todoList: [],
      modal: false,
      activeItem: {
        title: "",
        description: "",
        dueDate: new Date(),
        priority: "",
        completed: false,
      },
    };
  }
  componentDidMount() {
    this.refreshList();
  }

  refreshList = () => {
    axios
      .get("http://localhost:8000/api/todos/")
      .then((res) => {
        console.log(res.data);
        this.setState({ todoList: res.data });
      })

      .catch((err) => console.log(err));
  };
  toggle = () => {
    this.setState({ modal: !this.state.modal });
  };

  handleSubmit = async (item) => {
    this.toggle();
    try {
      if (item.id) {
        const res = await axios.put(`http://localhost:8000/api/todos/${item.id}/`, item);
        console.log(res.data);
        toast.success("Task updated successfully!");
      } else {
        const res = await axios.post("http://localhost:8000/api/todos/", item);
        console.log(res.data);
        toast.success("Task created successfully!");
      }
      this.refreshList();
    } catch (err) {
      console.log(err);
      toast.error("An error occurred.");
    }
  };

  handleDelete = async (item) => {
    try {
      const res = await axios.delete(`http://localhost:8000/api/todos/${item.id}/`);
      console.log(res.data);
      toast.success("Task deleted successfully!");
      this.refreshList();
    } catch (err) {
      console.log(err);
      toast.error("An error occurred.");
    }
  };

  createItem = () => {
    const item = {
      title: "",
      description: "",
      dueDate: "",
      priority: "",
      completed: false,
    };

    this.setState({ activeItem: item, modal: !this.state.modal });
  };

  editItem = (item) => {
    this.setState({ activeItem: item, modal: !this.state.modal });
  };

  displayCompleted = (status) => {
    if (status) {
      return this.setState({ viewCompleted: true });
    }

    return this.setState({ viewCompleted: false });
  };

  renderTabList = () => {
    return (
      <div className="nav nav-tabs">
        <span
          className={this.state.viewCompleted ? "nav-link active" : "nav-link"}
          onClick={() => this.displayCompleted(true)}
        >
          Completed
        </span>
        <span
          className={this.state.viewCompleted ? "nav-link" : "nav-link active"}
          onClick={() => this.displayCompleted(false)}
        >
          Incomplete
        </span>
      </div>
    );
  };

  renderItems = () => {
    const { viewCompleted } = this.state;
    const newItems = this.state.todoList.filter(
      (item) => item.completed == viewCompleted
    );
    if (newItems.length === 0 && viewCompleted) {
      return <li className="list-group-item">No completed tasks</li>;
    }
    return newItems.map((item) => (
      <li
        key={item.id}
        className={`list-group-item d-flex justify-content-between align-items-center ${
          item.priority === 3
            ? "list-group-item-danger"
            : item.priority === 2
            ? "list-group-item-warning"
            : ""
        }`}
      >
        <span
          className={`todo-title mr-2 ${
            this.state.viewCompleted ? "completed-todo" : ""
          }`}
          title={item.description}
        >
          {item.title}
        </span>
        <br />
        <small>Due Date: {}</small>
        <div>Priority: {mapping[item.priority]}</div>
        <span>
          <button
            className="btn btn-secondary mr-2"
            onClick={() => this.editItem(item)}
          >
            Edit
          </button>
          <button
            className="btn btn-danger"
            onClick={() => this.handleDelete(item)}
          >
            Delete
          </button>
        </span>
      </li>
    ));
  };

  render() {
    return (
      <div>
        <ToastContainer />
        <main className="container">
          <h1 className="text-black text-uppercase text-center my-4">
            TaskMate: Schedule your tasks
          </h1>
          <div className="row">
            <div className="col-md-6 col-sm-10 mx-auto p-0">
              <div className="card p-3">
                <div className="mb-4">
                  <button className="btn btn-primary" onClick={this.createItem}>
                    Add task
                  </button>
                </div>
                {this.renderTabList()}
                <ul className="list-group list-group-flush border-top-0">
                  {this.renderItems()}
                </ul>
              </div>
            </div>
          </div>
          {this.state.modal ? (
            <Modal
              activeItem={this.state.activeItem}
              toggle={this.toggle}
              onSave={this.handleSubmit}
            />
          ) : null}
        </main>
      </div>
    );
  }
}

export default App;
