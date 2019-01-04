import React, { Component } from 'react';
import axios from 'axios';
import "./css/grayscale.css";

export class Home extends Component {
  render() {
    return (
      <div>
        <Navigation />
        <Header />
        <AboutSection />
        <ContactSection />
        <Footer />
      </div>
    )
  }
}
  
class Navigation extends Component {
  constructor(props) {
    super(props);
    this.handleLogoutClick = this.handleLogoutClick.bind(this);
    this.handleBackendClick = this.handleBackendClick.bind(this);
    this.state = {
      current_user: null
    }
  }

  componentDidMount() {
    axios.get('/api/current-user/')
    .then(res => {
      this.setState({current_user: res.data.username})
    })
  }

  handleLogoutClick() {
    axios.get('/api/logout/')
    .then(res => {
      this.setState({current_user: null})
    })
  }

  handleBackendClick() {
    window.location = '/flow/'
  }

  render() {
    const current_user = this.state.current_user
    let sign;
    if (current_user) {
      sign = <button className="nav-link js-scroll-trigger" onClick={this.handleBackendClick}>{current_user} 点击进入后台</button>
    } else {
      sign = <a className="nav-link js-scroll-trigger" href="/signin/">登录</a>
    }
    return (
      <nav className="navbar navbar-expand-lg navbar-light fixed-top" id="mainNav-home">
        <div className="container">
          <a className="navbar-brand js-scroll-trigger" href="#page-top">MM Flow</a>
          <button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
            Menu
            <i className="fas fa-bars"></i>
          </button>
          <div className="collapse navbar-collapse" id="navbarResponsive">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <a className="nav-link js-scroll-trigger" href="#about">关于</a>
              </li>
              <li className="nav-item">
                <a className="nav-link js-scroll-trigger" href="#contact">联系</a>
              </li>
              <li className="nav-item">
                {sign}
              </li>
            </ul>
          </div>
        </div>
      </nav>
    )
  }
}
  
  class Header extends Component {
    render() {
      return (
        <header className="masthead">
          <div className="container d-flex h-100 align-items-center">
            <div className="mx-auto text-center">
              <h1 className="mx-auto my-0 text-uppercase">MM合同工作流</h1>
              <h2 className="text-white-50 mx-auto mt-2 mb-5">简单, 高效的工作流</h2>
              <a href="/api/experience/" className="btn btn-info js-scroll-trigger">一键体验</a>
            </div>
          </div>
        </header>
      )
    }
  }
  
  class AboutSection extends Component {
    render() {
      return (
        <section id="about" className="about-section text-center">
          <div className="container">
            <div className="row">
              <div className="col-lg-8 mx-auto">
                <h2 className="text-white mb-4">Django + React + Docker</h2>
                <p className="text-white-50">
                  解决企业合同编写审核工作的协作流程问题<br />
                  工作流程可自定义配置, 在线编辑合同内容, 统一管理
                </p>
              </div>
            </div>
          </div>
        </section>
      )
    }
  }
  
  class ContactSection extends Component {
    render() {
      return (
        <section id='contact' className="contact-section bg-black">
          <div className="container">
  
            <div className="row">
  
              <div className="col-md-4 mb-3 mb-md-0">
                <div className="card py-4 h-100">
                  <div className="card-body text-center">
                    <i className="fas fa-map-marked-alt text-primary-custom mb-2"></i>
                    <h4 className="text-uppercase m-0">地址</h4>
                    <hr className="my-4" />
                    <div className="small text-black-50">北京</div>
                  </div>
                </div>
              </div>
  
              <div className="col-md-4 mb-3 mb-md-0">
                <div className="card py-4 h-100">
                  <div className="card-body text-center">
                    <i className="fas fa-envelope text-primary-custom mb-2"></i>
                    <h4 className="text-uppercase m-0">邮箱</h4>
                    <hr className="my-4" />
                    <div className="small text-black-50">
                      18601036905@163.com
                    </div>
                  </div>
                </div>
              </div>
  
              <div className="col-md-4 mb-3 mb-md-0">
                <div className="card py-4 h-100">
                  <div className="card-body text-center">
                    <i className="fas fa-mobile-alt text-primary-custom mb-2"></i>
                    <h4 className="text-uppercase m-0">电话</h4>
                    <hr className="my-4" />
                    <div className="small text-black-50">+86 18601036905</div>
                  </div>
                </div>
              </div>
            </div>
  
          </div>
        </section>
      )
    }
  }
  
  class Footer extends Component {
    render() {
      return (
        <footer className="bg-black small text-center text-white-50">
          <div className="container">
            Copyright &copy; MMFlow 2018
          </div>
        </footer>
      )
    }
  }

  export default Home;