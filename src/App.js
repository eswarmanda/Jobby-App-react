import {Route, Switch, Redirect} from 'react-router-dom'
import LoginPage from './Components/LoginPage'
import HomePage from './Components/HomePage'
import ProtectedRoute from './Components/ProtectedRoute'
import NotFound from './Components/NotFound'
import JobsPage from './Components/JobsPage'
import JobItem from './Components/JobItem'
import './App.css'

// Replace your code here
const App = () => (
  <Switch>
    <Route exact path="/login" component={LoginPage} />
    <ProtectedRoute exact path="/" component={HomePage} />
    <ProtectedRoute exact path="/jobs" component={JobsPage} />
    <ProtectedRoute exact path="/jobs/:id" component={JobItem} />
    <Route exact path="/not-found" component={NotFound} />
    <Redirect to="not-found" />
  </Switch>
)

export default App
