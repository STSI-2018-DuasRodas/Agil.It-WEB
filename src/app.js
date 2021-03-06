import React, { Component } from 'react';
import C_Menu from './components/Menu';
import Login from './login/Login';
import Cookies from 'universal-cookie';

class App extends Component {
  constructor() {
    super()

    this.cookies = new Cookies();
    this.onLogout = this.onLogout.bind(this)
    this.onLogin = this.onLogin.bind(this)

    this.state = { 
      token: this.cookies.get('token') || false,
      user: this.cookies.get('user') || false
    }
  }

  onLogout() {
    this.cookies.remove('token')
    this.setState({ token: false })
  }

  onLogin() {
    this.setState({ 
      token: this.cookies.get('token'),
      user: this.cookies.get('user')
    })
  }

  render() {
    const { token, user } = this.state
    console.log("App -> render -> user", user)

    if (!token) {
      return <Login onSuccess={this.onLogin}/>
    }

    return <C_Menu user={user} onLogout={this.onLogout}/>
  }
}

export default App;