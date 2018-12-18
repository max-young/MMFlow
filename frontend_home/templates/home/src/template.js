import React, { Component } from 'react';
import {Route, Link, Redirect} from 'react-router-dom';
import axios from 'axios';
import './App.css';
import './fonts/font-awesome-4.7.0/css/font-awesome.css';
import './css/googlefonts.css';
import './assets/css/material-dashboard.css';

const sidebar_routes = [
  {
    path: "/flow/",
    exact: true,
    sidebar: () => <div>首页</div>,
    main: () => <FlowHome />
  },
  {
    path: "/flow/staff/",
    exact: true,
    sidebar: () => <div>职员</div>,
    main: () => <h2>职员</h2>
  }
]

export class Template extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirectToReferrer: true
    };
    axios.get('/api/current_user/')
    .then(
      this.setState({ redirectToReferrer: false })
    )
  }

  render() {
    const { from } = { from: { pathname: "/signin/" } };
    const { redirectToReferrer } = this.state.redirectToReferrer;
    if (redirectToReferrer) {
      return <Redirect to={from} />;
    }
    return (
      <div className="wrapper ">
        <div className="sidebar" data-color="purple" data-background-color="white">
            {/* Tip 1: You can change the color of the sidebar using: data-color="purple | azure | green | orange | danger"
            Tip 2: you can also add an image using data-image tag */}
          <div className="logo">
            <a href="/" className="simple-text logo-normal">
              MM Flow
            </a>
          </div>
          {/* your sidebar here */}
          <div className="sidebar-wrapper">
            <ul className="nav">
              <Link to='/flow/'>
                <li className="nav-item active  ">
                  <a className="nav-link" href="#0">
                    <i className="material-icons">dashboard</i>
                    <p>首页</p>
                  </a>
                </li>
              </Link>
              <Link to='/flow/staff/'>
                <li className="nav-item active  ">
                  <a className="nav-link" href="#0">
                    <i className="material-icons">dashboard</i>
                    <p>职员</p>
                  </a>
                </li>
              </Link>
            </ul>
          </div>
        </div>
        <div className="main-panel">
          {/* Navbar */}
          <nav className="navbar-flow navbar-expand-lg navbar-transparent navbar-absolute fixed-top ">
            <div className="container-fluid">
              <div className="navbar-wrapper">
                <a className="navbar-brand" href="#pablo">Dashboard</a>
              </div>
              <button className="navbar-toggler" type="button" data-toggle="collapse" aria-controls="navigation-index" aria-expanded="false" aria-label="Toggle navigation">
                <span className="sr-only">Toggle navigation</span>
                <span className="navbar-toggler-icon icon-bar"></span>
                <span className="navbar-toggler-icon icon-bar"></span>
                <span className="navbar-toggler-icon icon-bar"></span>
              </button>
              <div className="collapse navbar-collapse justify-content-end">
                <ul className="navbar-nav">
                  <li className="nav-item">
                    <a className="nav-link" href="#pablo">
                      <i className="material-icons">notifications</i> Notifications
                    </a>
                  </li>
                  {/* your navbar here */}
                </ul>
              </div>
            </div>
          </nav>
          {/* End Navbar */}
          <div className="content">
            <div className="container-fluid">
              {/* your content here */}
              {sidebar_routes.map((route, index) => (
                // You can render a <Route> in as many places
                // as you want in your app. It will render along
                // with any other <Route>s that also match the URL.
                // So, a sidebar or breadcrumbs or anything else
                // that requires you to render multiple things
                // in multiple places at the same URL is nothing
                // more than multiple <Route>s.
                <Route
                  key={index}
                  path={route.path}
                  exact={route.exact}
                  component={route.main}
                />
              ))}
            </div>
          </div>
          <footer className="footer">
            <div className="container-fluid">
              <nav className="float-left">
                <ul>
                  <li>
                    <a href="/">
                      MM Flow
                    </a>
                  </li>
                </ul>
              </nav>
              <div className="copyright float-right">
                &copy;
                <script>
                  document.write(new Date().getFullYear())
                </script>, made with <i className="material-icons">favorite</i> by
                <a href="/" target="_blank" rel="noopener noreferrer">MM Flow</a> for a better web.
              </div>
              {/* your footer here */}
            </div>
          </footer>
        </div>
      </div>
    )
  }
}

export class FlowHome extends Component {
  render() {
    return (
      <h1>fsdahfasd</h1>
    )
  }
}