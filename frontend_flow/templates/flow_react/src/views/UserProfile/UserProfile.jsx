import React, { Component } from "react";
import {
  Grid,
  Row,
  Col,
} from "react-bootstrap";
import axios from 'axios';

import { Card } from "components/Card/Card.jsx";
import { FormInputs } from "components/FormInputs/FormInputs.jsx";
// import { UserCard } from "components/UserCard/UserCard.jsx";
import Button from "components/CustomButton/CustomButton.jsx";

// import avatar from "assets/img/faces/face-3.jpg";

class UserProfile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user_data: {}
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount() {
    const { id } = this.props.match.params
    axios.get('/api/user/' + id + '/')
    .then(res => {
      this.setState({user_data: res.data})
    })
    this.setState({user_data: {"id": 1, "username": "yangle", "first_name": "", "email": ""}})
  }

  handleChange(event) {
    let user_data = this.state.user_data
    user_data[event.target.name] = event.target.value
    this.setState({user_data: user_data})
  }

  handleSubmit(event) {
    event.preventDefault();
    const { id } = this.props.match.params
    const data = new FormData(event.target);
    axios.patch('/api/user/' + id + '/', data)
    .then(res => {
      alert('修改成功')
    })
    .catch(error => {
      alert('修改失败')
    })
  }


  render() {
    return (
      <div className="content">
        <Grid fluid>
          <Row>
            <Col md={12}>
              <Card
                title="账号信息"
                content={
                  <form onSubmit={this.handleSubmit}>
                    <FormInputs
                      ncols={["col-md-6"]}
                      proprieties={[
                        {
                          label: "账号",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "账号",
                          value: this.state.user_data['username'],
                          disabled: true,
                          onChange: this.handleChange
                        }
                      ]}
                    />
                    <FormInputs
                      ncols={["col-md-6", "col-md-6"]}
                      proprieties={[
                        {
                          label: "姓名",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "姓名",
                          name: "first_name",
                          value: this.state.user_data['first_name'],
                          onChange: this.handleChange
                        },
                        {
                          label: "邮箱",
                          type: "email",
                          bsClass: "form-control",
                          placeholder: "邮箱",
                          name: "email",
                          value: this.state.user_data['email'],
                          onChange: this.handleChange
                        }
                      ]}
                    />

                    {/* <Row>
                      <Col md={12}>
                        <FormGroup controlId="formControlsTextarea">
                          <ControlLabel>About Me</ControlLabel>
                          <FormControl
                            rows="5"
                            componentClass="textarea"
                            bsClass="form-control"
                            placeholder="Here can be your description"
                            defaultValue="Lamborghini Mercy, Your chick she so thirsty, I'm in that two seat Lambo."
                          />
                        </FormGroup>
                      </Col>
                    </Row> */}
                    <Button bsStyle="info" pullRight fill type="submit">
                      更新
                    </Button>
                    <div className="clearfix" />
                  </form>
                }
              />
            </Col>
            {/* <Col md={4}>
              <UserCard
                bgImage="https://ununsplash.imgix.net/photo-1431578500526-4d9613015464?fit=crop&fm=jpg&h=300&q=75&w=400"
                avatar={avatar}
                name="Mike Andrew"
                userName="michael24"
                description={
                  <span>
                    "Lamborghini Mercy
                    <br />
                    Your chick she so thirsty
                    <br />
                    I'm in that two seat Lambo"
                  </span>
                }
                socials={
                  <div>
                    <Button simple>
                      <i className="fa fa-facebook-square" />
                    </Button>
                    <Button simple>
                      <i className="fa fa-twitter" />
                    </Button>
                    <Button simple>
                      <i className="fa fa-google-plus-square" />
                    </Button>
                  </div>
                }
              />
            </Col> */}
          </Row>
        </Grid>
      </div>
    );
  }
}

export default UserProfile;
