import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import {Home} from "./home";
import {SignIn, SignUp } from "./signin";

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route exact path="/" component={Home} />
          <Route path="/signin/" component={SignIn} />
          <Route path="/signup/" component={SignUp} />
        </div>
      </Router>
    );
  }
}

export default App;