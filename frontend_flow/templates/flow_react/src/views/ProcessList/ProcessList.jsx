import React, { Component } from "react";
import { Grid, Row, Col, Table } from "react-bootstrap";
import axios from 'axios';
import { NavLink } from "react-router-dom";

import Card from "components/Card/Card.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import { processThArray, processFieldArray } from "variables/Variables.jsx";

class ProcessList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      processes_data: []
    }
    this.refreshUserTable = this.refreshUserTable.bind(this);
  }

  refreshUserTable() {
    axios.get('/api/process/')
    .then(res => {
      const processes_data = res.data.results
      const reformatted_processes_data = processes_data.map(obj => {
        obj['operate'] = (
          <NavLink
            to={"/process/" + obj['id']}
            className="nav-link"
            activeClassName="active"
          >
            编辑/审核
          </NavLink>
        )
        return obj
      })
      this.setState({
        processes_data: reformatted_processes_data
      })
    })
  }

  componentDidMount() {
    this.refreshUserTable()
  }

  render() {
    return (
      <div className="content">
        <Grid fluid>
          <Row>
            <Col md={12}>
              <Card
                title="合同流程管理"
                title_button={
                  <NavLink
                    to="/process/create"
                    className="nav-link"
                    activeClassName="active"
                  >
                    <Button bsStyle="info" pullRight fill>
                      创建合同
                    </Button>
                  </NavLink>
                }
                category="管理合同流程"
                ctTableFullWidth
                ctTableResponsive
                content={
                  <Table striped hover>
                    <thead>
                      <tr>
                        {processThArray.map((prop, key) => {
                          return <th key={key}>{prop}</th>;
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.processes_data.map((prop, key) => {
                        return (
                          <tr key={key}>
                            {processFieldArray.map((head, key) => {
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
          </Row>
        </Grid>
      </div>
    );
  }
}

export default ProcessList;