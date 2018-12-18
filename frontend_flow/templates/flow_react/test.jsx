import React, { Component } from 'react';

class Page extends Component {
  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this) 
    this.state = {
      page_data : 'data'
    }
  }

  handleChange(data) {
    this.setState({
      page_data: data
    })
  }

  handleSubmit() {
    // submit this.state.page_data
    pass
  }

  render() {
    return (
      <div>
        <Parent page_data = {this.state.page_data}  handleChange={this.handleChange} />
        <button onClick={this.handleSubmit}></button>
      </div>
    )
  }
}

class Parent extends Component {
  render() {
    return (
      <Child parent_data = {this.props.page_data} handleChange={this.props.handleChange} />
    )
  }
}

class Child extends Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }

  InputChange(event) {
    this.props.handleChange(event.target.value)
  }

  render() {
    return (
      <Form>
        <Input value={this.props.parent_data} onchange={this.inputChange} />
      </Form>
    )
  }
}