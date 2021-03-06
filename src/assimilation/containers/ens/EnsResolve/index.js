/* ------------------------- External Dependencies -------------------------- */
import React from 'react';
import {
  compose,
  lifecycle,
} from 'recompose'
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'

/* ------------------------- Internal Dependencies -------------------------- */
import Form from './form'
import { createValidator, required } from 'logic/forms/validation'

/*--- Redux Store ---*/
import { fromEthers } from 'assimilation/store/selectors'
import ethers from 'assimilation/store/ethers/actions'
/* --------------------------- Component Entry ------------------------------ */
/*-- Event Handlers ---*/
const onSubmit = (data, dispatch, props) => new Promise((resolve, reject) => {
  const submission = data.ethEnsName
  dispatch(ethers.ensResolveName("REQUEST")(
    submission, 
    {
      delta: `resolve|form`
    }
  ))
})

/*---*--- Lifecylce Methods ---*---*/
const QueryLifecycle = lifecycle({
  /*--- Component Mount ---*/
  componentDidMount()
  {

  },

  /*--- Component Update ---*/
  componentDidUpdate(prevProps)
  {
    if(this.props.submitting === true) {
      this.props.reset()
    }
  }
})


/* ----------------------------- Form Validation -------------------------------- */
const validate = createValidator({
  'detherPassword': required
})

const config = {
  form: 'FormDetherSendToBuyer',
  fields: [
    'blockchainAddress',
    'blockchainAmount',
    'detherPassword',
  ],
  destroyOnUnmount: true,
  onSubmit,
  validate
}

/*-* Redux *-*/
const mapStateToProps = (state, props) => ({
    data: fromEthers.getDeltaData(state, `resolve|form`),
    status: fromEthers.getDeltaStatus(state, `resolve|form`),
  }
)

const mapDispatchToProps = (dispatch, props) => ({

})

/* ----------------------------- Export -------------------------------- */
const FormConfiguration = reduxForm(config)
const FormRedux = props => <Form { ...props} />

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  FormConfiguration,
  QueryLifecycle,
)(FormRedux);
