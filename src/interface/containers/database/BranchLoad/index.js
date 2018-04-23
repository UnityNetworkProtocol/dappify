/* ------------------------- External Dependencies -------------------------- */
import React from 'react'
import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose'
/* ---------------------------- Module Package ------------------------------ */
import { databaseReadRequest } from 'store/departments/actions'

/* ---------------------------- Module Package ------------------------------ */
/* ---------------------------- Component Lifecycle ------------------------------ */
const QueryLifecycle = lifecycle(
{
  componentDidMount()
  {
    if (this.props.branch && this.props.delta ) {
      this.props.loadImage({
        metadata: {
          branch: this.props.branch,
          delta: this.props.delta,
        }
      })
    }
  }
})


const mapDispatchToProps = dispatch => ({
  loadImage: (action)=>dispatch(databaseReadRequest(action)),
})

const Component = ()=> <div></div>

export default compose(
  connect(null, mapDispatchToProps),
  QueryLifecycle,
)(Component);
