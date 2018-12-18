import React, { Component } from 'react';
import "./vendor/bootstrap/css/bootstrap.min.css";
import "./fonts/font-awesome-4.7.0/css/font-awesome.min.css";
import "./fonts/Linearicons-Free-v1.0.0/icon-font.min.css";
import "./vendor/animate/animate.css";
import "./vendor/css-hamburgers/hamburgers.min.css";
import "./vendor/animsition/css/animsition.min.css";
import "./vendor/select2/select2.min.css";
import "./vendor/daterangepicker/daterangepicker.css";
import "./css/signin/App.css";
import "./css/signin/main.css";
import "./css/signin/util.css";
import { Link, Redirect } from "react-router-dom";
import axios from 'axios';

// 跨域
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

var qs = require('qs');

export const fakeAuth = {
  isAuthenticated: false,
  authenticate(cb) {
    this.isAuthenticated = true;
    setTimeout(cb, 100); // fake async
  },
  signout(cb) {
    this.isAuthenticated = false;
    setTimeout(cb, 100);
  }
};

export class SignIn extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      redirectToReferrer: false
    };
  }

  validateForm() {
    return this.state.username.length > 0 && this.state.password.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = event => {
    event.preventDefault();
    axios.post('/api/login/', qs.stringify({
        username: this.state.username,
        password: this.state.password,
      }))
    .then(res => {
      window.location.replace("/flow")
      // this.setState({ redirectToReferrer: true });
    })
    .catch(error => {
      alert('账号密码错误')
    })
  }

  render() {
    const { from } = this.props.location.state || { from: { pathname: "/flow/" } };
    const { redirectToReferrer } = this.state;

    if (redirectToReferrer) {
      return <Redirect to={from} />;
    }

    return (
      <div>
        <div className="limiter">
          <div className="container-login100">
            <div className="wrap-login100 p-t-30 p-b-50">
              <span className="login100-form-title p-b-41">
                登录
              </span>
              <form className="login100-form validate-form p-b-33 p-t-5" onSubmit={this.handleSubmit}>

                <div className="wrap-input100 validate-input" data-validate = "Enter username">
                  <input
                    className="input100"
                    type="text"
                    name="username"
                    placeholder="用户名"
                    autoFocus
                    value={this.state.username}
                    onChange={this.handleChange}
                    id="username"
                    />
                  <span className="focus-input100" data-placeholder="&#xe82a;"></span>
                </div>

                <div className="wrap-input100 validate-input" data-validate="Enter password">
                  <input
                    className="input100"
                    type="password"
                    name="pass"
                    placeholder="密码"
                    value={this.state.password}
                    onChange={this.handleChange}
                    id="password"
                    />
                  <span className="focus-input100" data-placeholder="&#xe80f;"></span>
                </div>

                <div className="container-login100-form-btn m-t-32">
                  <button
                    className="login100-form-btn"
                    disabled={!this.validateForm()}
                    type="submit"
                  >
                    登录
                  </button>
                </div>
                {/* <div className="pull-right">
                  <Link to="/signup/"><h6>注册</h6></Link>
                </div> */}
              </form>
            </div>
          </div>
        </div>
        <div id="dropDownSelect1"></div>
      </div>
    )
  }
}

export class SignUp extends Component {
  render() {
    return (
      <div>
        <div className="limiter">
          <div className="container-login100">
            <div className="wrap-login100 p-t-30 p-b-50">
              <span className="login100-form-title p-b-41">
                注册
              </span>
              <form className="login100-form validate-form p-b-33 p-t-5">

                <div className="wrap-input100 validate-input" data-validate = "Enter username">
                  <input className="input100" type="text" name="username" placeholder="账号" />
                  <span className="focus-input100" data-placeholder="&#xe82a;"></span>
                </div>

                <div className="wrap-input100 validate-input" data-validate="Enter password">
                  <input className="input100" type="password" name="pass" placeholder="密码" />
                  <span className="focus-input100" data-placeholder="&#xe80f;"></span>
                </div>

                <div className="wrap-input100 validate-input" data-validate="confirm password">
                  <input className="input100" type="password" name="pass" placeholder="确认密码" />
                  <span className="focus-input100" data-placeholder="&#xe80f;"></span>
                </div>

                <div className="wrap-input100 validate-input" data-validate="Enter company">
                  <input className="input100" type="text" name="company" placeholder="输入公司名称" />
                  <span className="focus-input100" data-placeholder="&#xe82a;"></span>
                </div>

                <div className="container-login100-form-btn m-t-32">
                  <button className="login100-form-btn">
                    提交
                  </button>
                </div>
                <div className="pull-right">
                  <Link to="/signin/"><h6>登录</h6></Link>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div id="dropDownSelect1"></div>
      </div>
    )
  }
}