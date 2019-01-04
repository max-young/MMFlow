import React, { Component } from 'react';
import { Grid, Row, Col, Radio, Label, FormGroup, Dropdown, MenuItem } from 'react-bootstrap';
import RootCloseWrapper from 'react-overlays/lib/RootCloseWrapper';
import { FormInputs } from "components/FormInputs/FormInputs.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import axios from 'axios';
import {initial_flow_template_data} from 'variables/Variables.jsx';
import PropTypes from 'prop-types';

// 流程名称
class FlowTemplateName extends Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(event) {
    this.props.handleChangeTemplate('flow_template_name', event.target.value)
  }

  render() {
    return (
      <FormInputs
        ncols={["col-md-4"]}
        proprieties={[
          {
            label: "流程名称",
            type: "text",
            bsClass: "form-control",
            placeholder: "请输入流程模板名称",
            value: this.props.template_name,
            onChange: this.handleChange
          }
        ]}
      />
    )
  }
}

// Step职员信息
class AddStaff extends Component {
  constructor(props) {
    super(props)
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleMenuItemSelect = this.handleMenuItemSelect.bind(this);
    this.handleStaffLabelClick = this.handleStaffLabelClick.bind(this);
    this.handleRootClose = this.handleRootClose.bind(this);
    this.changeTemplateData = this.changeTemplateData.bind(this)
    this.state = {
      'searchArg': '',
      'search_staffs_data': [],
      'dropdown_open': false
    }
  }

  changeTemplateData(staffs_data) {
    if (this.props.data_key === 'requesters') {
      this.props.handleChangeTemplate('requesters', staffs_data)
    } else if (this.props.data_key === 'operators') {
      this.props.change_step_operator('operators', staffs_data, this.props.step_no)
    }
  }

  handleRootClose(event) {
    this.setState({dropdown_open: false})
  }

  handleStaffLabelClick(event) {
    let staff_id = event.target.getAttribute('staff_id')
    // eslint-disable-next-line
    let new_staffs_data = this.props.staffs_data.filter((i) => i['id'] != staff_id)
    this.changeTemplateData(new_staffs_data)
  }

  handleMenuItemSelect(event) {
    for(let i = 0; i < this.state.search_staffs_data.length; i++) {
      if (this.state.search_staffs_data[i]['id'] === event) {
        if (this.props.staffs_data.filter((data) => data['id'] === event).length) {
          alert('已选择过此员工')
        } else {
          this.setState({
            dropdown_open: false,
            searchArg: ''
          })
          let new_staffs_data = [...this.props.staffs_data, this.state.search_staffs_data[i]]
          this.changeTemplateData(new_staffs_data)
          break
        }
      }
    }
  }

  handleSearchChange(event) {
    this.setState({'searchArg': event.target.value})
    axios.get('/api/user/?like_username_firstname=' + event.target.value)
    .then(res => {
      let res_data = res.data.results
      if (res_data) {
        this.setState({
          search_staffs_data: res_data,
          dropdown_open: true
        })
      }
    })
  }

  render() {
    return (
      <div>
        <RootCloseWrapper onRootClose={this.handleRootClose} event={this.props.rootCloseEvent}>
          <Dropdown id="dropdown-add-requester" open={this.state.dropdown_open}>
            <FormInputs
              ncols={["col-md-12"]}
              proprieties={[
                {
                  label: this.props.title,
                  type: "text",
                  bsClass: "form-control",
                  placeholder: "搜索员工",
                  onChange: this.handleSearchChange,
                  value: this.state.searchArg
                }
              ]}
            />
            <Dropdown.Menu className="super-colors">
              {
                this.state.search_staffs_data.map((data) =>
                  <MenuItem eventKey={data['id']} onSelect={this.handleMenuItemSelect}>
                      {data['username']}
                  </MenuItem>
                )
              }
            </Dropdown.Menu>
        </Dropdown>
        </RootCloseWrapper>
        {
          this.props.staffs_data.map((data) => 
            <h5>
              <Label bsStyle='success' >
                {data['username']}
                <Button bsStyle="danger" simple type="button" bsSize="xs" onClick={this.handleStaffLabelClick}>
                  <i className="fa fa-times" staff_id={data['id']} />
                </Button>
              </Label>
            </h5>
          )
        }
      </div>
    )
  }
}

