import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

const Header = props => {
  console.log('header')
  const onClickLogout = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }
  return (
    <nav className="header-card">
      <Link to="/">
        <img
          className="logo-header"
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
        />
      </Link>

      <ul className="link-ele">
        <Link className="link-item" to="/">
          <li className="list-link">Home</li>
        </Link>
        <Link className="link-item" to="/jobs">
          <li className="list-link">Jobs</li>
        </Link>
      </ul>
      <li>
        <button className="logout-btn" type="button" onClick={onClickLogout}>
          Logout
        </button>
      </li>
    </nav>
  )
}
export default withRouter(Header)
