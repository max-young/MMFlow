import React, { Component } from "react";
import { Grid, Row, Col, Table } from "react-bootstrap";
import axios from 'axios';
import ReactModal from 'react-modal';

import Card from "components/Card/Card.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import { userThArray, userFieldArray } from "variables/Variables.jsx";
import { FormInputs } from "components/FormInputs/FormInputs.jsx";

// 跨域
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

ReactModal.setAppElement('#root');

// 创建用户的modal
class CreateStaffModal extends Component {
  constructor(props) {
    super(props);
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleOpenModal() {
    this.props.handleOpenModal();
  }

  handleCloseModal() {
    this.props.handleCloseModal();
  }

  handleChange(event) {
    this.setState({[event.target.name]: event.target.value})
  }

  handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    axios.post('/api/user/', data)
    .then(res => {
      alert('创建成功')
      this.props.handleCloseModal()
      this.props.refreshUserTable()
    })
    .catch(error => {
      alert('创建失败')
    })
  }

  render() {
    const showModal = this.props.showModal;
    return (
      <ReactModal
        isOpen={showModal}
        contentLabel="create user"
        onRequestClose={this.handleCloseModal}
        shouldCloseOnEsc={true}
        role="dialog"
        style={{
          overlay: {
            position: 'fixed',
            top: '20%',
            left: '30%',
            right: '30%',
            bottom: '35%',
            backgroundColor: 'rgba(255, 255, 255, 0.75)'
          },
          content: {
            position: 'absolute',
            top: '40px',
            left: '40px',
            right: '40px',
            bottom: '40px',
            border: '1px solid #ccc',
            background: '#fff',
            overflow: 'auto',
            WebkitOverflowScrolling: 'touch',
            borderRadius: '4px',
            outline: 'none',
            padding: '20px'
          }
        }}
      >
        <form onSubmit={this.handleSubmit}>
          <FormInputs
            ncols={["col-md-8"]}
            proprieties={[
              {
                label: "账号",
                type: "text",
                bsClass: "form-control",
                placeholder: "用户名",
                defaultValue: "",
                onChange: this.handleChange,
                name: 'username'
              }
            ]}
          />
          <FormInputs
            ncols={["col-md-8"]}
            proprieties={[
              {
                label: "姓名",
                type: "text",
                bsClass: "form-control",
                placeholder: "姓名",
                defaultValue: "", 
                onChange: this.handleChange,
                name: 'first_name'
              }
            ]}
          />
          <FormInputs
            ncols={["col-md-8"]}
            proprieties={[
              {
                label: "邮箱",
                type: "email",
                bsClass: "form-control",
                placeholder: "邮箱",
                onChange: this.handleChange,
                name: 'email'
              }
            ]}
          />
          <Button bsStyle="info" fill type="submit">
            创建
          </Button>
        </form>
      </ReactModal>
    )
  }
}

// 职员列表
class TableList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users_data: [],
      showModal: false
    }
    this.handleOpenUserCreateModal = this.handleOpenUserCreateModal.bind(this);
    this.handleCloseUserCreateModal = this.handleCloseUserCreateModal.bind(this);
    this.refreshUserTable = this.refreshUserTable.bind(this);
  }

  refreshUserTable() {
    axios.get('/api/user/')
    .then(res => {
      this.setState({users_data: res.data.results})
    })
  }

  componentDidMount() {
    this.refreshUserTable()
  }

  handleOpenUserCreateModal () {
    this.setState({ showModal: true });
  }

  handleCloseUserCreateModal () {
    this.setState({ showModal: false });
  }

  render() {
    return (
      <div className="content">
        <CreateStaffModal
          showModal={this.state.showModal}
          handleOpenModal={this.handleOpenUserCreateModal}
          handleCloseModal={this.handleCloseUserCreateModal}
          refreshUserTable={this.refreshUserTable}
        />
        <Grid fluid>
          <Row>
            <Col md={12}>
              <Card
                title="职员管理"
                title_button={
                    <Button bsStyle="info" pullRight fill onClick={this.handleOpenUserCreateModal}>
                      创建职员
                    </Button>
                }
                category="可添加删除职员和管理职员权限"
                ctTableFullWidth
                ctTableResponsive
                content={
                  <Table striped hover>
                    <thead>
                      <tr>
                        {userThArray.map((prop, key) => {
                          return <th key={key}>{prop}</th>;
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.users_data.map((prop, key) => {
                        return (
                          <tr key={key}>
                            {userFieldArray.map((head, key) => {
                              return <td key={key}>{prop[head]}</td>;
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                }
              />
            </Col>

            {/* <Col md={12}>
              <Card
                plain
                title="Striped Table with Hover"
                category="Here is a subtitle for this table"
                ctTableFullWidth
                ctTableResponsive
                content={
                  <Table hover>
                    <thead>
                      <tr>
                        {thArray.map((prop, key) => {
                          return <th key={key}>{prop}</th>;
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {tdArray.map((prop, key) => {
                        return (
                          <tr key={key}>
                            {prop.map((prop, key) => {
                              return <td key={key}>{prop}</td>;
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                }
              />
            </Col> */}
          </Row>
        </Grid>
      </div>
    );
  }
}

export default TableList;