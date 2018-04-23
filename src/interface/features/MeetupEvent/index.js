/* ------------------------- External Dependencies -------------------------- */
import React from 'react'
import { connect } from 'react-redux';
import { compose, lifecycle, withState } from 'recompose'
import { reduxForm, change } from 'redux-form'
/* ------------------------- Internal Dependencies -------------------------- */
import { createValidator, required } from 'logic/forms/validation'
import Form from './form'

// Ethers
import ethers from 'assimilation/store/ethers/actions'
import EthersContractInformation from 'assimilation/components/ethers/EthersContractInformation'
import { fromEthers } from 'assimilation/store/selectors'

// uPort
import { fromUport } from 'assimilation/store/selectors'
import { uPortSendTransactionRequest } from 'assimilation/store/actions'

// Contract | MeetupEvent
import {MeetupEvent} from 'contracts'
/* ---------------------------- Module Package ------------------------------ */

/*-* State Management *-*/
const ContractAttendeesListStatus = withState(
  'attendeeListScan',
  'attendeeListScanToggle',
  true
)
const ContractAttendeesStatus = withState(
  'attendeeScan',
  'attendeeScanToggle',
  true
)
const IdentityLoaded = withState(
  'identityLoaded',
  'identityLoadToggle',
  false
)
const AttendeeList = withState(
  'attendeeList',
  'attendeeListAdd',
  []
)

/*-* Recompose *-*/
const QueryLifecycle = lifecycle(
{
  componentDidMount()
  {

    this.props.contractCreate(this.props.ethAbi)

  },
  componentDidUpdate(prevProps)
  {
    if(this.props.identityStatus && !this.props.identityLoaded) {
      this.props.dispatch(change("FormMeetupEvent", "nameDisplay", this.props.identityData.name))
      this.props.identityLoadToggle(toggle=>!toggle)
    }
    /**
     * Stage 1 | Scan Blockchain for Attendee address list
     */
    if(this.props.contractState && this.props.attendeeListScan) {
      this.props.getAttendees()
      this.props.attendeeListScanToggle(toggle=>!toggle)
    }

    /**
     * Stage 2 | Get Attendee Information
     */
    if(
      this.props.contractState && !this.props.attendeeListScan 
      && this.props.attendeeScan && this.props.attendeeListData[0]) 
      {
      if(this.props.attendeeListData[0]){
        this.props.attendeeListData[0].map(attendee=>{
          this.props.getAttendeeInformation(attendee)
        })
      }
      // this.props.attendeeListAdd
      // // this.props.getAttendees()

      this.props.attendeeScanToggle(toggle=>!toggle)
    }
  }
})

/*-* Redux *-*/
const mapStateToProps = (state, props) => {
  return {
    // uPort
    identityData: fromUport.getDeltaData(state, `credentials`),
    identityStatus: fromUport.getDeltaStatus(state, `credentials`),
    rsvpData: fromUport.getDeltaData(state, 'contract|transaction|rsvp'),
    rsvpStatus: fromUport.getDeltaStatus(state, `contract|transaction|rsvp`),
    // Ethers
    contractState: fromEthers.getDeltaStatus(state,  `contract|${props.contractName}|${props.contractAddress}|create`),
    attendeeListData: fromEthers.getDeltaData(state, `contract|${props.contractName}|${props.contractAddress}|attendeeAddresses`),
    attendeeListStatus: fromEthers.getDeltaStatus(state, `contract|${props.contractName}|${props.contractAddress}|attendeeAddresses`),
    attendeeInformationList: fromEthers.getStartingData(state, `contract|item|${props.contractName}|${props.contractAddress}|`),
    attendeeData: fromEthers.getDeltaData(state, "contract|meetup|attendeeInformation"),
    attendeeStatus: fromEthers.getDeltaStatus(state, "contract|meetup|attendeeInformation"),
  }
}


const mapDispatchToProps = (dispatch, props) => ({
  /**
   * Contract Create
   * Initialize a contract via a Saga callback
   */
  contractCreate: ()=>dispatch(ethers.contractCreate('REQUEST')(
    {
      ethAddress: props.contractAddress,
      ethAbi: MeetupEvent.abi,
      contractName: props.contractName
    },
    {
      delta: `contract|${props.contractName}|${props.contractAddress}|create`,
      network: {
        chain: props.chain || 'rinkeby',
      }
    }
  )),

  /**
   * Attendees List
   * Scan the MeetupEvent Smart Contract for registered attendees
   */
  getAttendees: ()=>dispatch(ethers.contractCall('REQUEST')(
    {
      contractName: props.contractName,
      contractFunction: 'getAttendeeAddresses' // Todo (kamescg): Check to see if it's required to return a nested array in smart contract?
    },
    {
      delta: `contract|${props.contractName}|${props.contractAddress}|attendeeAddresses`,
      network: 'rinkeby'
    }
  )),
  /**
   * Attendee Information
   * Scan the MeetupEvent Smart Contract for registered attendees
   */
  getAttendeeInformation: (attendee)=>dispatch(ethers.contractCall('REQUEST')(
    {
      contractName: props.contractName,
      contractFunction: 'getAttendeeInfo',
      contractParams: [
        attendee
      ]
    },
    {
      delta:`contract|item|${props.contractName}|${props.contractAddress}|${attendee}`,
      network: 'rinkeby'
    }
  )),
  uPortRsvp: (name)=>dispatch(uPortSendTransactionRequest({
    payload: {
      contractABI: MeetupEvent.abi,
      contractAddress: props.contractAddress,
      contractFunction: "rsvpMe",
      contractParams: [
        name
      ]
    },
    metadata: {
      delta: 'contract|transaction|rsvp'
    }
  })),
})


/* ----------------------------- Redux Form -------------------------------- */
/*-- Event Handlers ---*/
const onSubmit = (data, dispatch, props) => new Promise((resolve, reject) => {
  props.uPortRsvp(data.nameDisplay)
})

const validate = createValidator({
  'nameDisplay': required,
})

const config = {
  form: 'FormMeetupEvent',
  fields: [
    'nameDisplay',
  ],
  destroyOnUnmount: true,
  onSubmit,
  validate
}

/* ----------------------------- Export -------------------------------- */
const FormConfiguration = reduxForm(config)
export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  FormConfiguration,
  AttendeeList,
  ContractAttendeesListStatus,
  ContractAttendeesStatus,
  IdentityLoaded,
  QueryLifecycle,
)(Form);