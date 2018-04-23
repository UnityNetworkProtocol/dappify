/* ------------------------- External Dependencies -------------------------- */
import React from 'react'
/* ------------------------- Internal Dependencies -------------------------- */
import { Image } from 'atomic'
/* --------------------------- Styled Components ---------------------------- */
import AuthorizationLogin from 'containers/authentication/AuthorizationLogin'
/* ------------------------------- Component -------------------------------- */
const UserProfile = (props) => !props.user 
?
<AuthorizationLogin gradient='turqoise' children='Login/Register' providerSelection='google' />
:
<Image src={props.user.photoURL} h={[37.5]} w={[37.5]} br={0.5} bs={[2]} b={['2px solid transparent']} bc={['white']} />
  

/* ---------------------------- Export Package ------------------------------ */
export default UserProfile