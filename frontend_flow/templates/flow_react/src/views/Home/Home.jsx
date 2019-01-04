import React, { Component } from "react";
import ChartistGraph from "react-chartist";
import { Grid, Row, Col, Table } from "react-bootstrap";

import { Card } from "components/Card/Card.jsx";
import axios from 'axios';
import { NavLink } from "react-router-dom";
import {
  processThArray,
  processFieldArray,
} from "variables/Variables.jsx";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      for_operate_processes_data: [],
      state_statistics: {}
    }
  }

  componentDidMount() {
    axios.get('/api/process/statistics/')
    .then(res => {
      const result = res.data
      this.setState({
        for_operate_processes_data: this.reformatted_processes_data(result['for_operate_processes_data']),
        state_statistics: this.reformatted_pie_data(result['state_statistics'])
      })
    })
  }

  reformatted_processes_data(data) {
    const reformatted_processes_data = data.map(obj => {
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
    return reformatted_processes_data
  }

  reformatted_pie_data(data) {
    let labels = []
    let series = []
    for (var key in data) {
        labels.push(key + data[key])
        series.push(data[key])
    }
    return  {
      "labels": labels,
      "series": series
    }
  }

  createLegend(json) {
    var legend = [];
    for (var i = 0; i < json["names"].length; i++) {
      var type = "fa fa-circle text-" + json["types"][i];
      legend.push(<i className={type} key={i} />);
      legend.push(" ");
      legend.push(json["names"][i]);
    }
    return legend;
  }

  render() {
    return (
      <div className="content">

        <Grid fluid>
          <Row>
            <Col md={8}>
              <Card
                id="chartHours"
                title="待处理"
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
                      {this.state.for_operate_processes_data.map((prop, key) => {
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
            <Col md={4}>
              <Card
                title="合同状态分布"
                content={
                  <div
                    id="chartPreferences"
                    className="ct-chart ct-perfect-fourth"
                  >
                    <ChartistGraph data={this.state.state_statistics} type="Pie" />
                  </div>
                }
              />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default Dashboard;
