import React, { Component } from 'react';
import axios from 'axios';
import ipad_png from "./img/ipad.png";
import bg_masthead from "./img/bg-masthead.jpg";
import demo_image_01 from "./img/demo-image-01.jpg";
import demo_image_02 from "./img/demo-image-02.jpg";
import "./css/grayscale.css";

export class Home extends Component {
  render() {
    return (
      <div>
        <Navigation />
        <Header />
        <AboutSection />
        <ProjectSection />
        <SignupSection />
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
                <a className="nav-link js-scroll-trigger" href="#projects">示例</a>
              </li>
              <li className="nav-item">
                <a className="nav-link js-scroll-trigger" href="#signup">联系</a>
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
              <h1 className="mx-auto my-0 text-uppercase">MM工作流</h1>
              <h2 className="text-white-50 mx-auto mt-2 mb-5">简单, 高效的工作流</h2>
              <a href="#about" className="btn btn-primary js-scroll-trigger">coming soon</a>
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
                <h2 className="text-white mb-4">Django + React</h2>
                <p className="text-white-50">
                  解决企业混乱的工作流程
                </p>
              </div>
            </div>
            <img src={ipad_png} className="img-fluid" alt="" />
          </div>
        </section>
      )
    }
  }
  
  class ProjectSection extends Component {
    render() {
      return (
        <section id="projects" className="projects-section bg-light">
          <div className="container">
  
            <div className="row align-items-center no-gutters mb-4 mb-lg-5">
              <div className="col-xl-8 col-lg-7">
                <img className="img-fluid mb-3 mb-lg-0" src={bg_masthead} alt="" />
              </div>
              <div className="col-xl-4 col-lg-5">
                <div className="featured-text text-center text-lg-left">
                  <h4>简单</h4>
                  <p className="text-black-50 mb-0">操作简单</p>
                </div>
              </div>
            </div>
  
            <div className="row justify-content-center no-gutters mb-5 mb-lg-0">
              <div className="col-lg-6">
                <img className="img-fluid" src={demo_image_01} alt="" />
              </div>
              <div className="col-lg-6">
                <div className="bg-black text-center h-100 project">
                  <div className="d-flex h-100">
                    <div className="project-text w-100 my-auto text-center text-lg-left">
                      <h4 className="text-white">高效</h4>
                      <p className="mb-0 text-white-50">线上操作, </p>
                      <hr className="d-none d-lg-block mb-0 ml-0" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
  
            <div className="row justify-content-center no-gutters">
              <div className="col-lg-6">
                <img className="img-fluid" src={demo_image_02} alt="" />
              </div>
              <div className="col-lg-6 order-lg-first">
                <div className="bg-black text-center h-100 project">
                  <div className="d-flex h-100">
                    <div className="project-text w-100 my-auto text-center text-lg-right">
                      <h4 className="text-white">人性化</h4>
                      <p className="mb-0 text-white-50">界面友好</p>
                      <hr className="d-none d-lg-block mb-0 mr-0" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
  
          </div>
        </section>
      )
    }
  }
  
  class SignupSection extends Component {
    render() {
      return (
        <section id="signup" className="signup-section">
          <div className="container">
            <div className="row">
              <div className="col-md-10 col-lg-8 mx-auto text-center">
  
                <i className="far fa-paper-plane fa-2x mb-2 text-white"></i>
                <h2 className="text-white mb-5">获取更新资料</h2>
  
                <form className="form-inline d-flex">
                  <input type="email" className="form-control flex-fill mr-0 mr-sm-2 mb-3 mb-sm-0" id="inputEmail" placeholder="输入您的邮箱地址..." />
                  <button type="submit" className="btn btn-primary mx-auto">获取</button>
                </form>
  
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
        <section className="contact-section bg-black">
          <div className="container">
  
            <div className="row">
  
              <div className="col-md-4 mb-3 mb-md-0">
                <div className="card py-4 h-100">
                  <div className="card-body text-center">
                    <i className="fas fa-map-marked-alt text-primary mb-2"></i>
                    <h4 className="text-uppercase m-0">地址</h4>
                    <hr className="my-4" />
                    <div className="small text-black-50">北京</div>
                  </div>
                </div>
              </div>
  
              <div className="col-md-4 mb-3 mb-md-0">
                <div className="card py-4 h-100">
                  <div className="card-body text-center">
                    <i className="fas fa-envelope text-primary mb-2"></i>
                    <h4 className="text-uppercase m-0">邮箱</h4>
                    <hr className="my-4" />
                    <div className="small text-black-50">
                      <a href="mail">18601036905@163.com</a>
                    </div>
                  </div>
                </div>
              </div>
  
              <div className="col-md-4 mb-3 mb-md-0">
                <div className="card py-4 h-100">
                  <div className="card-body text-center">
                    <i className="fas fa-mobile-alt text-primary mb-2"></i>
                    <h4 className="text-uppercase m-0">电话</h4>
                    <hr className="my-4" />
                    <div className="small text-black-50">+86 18601036905</div>
                  </div>
                </div>
              </div>
            </div>
  
            <div className="social d-flex justify-content-center">
              <a href="twitter" className="mx-2">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="facebook" className="mx-2">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="github" className="mx-2">
                <i className="fab fa-github"></i>
              </a>
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