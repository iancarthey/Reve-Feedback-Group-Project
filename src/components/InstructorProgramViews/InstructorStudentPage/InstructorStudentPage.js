import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import InstructorNav from '../../Nav/instructorNav';
import StudentList from './StudentList';

import { USER_ACTIONS } from '../../../redux/actions/userActions';



const mapStateToProps = state => ({
  user: state.user,
});

class InstructorStudentPage extends Component {
  componentDidMount() {
    this.props.dispatch({ type: USER_ACTIONS.FETCH_USER });
  }

  componentDidUpdate() {
    if (!this.props.user.isLoading && this.props.user.userName === null) {
      this.props.history.push('home');
    }
  }


  render() {

    let content = null;

    if (this.props.user.userName && this.props.user.userName.instructor) {
      content = (
        <div>
          <div className="managementNav">
          <ul>
          
            <li>
              <Link to="/InstructorStudent">
                Students
              </Link>
            </li>
            <li>
              <Link to="/InstructorFeedback">
                Feedback
              </Link>
            </li>
            <li>
              <Link to="/InstructorSchedule">
                Schedule
              </Link>
            </li>
      
          </ul>
          </div>

          <h1>
            INSTRUCTOR STUDENTS PAGE
          </h1>

          {/* Students Container */}
          <div>
            <StudentList />
          </div>
          {/* End Students Container */}
        
        </div>
      );
    }

    return (
      <div>
        <InstructorNav />
        {content}
      </div>
    );
  }
}

// this allows us to use <App /> in index.js
export default connect(mapStateToProps)(InstructorStudentPage);