/* ------------------------- External Dependencies -------------------------- */
import React from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar'
/* ------------------------- Internal Dependencies -------------------------- */
import { Fixed, Drawer } from 'particles'
import Absolute from 'atoms/Absolute'
import Span from 'atoms/Span'
import DrawerClose from 'containers/drawer/DrawerClose'
/* ------------------------------- Component -------------------------------- */
export default props =>
<Absolute top={props.drawer} bottom={props.drawer} left={props.drawer} right={props.drawer} z={1000} >
  <Drawer
      boxShadow={[4]}
      br={'0 25px 25px 0'}
      open={props.drawer}
      position='left'
      py={50}
      color='charcoal'
      gradient='grayLight'
      overflow='hidden'
      z={200}
    >
    <Absolute top right br={9999} mt={[15]} mr={[15]} color="white" gradient='purple' p={[5]}  >
    <DrawerClose><Span f={[2]} level={[6]} mb={0}><a>x</a></Span></DrawerClose></Absolute>
    <PerfectScrollbar wheelPropagation>
      {props.children}
    </PerfectScrollbar>
	</Drawer>
  {!props.drawer ? null : <Fixed top bottom left right onClick={props.drawerClose} w={1} height={1} z={100} /> }
  </Absolute>
