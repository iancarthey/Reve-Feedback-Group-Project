// react, redux imports
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import AddFocusForm from './AddFocusForm';

//library import
import RGL, { WidthProvider } from 'react-grid-layout';

//material-ui imports
import Modal from '@material-ui/core/Modal';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import InstructorNav from '../../Nav/InstructorNav';
import { USER_ACTIONS } from '../../../redux/actions/userActions';

//css import
import './instructorSchedule.css';

const ReactGridLayout = WidthProvider(RGL);

const mapStateToProps = state => ({
  user: state.user,
  state
});

//Style properties for add new user modal
function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const styles = theme => ({
  paper: {
    position: 'absolute',
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
  },
});
//end styling properties 

class InstructorSchedulePage extends Component {
  static defaultProps = {
    className: "layout",
    items: 50,
    cols: 5,
    rowHeight: 30,
    width: '100%',
    onLayoutChange: function () { },
    // This turns off compaction so you can place items wherever.
    verticalCompact: false
  };

  constructor(props) {
    super(props);

    const layout = this.generateLayout();
    this.state = {
      open: false,
      layout: { layout }
    }
  }
  
  //function for generating schedule items
  generateDOM() {
    return (this.props.state.scheduleReducer.focusReducer.map((item) => {
      return (
        <div key={item.newFocus.name} className="ian">
          <span className="text">{item.newFocus.name}</span>
        </div>
      );
    }));
  }

  //function for generating items location on dom
  generateLayout() {
    return (this.props.state.scheduleReducer.focusReducer.map((item, i) => {
      console.log(item);
      return {
        x: item.newFocus.x,
        y: item.newFocus.y,
        w: item.newFocus.w,
        h: item.newFocus.h,
        i: item.newFocus.name
      };
    }));
  }

  //function for changing layout
  onLayoutChange(layout) {
    this.props.onLayoutChange(layout);
  }

  //on click of new user button, open modal
  handleCreateLessonModal = () => {
    this.setState({ open: true });
  };

  //on click of outside modal, close modal
  handleClose = () => {
    this.setState({ open: false });
  };

  componentDidMount() {
    this.props.dispatch({ type: USER_ACTIONS.FETCH_USER });
    this.props.dispatch({
      type: 'FETCH_PROGRAM_WEEKS',
      payload: this.props.match.params
    })
  }

  componentDidUpdate() {
    if (!this.props.user.isLoading && this.props.user.userName === null) {
      this.props.history.push('/home');
    }
  }


  render() {
    
    let content = null;

    const { classes } = this.props;

    let weekList = this.props.state.scheduleReducer.weekReducer.map((week) => {
      return (<Button variant="fab" color="primary" key={week.id}>{week.number} </Button>)
    })

    let scheduleItem = this.props.state.scheduleReducer.focusReducer.map((item) => {
      return (
        <div key={item.newFocus.name} className="ian">
          <span className="text">{item.newFocus.name}</span>
        </div>
      );
    });

    if (this.props.user.userName && this.props.user.userName.instructor) {
      content = (
        <div>
        
        


          <h1>
            INSTRUCTOR SCHEDULE PAGE
          </h1>
          <div>{weekList}</div>
          <Button variant="outlined" color="primary" onClick={this.handleCreateLessonModal}>Add Lesson</Button><br />
          <Button variant="outlined" color="primary">Finalize Schedule</Button>
          <div>
            <Modal
            aria-labelledby="Add New Focus"
            open={this.state.open}
            onClose={this.handleClose}
            >
            <div style={getModalStyle()} className={classes.paper}>
              <AddFocusForm  />
            </div>
            </Modal>
          </div>

          {/* Schedule Container */}
          <div>
            <table id="scheduleTable">
            <thead>
              <tr id="tableHeader">
                <th>Monday</th>
                <th>Tueday</th>
                <th>Wednesday</th>
                <th>Thursday</th>
                <th>Friday</th>
              </tr>
            </thead>
            </table>
            <ReactGridLayout
              layout={this.state.layout.layout}
              onLayoutChange={this.onLayoutChange}
              {...this.props}
            >
              {this.generateDOM()}
            </ReactGridLayout>
          </div>
          {/* End Schedule Container */}

        </div>
      );
    }

    return (
      <div>
        <InstructorNav program_id={this.props.match.params.program_id}/>
        {content}
      </div>
    );
  }
}

const InstructorScheduleWithStyles = withStyles(styles)(InstructorSchedulePage)

// this allows us to use <App /> in index.js
export default connect(mapStateToProps)(InstructorScheduleWithStyles);