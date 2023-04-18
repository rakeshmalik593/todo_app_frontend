import React, { Component, useState } from "react";
// import "/Users/rakeshmalik/Desktop/todo_app/frontend/src/App.css"; // Import app.css file

import {
  ModalFooter,
  Modal,
  Form,
  Label,
  FormGroup,
  Button,
  ModalHeader,
  ModalBody,
  Input,
} from "reactstrap";
import "react-datepicker/dist/react-datepicker.css";

export default class CustomModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: this.props.activeItem,
      titleError: "",
      descriptionError: "",
      priorityError: "",
    };
  }

  handleChange = (e) => {
    let { name, value } = e.target;
    console.log({ name, value });
    if (e.target.type === "checkbox") {
      value = e.target.checked;
    }
    if (e.target.type === "radio") {
      value = parseInt(e.target.value);
    }

    const activeItem = { ...this.state.activeItem, [name]: value };

    this.setState({ activeItem }, () => {
      const title = this.state.activeItem.title.trim();
      if (title.length < 5) {
        this.setState({
          titleError: "Title must be at least 5 characters long",
        });
      } else {
        this.setState({ titleError: "" });
      }
      const description = this.state.activeItem.description.trim();
      if (description.length === 0) {
        this.setState({ descriptionError: "Please enter a description" });
      } else {
        this.setState({ descriptionError: "" });
      }

      const priority = this.state.activeItem.priority;
      if (!priority || priority === 0) {
        this.setState({ priorityError: "Please select a priority" });
      } else {
        this.setState({ priorityError: "" });
      }
    });
  };
  hasErrors = () => {
    const { activeItem } = this.state;
    let hasError = false;

    if (!activeItem.description) {
      this.setState({ descriptionError: "Description is required" });
      hasError = true;
    } else {
      this.setState({ descriptionError: "" });
    }

    if (!activeItem.priority) {
      this.setState({ priorityError: "Priority is required" });
      hasError = true;
    } else {
      this.setState({ priorityError: "" });
    }

    return hasError;
  };

  render() {
    const { toggle, onSave } = this.props;
    const { titleError, descriptionError, priorityError } = this.state;
    const hasErrors = titleError || descriptionError || priorityError;

    return (
      <Modal isOpen={true} toggle={toggle}>
        <ModalHeader toggle={toggle}>Todo Item</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="todo-title">Title</Label>
              <Input
                type="text"
                id="todo-title"
                name="title"
                value={this.state.activeItem.title}
                onChange={this.handleChange}
                placeholder="Enter Todo Title"
              />
              {this.state.titleError && (
                <div className="text-danger">{this.state.titleError}</div>
              )}
            </FormGroup>
            <FormGroup>
              <Label for="todo-description">Description</Label>
              <Input
                type="text"
                id="todo-description"
                name="description"
                value={this.state.activeItem.description}
                onChange={this.handleChange}
                placeholder="Enter Todo description"
              />
              {descriptionError && (
                <div className="text-danger">{descriptionError}</div>
              )}
            </FormGroup>

            <FormGroup className="radio-buttons">
              <Label for="priority">Priority</Label>
              <div className="ml-80">
                <Label check>
                  <Input
                    type="radio"
                    name="priority"
                    value={1}
                    checked={this.state.activeItem.priority === 1}
                    onChange={this.handleChange}
                  />{" "}
                  <span style={{ color: "green" }}>Low</span>
                </Label>
              </div>
              <div className="ml-8">
                <Label check>
                  <Input
                    type="radio"
                    name="priority"
                    value={2}
                    checked={this.state.activeItem.priority === 2}
                    onChange={this.handleChange}
                  />{" "}
                  <span style={{ color: "orange" }}>Medium</span>
                </Label>
              </div>
              <div className="ml-8">
                <Label check>
                  <Input
                    type="radio"
                    name="priority"
                    value={3}
                    checked={this.state.activeItem.priority === 3}
                    onChange={this.handleChange}
                  />{" "}
                  <span style={{ color: "red" }}>High</span>
                </Label>
              </div>
            </FormGroup>

            <FormGroup check>
              <Label check>
                <Input
                  type="checkbox"
                  name="completed"
                  checked={this.state.activeItem.completed}
                  onChange={this.handleChange}
                />
                Completed
              </Label>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button
            color="success"
            onClick={() => onSave(this.state.activeItem)}
            disabled={hasErrors}
          >
            Save
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}
