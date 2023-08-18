import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {BsFillStarFill, BsBriefcaseFill} from 'react-icons/bs'
import {HiLocationMarker} from 'react-icons/hi'
import {BiLinkExternal} from 'react-icons/bi'
import Cookies from 'js-cookie'
import Header from '../Header'
import './index.css'

const apiStatusConstents = {
  initial: 'INITIAL',
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class JobItem extends Component {
  state = {
    jobDetails: '',
    skill: [],
    similarJobs: [],
    apiStatus: apiStatusConstents.initial,
  }

  componentDidMount() {
    this.getJobById()
  }

  getJobById = async () => {
    this.setState({apiStatus: apiStatusConstents.inProgress})
    const token = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params
    console.log(id)
    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const jobResponse = await fetch(url, options)
    const jobData = await jobResponse.json()
    if (jobResponse.ok === true) {
      console.log(jobData)
      const jobDetailsData = {
        id: jobData.job_details.id,
        companyLogoUrl: jobData.job_details.company_logo_url,
        visit: jobData.job_details.company_website_url,
        employmentType: jobData.job_details.employment_type,
        jobDescription: jobData.job_details.job_description,
        location: jobData.job_details.location,
        packagePerAnnum: jobData.job_details.package_per_annum,
        rating: jobData.job_details.rating,
        title: jobData.job_details.title,
        description: jobData.job_details.life_at_company.description,
        companyImageUrl: jobData.job_details.life_at_company.image_url,
      }
      console.log(jobDetailsData)

      this.setState({
        jobDetails: jobDetailsData,
        skill: jobData.job_details.skills,
        similarJobs: jobData.similar_jobs,
        apiStatus: apiStatusConstents.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstents.failure})
    }
  }

  onClickRetryBtn = () => {
    this.getJobById()
  }

  renderJobDetailsCard = () => {
    const {jobDetails, skill, similarJobs} = this.state
    // console.log(jobDetails)
    console.log(skill)

    return (
      <>
        <Header />
        <div className="job-details-main">
          <div className="job-item">
            <div className="company-title-card">
              <img
                className="company-logo"
                src={jobDetails.companyLogoUrl}
                alt="job details company logo"
              />
              <div className="company-requirement">
                <h2 className="title">{jobDetails.title}</h2>
                <div className="rating-card">
                  <p className="rating">
                    <BsFillStarFill className="rating-star" />
                    {jobDetails.rating}
                  </p>
                </div>
              </div>
            </div>
            <div className="summary-card">
              <div className="location-emp-card">
                <div className="location-card">
                  <HiLocationMarker className="icon" />
                  <p className="package-type-loc">{jobDetails.location}</p>
                </div>
                <div className="emp-type-card">
                  <BsBriefcaseFill className="icon" />
                  <p className="package-type-loc">
                    {jobDetails.employmentType}
                  </p>
                </div>
              </div>
              <p className="package-type-loc">{jobDetails.packagePerAnnum}</p>
            </div>
            <hr className="line" />
            <div className="visit-link-card">
              <h4>Description</h4>
              <a href={jobDetails.visit} className="visit-link">
                Visit <BiLinkExternal />
              </a>
            </div>

            <p className="description">{jobDetails.jobDescription}</p>
            <h4>Skills</h4>
            <ul className="ul-skill-card">
              {skill.map(eachSkill => (
                <li className="skill-item" key={eachSkill.name}>
                  <img
                    className="list-img"
                    src={eachSkill.image_url}
                    alt={eachSkill.name}
                  />
                  <h5>{eachSkill.name}</h5>
                </li>
              ))}
            </ul>
            <h4>Life at Company</h4>
            <div className="life-at-com">
              <p>{jobDetails.description}</p>
              <img
                className="com-img"
                src={jobDetails.companyImageUrl}
                alt="life at company"
              />
            </div>
            <h4>Similar Jobs</h4>
            <ul className="ul-sjobs">
              {similarJobs.map(eachSJob => (
                <li className="list-sJob" key={eachSJob.id}>
                  <div className="company-title-card">
                    <img
                      className="company-logo"
                      src={eachSJob.company_logo_url}
                      alt="similar job company logo"
                    />
                    <div className="company-requirement">
                      <h2 className="title">{eachSJob.title}</h2>
                      <div className="rating-card">
                        <p className="rating">
                          <BsFillStarFill className="rating-star" />
                          {eachSJob.rating}
                        </p>
                      </div>
                    </div>
                  </div>
                  <h4>Description</h4>
                  <p>{eachSJob.job_description}</p>
                  <div className="location-emp-card">
                    <div className="location-card">
                      <HiLocationMarker className="icon" />
                      <p className="package-type-loc">{eachSJob.location}</p>
                    </div>
                    <div className="emp-type-card">
                      <BsBriefcaseFill className="icon" />
                      <p className="package-type-loc">
                        {eachSJob.employment_type}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </>
    )
  }

  renderLoadingView = () => {
    console.log('loader')

    return (
      <>
        <Header />
        <div className="loader-container" data-testid="loader">
          <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
        </div>
      </>
    )
  }

  renderFailureView = () => {
    console.log('failureView')

    return (
      <>
        <Header />
        <div className="failure-card">
          <img
            className="failure-img"
            src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
            alt="failure view"
          />
          <h3>Oops! Something Went Wrong</h3>
          <p>We cannot seem to find the page you are looking for</p>
          <button
            className="retry-button"
            type="button"
            onClick={this.onClickRetryBtn}
          >
            Retry
          </button>
        </div>
      </>
    )
  }

  render() {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstents.inProgress:
        return this.renderLoadingView()

      case apiStatusConstents.success:
        return this.renderJobDetailsCard()

      case apiStatusConstents.failure:
        return this.renderFailureView()

      default:
        return null
    }
  }
}
export default JobItem
