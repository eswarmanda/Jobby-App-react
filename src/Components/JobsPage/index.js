import {Component} from 'react'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import {BsSearch, BsFillStarFill, BsBriefcaseFill} from 'react-icons/bs'
import {HiLocationMarker} from 'react-icons/hi'
import Cookies from 'js-cookie'
import Header from '../Header'
import './index.css'

// These are the lists used in the application. You can move them to any component needed.
const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstents = {
  initial: 'INITIAL',
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class JobsPage extends Component {
  state = {
    dataList: '',
    profileData: '',
    employmentTypeId: '',
    salaryRangeId: '',
    array1: [],
    searchInput: '',
    apiStatus: apiStatusConstents.initial,
    apiProfileStatus: apiStatusConstents.initial,
  }

  componentDidMount() {
    this.getApiData()
    this.getProfileData()
  }

  getProfileData = async () => {
    const token = Cookies.get('jwt_token')
    this.setState({apiProfileStatus: apiStatusConstents.inProgress})
    const profileUrl = 'https://apis.ccbp.in/profile'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const profileResponse = await fetch(profileUrl, options)

    const profileData = await profileResponse.json()
    if (profileResponse.ok === true) {
      const formattedProfileData = {
        name: profileData.profile_details.name,
        profileImageUrl: profileData.profile_details.profile_image_url,
        shortBio: profileData.profile_details.short_bio,
      }
      this.setState({
        profileData: formattedProfileData,
        apiProfileStatus: apiStatusConstents.success,
      })
    } else {
      this.setState({
        apiProfileStatus: apiStatusConstents.failure,
      })
    }
  }

  getApiData = async () => {
    const {employmentTypeId, salaryRangeId, searchInput} = this.state
    this.setState({apiStatus: apiStatusConstents.inProgress})
    const token = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs?employment_type=${employmentTypeId}&minimum_package=${salaryRangeId}&search=${searchInput}`
    console.log(url)

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const response = await fetch(url, options)

    if (response.ok === true) {
      const data = await response.json()
      //   console.log(data)
      const formattedData = data.jobs.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        jobDescription: eachJob.job_description,
        Id: eachJob.id,
        location: eachJob.location,
        packagePerAnnum: eachJob.package_per_annum,
        rating: eachJob.rating,
        title: eachJob.title,
      }))
      this.setState({
        dataList: formattedData,
        apiStatus: apiStatusConstents.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstents.failure,
      })
    }
  }

  onClickEmployeeType = event => {
    const {array1} = this.state
    const array2 = event.target.value
    if (array1.includes(event.target.value)) {
      array1.pop(array2)
    } else {
      array1.push(array2)
    }
    console.log(array1.join(','))

    this.setState({employmentTypeId: array1}, this.getApiData)
    // console.log(event.target.value)
  }

  onClickSalaryType = event => {
    this.setState({salaryRangeId: event.target.value}, this.getApiData)
    console.log(event.target.value)
  }

  onChangeSearchInput = event => {
    if (event.key === 'Enter') {
      this.setState({searchInput: event.target.value}, this.getApiData)
    }
    this.setState({searchInput: event.target.value})
  }

  onClickSearchButton = () => {
    this.getApiData()
  }

  renderTypeOfFilters = () => {
    console.log('filter')
    return (
      <div>
        <div>
          <h2>Type of Employment</h2>
          <ul className="filter-list">
            {employmentTypesList.map(eachItem => (
              <li className="filter-option" key={eachItem.employmentTypeId}>
                <input
                  className="input-option"
                  type="checkbox"
                  value={eachItem.employmentTypeId}
                  id={eachItem.employmentTypeId}
                  onClick={this.onClickEmployeeType}
                />
                <label htmlFor={eachItem.employmentTypeId}>
                  {eachItem.label}
                </label>
              </li>
            ))}
          </ul>
        </div>
        <hr className="line1" />
        <div>
          <h2>Salary range</h2>
          <ul className="filter-list">
            {salaryRangesList.map(eachItem => (
              <li className="filter-option" key={eachItem.salaryRangeId}>
                <input
                  className="input-option"
                  type="radio"
                  id={eachItem.salaryRangeId}
                  value={eachItem.salaryRangeId}
                  name="option"
                  onClick={this.onClickSalaryType}
                />
                <label htmlFor={eachItem.salaryRangeId}>{eachItem.label}</label>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  onClickProfileRetryBtn = () => {
    this.getProfileData()
  }

  onClickDataRetryBtn = () => {
    this.getApiData()
  }

  renderProfileAndFilterCardView = () => {
    console.log('profile')
    return (
      <div className="profile-type-card">
        {this.renderProfile()}
        <hr className="line1" />
        {this.renderTypeOfFilters()}
      </div>
    )
  }

  renderLoadingView = () => {
    console.log('loader')

    return (
      <>
        <div className="loader-container1" data-testid="loader">
          <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
        </div>
      </>
    )
  }

  renderProfileView = () => {
    const {profileData} = this.state

    return (
      <div className="profile-card">
        <img src={profileData.profileImageUrl} alt="profile" />
        <h1 className="profile-name">{profileData.name}</h1>
        <p className="short-Bio">{profileData.shortBio}</p>
      </div>
    )
  }

  renderProfileFailureView = () => {
    console.log('profileFail')
    return (
      <div>
        <button
          className="retry-button"
          type="button"
          onClick={this.onClickProfileRetryBtn}
        >
          Retry
        </button>
      </div>
    )
  }

  renderProfile = () => {
    const {apiProfileStatus} = this.state
    switch (apiProfileStatus) {
      case apiStatusConstents.inProgress:
        return this.renderLoadingView()
      case apiStatusConstents.success:
        return this.renderProfileView()
      case apiStatusConstents.failure:
        return this.renderProfileFailureView()

      default:
        return null
    }
  }

  renderDataListCard = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstents.inProgress:
        return this.renderLoadingView()
      case apiStatusConstents.success:
        return this.renderSearchData()
      case apiStatusConstents.failure:
        return this.renderDataListFailure()

      default:
        return null
    }
  }

  renderSearchData = () => {
    const {dataList} = this.state
    return (
      <>
        {dataList.length > 0 ? (
          <ul className="ul-card">
            {dataList.map(eachJob => (
              <Link
                className="link-item"
                key={eachJob.Id}
                to={`/jobs/${eachJob.Id}`}
              >
                <li className="list-item" key={eachJob.Id}>
                  <div className="company-title-card">
                    <img
                      className="company-logo"
                      src={eachJob.companyLogoUrl}
                      alt="company logo"
                    />
                    <div className="company-requirement">
                      <h2 className="title">{eachJob.title}</h2>
                      <div className="rating-card">
                        <p className="rating">
                          <BsFillStarFill className="rating-star" />
                          {eachJob.rating}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="summary-card">
                    <div className="location-emp-card">
                      <div className="location-card">
                        <HiLocationMarker className="icon" />
                        <p className="package-type-loc">{eachJob.location}</p>
                      </div>
                      <div className="emp-type-card">
                        <BsBriefcaseFill className="icon" />
                        <p className="package-type-loc">
                          {eachJob.employmentType}
                        </p>
                      </div>
                    </div>
                    <p className="package-type-loc">
                      {eachJob.packagePerAnnum}
                    </p>
                  </div>
                  <hr className="line" />
                  <h5>Description</h5>
                  <p className="description">{eachJob.jobDescription}</p>
                </li>
              </Link>
            ))}
          </ul>
        ) : (
          <div className="no-job-card">
            <img
              className="no-jobs-found"
              src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
              alt="no jobs"
            />
            <h3>No Jobs Found</h3>
            <p>We could not find any jobs. Try other filters</p>
          </div>
        )}
      </>
    )
  }

  renderDataListFailure = () => {
    console.log('dataFailure')
    return (
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
          onClick={this.onClickDataRetryBtn}
        >
          Retry
        </button>
      </div>
    )
  }

  renderSearchResultsView = () => {
    const {searchInput} = this.state
    return (
      <div className="search-job-list">
        <div className="search-input-card">
          <input
            type="search"
            className="search-input"
            placeholder="Search Jobs"
            value={searchInput}
            onChange={this.onChangeSearchInput}
            onKeyDown={this.onChangeSearchInput}
          />
          <button
            className="search-btn"
            type="button"
            data-testid="searchButton"
            onClick={this.onClickSearchButton}
          >
            <BsSearch className="search-icon" />
          </button>
        </div>
        {this.renderDataListCard()}
      </div>
    )
  }

  render() {
    return (
      <>
        <Header />
        <div className="jobs-card">
          <div className="container-job-card">
            {this.renderProfileAndFilterCardView()}
            {this.renderSearchResultsView()}
          </div>
        </div>
      </>
    )
  }
}
export default JobsPage