// DropDown点击外面关闭MenuItem
AddStaff.propTypes = {
  rootCloseEvent: PropTypes.oneOf(['click', 'mousedown'])
}

class StepItem extends Component {
  constructor(props) {
    super(props)
    this.handleChangeStepName = this.handleChangeStepName.bind(this)
    this.handleRemoveStepClick = this.handleRemoveStepClick.bind(this)
    this.handleWorkModeChange = this.handleWorkModeChange.bind(this)
  }

  handleChangeStepName(event) {
    this.props.change_step('step_name', event.target.value, this.props.step_data.no)
  }

  handleRemoveStepClick(event) {
    this.props.remove_step(this.props.step_data.no)
  }

  handleWorkModeChange(event) {
    this.props.change_step('work_mode', event.target.value, this.props.step_data.no)
  }

  render() {
    return (
      <div className='content'>
        <Row>
          <Col md={3}>
            <FormInputs
              ncols={["col-md-12"]}
              proprieties={[
                {
                  label: "步骤名称",
                  type: "text",
                  bsClass: "form-control",
                  placeholder: '步骤名称',
                  value: this.props.step_data.step_name,
                  onChange: this.handleChangeStepName
                },
              ]}
            />
          </Col>
          <Col md={5}>
            <AddStaff 
              staffs_data={this.props.step_data.operators} 
              data_key='operators' 
              step_no={this.props.step_data.no} 
              change_step_operator={this.props.change_step}
              title='操作者'
            />
          </Col>
          <Col md={3}>
            <form>
              <FormGroup>
                <Radio name="or" inline checked={this.props.step_data.work_mode === 'or'} value='or' onChange={this.handleWorkModeChange} >
                  只需一人通过
                </Radio>
                <br />
                <br />
                <Radio name="and" inline checked={this.props.step_data.work_mode === 'and'} value='and' onChange={this.handleWorkModeChange} >
                  需所有人通过
                </Radio>
              </FormGroup>
            </form>
          </Col>
          <Col md={1}>
            <Button bsStyle="info" pullRight fill type="submit" onClick={this.handleRemoveStepClick} >
              <i className='pe-7s-trash' />
            </Button>
          </Col>
        </Row>
        <hr />
      </div>
    )
  }
}

// Step
class Step extends Component {
  constructor(props) {
    super(props);
    this.calMaxStepsNo = this.calMaxStepsNo.bind(this)
    this.handleAddStepClick = this.handleAddStepClick.bind(this);
    this.removeStep = this.removeStep.bind(this)
    this.changeStep = this.changeStep.bind(this)
  }

  calMaxStepsNo(steps_data) {
    if (steps_data.length>0) {
      let steps_no = steps_data.map((data) => data['no'])
      return Math.max(...steps_no)
    } else {
      return 0
    }
  }

  // 增加step
  handleAddStepClick(event) {
    let empty_step_data = {
      "operators": [],
      "step_name": "",
      "work_mode": "or",
      'no': this.calMaxStepsNo(this.props.steps_data) + 1
    }
    let new_steps_data = [...this.props.steps_data, empty_step_data]
    this.props.handleChangeTemplate('steps', new_steps_data)
  }

  removeStep(step_no) {
    // eslint-disable-next-line
    let new_steps_data = this.props.steps_data.filter((i) => i['no'] != step_no)
    this.props.handleChangeTemplate('steps', new_steps_data)
  }

