import {Link} from 'react-router-dom'
import Header from '../Header'
import './index.css'

const HomePage = () => {
  console.log('home')

  return (
    <>
      <Header />
      <div className="home">
        <div className="home-background">
          <div className="home-content">
            <h1>Find The Job That Fits Your Life</h1>
            <p className="home-des">
              Millions of people are searching for jobs, salary information,
              company reviews. Find the job that fits your abilities and
              potential.
            </p>
            <Link to="/jobs">
              <button className="find-jobs-btn" type="button">
                Find Jobs
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
export default HomePage
