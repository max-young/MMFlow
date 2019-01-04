import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import {
  Grid,
  Row,
  Col,
  FormGroup,
  ControlLabel,
  FormControl
} from "react-bootstrap";
import { Card } from "components/Card/Card.jsx";
import { FormInputs } from "components/FormInputs/FormInputs.jsx";
import RichEditorExample from 'components/Editor/Editor.jsx';
import Button from "components/CustomButton/CustomButton.jsx";
import {EditorState, convertToRaw, convertFromRaw} from 'draft-js';
import axios from 'axios';

const action_type = {
  'approve': '通过',
  'restart': '拒绝'
}

class Action extends Component {
  render() {
    let data = this.props.action_data
    let action_repr = action_type[data.action_type]
    return (
      <div className="typo-line">
        <h5>
          <p className="category">{data.operator_name}</p>
          {action_repr}
        </h5>
        {data.description.length > 0 &&
        <blockquote>
          <p>
            {data.description}
          </p>
        </blockquote>
        }
      </div>
    )
  }
}

class ContractRequest extends Component {
  constructor(props) {
    super(props)
    this.state = {
      redirect_to_list: false,
      status: '',
      contract_name: '',
      party_a_name: '',
      party_b_name: '',
      editor_state: EditorState.createEmpty(),
      actions: []
    }
    this.onContractChange = this.onContractChange.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSave = this.handleSave.bind(this)
    this.onSaveClick = this.onSaveClick.bind(this)
    this.handleOperateClick = this.handleOperateClick.bind(this)
  }

  componentDidMount() {
    const { id } = this.props.match.params
    if (!isNaN(id)) {
      axios.get('/api/process/' + id + '/')
      .then(res => {
        let process_data = res.data
        let contract_content = process_data['contract']['contract_content']
        this.setState({
          status: process_data['status'],
          contract_name: process_data['contract']['contract_name'],
          party_a_name: process_data['contract']['party_a_name'],
          party_b_name: process_data['contract']['party_b_name'],
          editor_state: EditorState.createWithContent(convertFromRaw(JSON.parse(contract_content)))
        })
      })
      axios.get('/api/process/' + id + '/actions/')
      .then(res => {
        let data = res.data
        this.setState({actions: data})
      })
    }
  }

  onContractChange(editor_state) {
    this.setState({
      editor_state: editor_state
    })
  }

  handleChange(event) {
    this.setState({[event.target.name]: event.target.value})
  }

  onSaveClick(event) {
    this.handleSave(event.target.name)
  }

  handleSave(save_mode) {
    const data = new FormData(this.refs.process_form);
    data.append('save_mode', save_mode)
    const contract_editot_state = this.state.editor_state
    const contract_content = contract_editot_state.getCurrentContent()
    data.append('contract_content', JSON.stringify(convertToRaw(contract_content)))
    const id = this.props.match.params.id
    if (id === 'create' ) {
      axios.post('/api/process/', data)
      .then(res => {
        alert('提交成功')
        this.setState({
          redirect_to_list: true
        })
      })
      .catch(error => {
        alert('提交失败')
      })
    }
    else if (!isNaN(id)) {
      axios.put('/api/process/' + id + '/', data)
      .then(res => {
        alert('修改成功')
        if (save_mode === 'submit') {
          this.setState({
            redirect_to_list: true
          })
        }
      })
      .catch(error => {
        alert('提交失败')
      })
    }
  }

  handleOperateClick(event) {
    const { id } = this.props.match.params
    const data = new FormData(this.refs.operate_form);
    data.append('operate_type', event.target.name)
    axios.post('/api/process/' + id + '/operate/', data)
    .then(res => {
      alert('审核成功')
      this.setState({
        redirect_to_list: true
      })
    })
    .catch(error => {
      alert('审核失败')
    })
  }

  renderRedirectToList = () => {
    if (this.state.redirect_to_list) {
      return <Redirect to='/process-list/' />
    }
  }

  render() {
    return (
      <div className='content'>
        {this.renderRedirectToList()}
        <Grid fluid>
          <Row>
            <Col md={8}>
              <Card
                title='创建合同'
                content={
                  <form ref='process_form'>
                    <FormInputs
                      ncols={["col-md-8",]}
                      proprieties={[
                        {
                          label: "合同名称",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "合同名称",
                          value: this.state.contract_name,
                          onChange: this.handleChange,
                          name: 'contract_name'
                        }
                      ]}
                    />
                    <FormInputs
                      ncols={["col-md-6", "col-md-6"]}
                      proprieties={[
                        {
                          label: "甲方",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "甲方",
                          value: this.state.party_a_name,
                          onChange: this.handleChange,
                          name: 'party_a_name'
                        },
                        {
                          label: "乙方",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "乙方",
                          value: this.state.party_b_name,
                          onChange: this.handleChange,
                          name: 'party_b_name'
                        }
                      ]}
                    />
                    <Row>
                      <Col md={12}>
                        <RichEditorExample
                          editor_state={this.state.editor_state}
                          onContentChange={this.onContractChange}
                        />
                      </Col>
                    </Row>
                    <Button bsStyle="info" fill name='save' onClick={this.onSaveClick}>
                      保存
                    </Button>
                    {(this.state.status === 'start' || this.props.match.params.id === 'create') &&
                    <Button bsStyle="info" pullRight fill name="submit" onClick={this.onSaveClick}>
                      提交
                    </Button>
                    }
                    <div className="clearfix" />
                  </form>
                } 
              />
            </Col>
            <Col md={4}>
              {this.state.status === 'normal' &&
              <Row>
                <Card
                  title='审核'
                  content={
                    <form ref='operate_form'>
                      <Row>
                        <Col md={12}>
                          <FormGroup controlId="formControlsTextarea">
                            <ControlLabel>审核意见</ControlLabel>
                            <FormControl
                              rows="5"
                              componentClass="textarea"
                              bsClass="form-control"
                              placeholder=""
                              defaultValue=""
                              onChange={this.handleChange}
                              name='description'
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Button bsStyle="info" fill name='approve' onClick={this.handleOperateClick}>
                        同意
                      </Button>
                      <Button bsStyle="info" pullRight fill name='restart' onClick={this.handleOperateClick}>
                        拒绝
                      </Button>
                      <div className="clearfix" />
                    </form>
                  }
                />
              </Row>
              }
              {!isNaN(this.props.match.params.id) &&
              <Row>
                <Card
                  title='操作记录'
                  content={
                    <div>
                      {
                        this.state.actions.map((data) =>
                          <Action action_data={data} />
                        )
                      }
                    </div>
                  }
                />
              </Row>
              }
            </Col>
          </Row>
        </Grid>
      </div>
    )
  }
}

export default ContractRequest