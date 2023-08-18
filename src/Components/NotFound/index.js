import './index.css'

const NotFound = () => {
  console.log('ntf')
  return (
    <div className="not-found">
      <img
        className="not-found-img"
        src="https://assets.ccbp.in/frontend/react-js/jobby-app-not-found-img.png"
        alt="not found"
      />
      <h1>Page Not Found</h1>
      <p className="not-des">
        We are sorry, the page you requested could not be found
      </p>
    </div>
  )
}
export default NotFound
