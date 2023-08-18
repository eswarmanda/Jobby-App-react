import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

import './index.css'

class LoginPage extends Component {
  state = {
    username: '',
    password: '',
    errorMsg: '',
    showSubmitError: false,
  }

  onSubmitSuccess = jwtToken => {
    Cookies.set('jwt_token', jwtToken, {expires: 1})
    const {history} = this.props
    history.replace('/')
  }

  onSubmitFailure = errMsg => {
    this.setState({errorMsg: errMsg, showSubmitError: true})
  }

  onSubmitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const loginDetails = {
      username,
      password,
    }
    const loginUrl = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(loginDetails),
    }
    const response = await fetch(loginUrl, options)
    const loginResponseData = await response.json()
    console.log(loginResponseData)
    if (response.ok === true) {
      this.onSubmitSuccess(loginResponseData.jwt_token)
    } else {
      this.onSubmitFailure(loginResponseData.error_msg)
    }
  }

  onChangeInputUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangeInputPassword = event => {
    this.setState({password: event.target.value})
  }

  render() {
    const {errorMsg, showSubmitError, username, password} = this.state
    const token = Cookies.get('jwt_token')
    if (token !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-page">
        <div className="login-card">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
          />
          <form className="login-form" onSubmit={this.onSubmitForm}>
            <label className="label-text" htmlFor="username">
              USERNAME
            </label>
            <input
              className="user-input"
              id="username"
              type="text"
              value={username}
              placeholder="Username"
              onChange={this.onChangeInputUsername}
            />
            <label className="label-text" htmlFor="password">
              PASSWORD
            </label>
            <input
              className="user-input"
              id="password"
              type="password"
              value={password}
              placeholder="Password"
              onChange={this.onChangeInputPassword}
            />
            <button className="login-btn" type="submit">
              Login
            </button>
            {showSubmitError && <p className="err-msg">*{errorMsg}</p>}
          </form>
        </div>
      </div>
    )
  }
}
export default LoginPage