  changeStep(key, value, no) {
    let new_steps_data = this.props.steps_data
    for (let i = 0; i < new_steps_data.length; i++) {
      // eslint-disable-next-line
      if (new_steps_data[i]['no'] == no) {
        new_steps_data[i][key] = value
        break
      }
    }
    this.props.handleChangeTemplate('steps', new_steps_data)
  }

  render() {
    return (
      <div className='content'>
        <div className='content'>
          <Button bsStyle="info" pullLeft fill type="submit" onClick={this.handleAddStepClick}>增加步骤</Button>
        </div>
        {
          this.props.steps_data.map((step_data) =>
              <StepItem 
              step_data={step_data} 
              remove_step={this.removeStep} 
              change_step={this.changeStep} />
          )
        }
      </div>
    )
  }
}

// 模板
class Template extends Component {
  constructor(props) {
    super(props)
    this.handleChangeTemplate = this.handleChangeTemplate.bind(this)
    this.handleSaveTemplateClick = this.handleSaveTemplateClick.bind(this)
  }

  handleChangeTemplate(key, value) {
    let index = this.props.index
    this.props.edit_template(index, key, value)
  }

  handleSaveTemplateClick() {
    let index = this.props.index
    this.props.save_template(index)
  }

  render() {
    return (
      <div className='card'>
        <div className='content'>
          <Row>
            <Col md={12}>
              <FlowTemplateName template_name={this.props.template_data.flow_template_name} handleChangeTemplate={this.handleChangeTemplate} />
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <AddStaff
                staffs_data={this.props.template_data.requesters}
                handleChangeTemplate={this.handleChangeTemplate}
                data_key='requesters'
                title='业务发起者'
              />
            </Col>
          </Row>
          <hr />
          <Row>
            <Col md={12}>
              <Step steps_data={this.props.template_data.steps} handleChangeTemplate={this.handleChangeTemplate} />
            </Col>
          </Row>
          <div className='footer'>
            <hr />
            <div className="stats">
              <Button bsStyle="success" pullLeft fill type="submit" onClick={this.handleSaveTemplateClick}>
                保存
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

class FlowTemplate extends Component {
  constructor(props) {
    super(props)
    this.edit_template = this.edit_template.bind(this)
    this.save_template = this.save_template.bind(this)
    this.state = {
      templates_data: initial_flow_template_data
    }
  }

  componentDidMount() {
    axios.get('/api/flow-template/')
    .then(res => {
      let data = res.data.results
      if (data.length > 0) {
        this.setState({templates_data: data})
      }
    })
  }

  edit_template(index, key, value) {
    let templates_data = this.state.templates_data
    templates_data[index][key] = value
    this.setState({
      templates_data: templates_data
    })
  }

  save_template(index) {
    let data = this.state.templates_data[index]
    let requester_ids = data['requesters'].map((i) => i['id'])
    data['requester_ids'] = requester_ids
    let steps_data = data['steps']
    let new_steps_data = []
    for (let i = 0; i < steps_data.length; i++) {
      let step_data = steps_data[i]
      let operator_ids = step_data['operators'].map((i) => i['id'])
      step_data['operator_ids'] = operator_ids
      new_steps_data.push(step_data)
    }
    if (Number.isInteger(data['id'])) {
      axios.put('/api/flow-template/' + data['id'] +'/', data)
      .then(res => {
        alert('保存成功')
      })
      .catch(error => {
        alert('编辑失败')
      })
    } else {
      axios.post('/api/flow-template/', data)
      .then(res => {
        alert('创建成功')
      })
      .catch(error => {
        alert('创建失败')
      })
    }
  }

  render() {
    let templates_data = this.state.templates_data
    return (
      <div className="content">
        <Grid fluid>
          {
            templates_data.map((i, index) =>
              <Template template_data={i} edit_template={this.edit_template} save_template={this.save_template} index={index} />
            )
          }
        </Grid>
      </div>
    );
  }
}

export default FlowTemplate