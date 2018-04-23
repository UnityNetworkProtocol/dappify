/* ------------------------- External Dependencies -------------------------- */
import React from 'react'
/* ------------------------- Internal Dependencies -------------------------- */
import { Flex, Box, Image, Button, Span } from 'atomic'
/* --------------------------- Styled Components ---------------------------- */
import AuthorizationLogin from 'containers/authentication/AuthorizationLogin'
/* ------------------------------- Component -------------------------------- */
const UserProfile = (props) => !props.user 
?
<Flex 
  align="center"
  justify={[ 'center']}
  color='white'
  pr={[null, null, 15]}
  py={[5, 5, 'inherit']}
  w={[1]}>
  <Box px={10}>
    <AuthorizationLogin bg='google' children='Google' providerSelection='google' />
  </Box>
  <Box px={10}>
    <AuthorizationLogin bg='twitter' children='Twitter' providerSelection='twitter' />
  </Box>
  <Box px={10}>
    <AuthorizationLogin bg='github' children='Github' providerSelection='github' />
  </Box>
</Flex>
:
<Flex {...props} direction={['row']} justify='center' align={['center', null, 'center']} wrap='wrap' textAlign={['center']} w={[1]} >
  <Box flex={['1 1 0', '2 1 auto']}  >
    <Span>{ props.user.displayName}</Span>
  </Box>
  <Box flex={['1 1 0', '1 1 auto']}  >
    <Image src={props.user.photoURL} h={[37.5]} w={[37.5]} br={0.5} bs={[2]} b={['2px solid transparent']} bc={['white']} />
  </Box>
  <Box flex={['1 1 0', '2 1 auto']}  >
    <Button onClick={props.logout} f={[0]} >Logout</Button>
  </Box>
</Flex>
  

/* ---------------------------- Export Package ------------------------------ */
export default UserProfile