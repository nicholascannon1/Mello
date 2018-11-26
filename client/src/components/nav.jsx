import React from 'react';
import { 
  NavbarBrand, 
  Navbar,
  NavbarToggler,
  Collapse,
  NavItem,
  NavLink,
  Nav } from 'reactstrap';

class MelloNav extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = { isOpen: false };
  }

  toggle() {
    this.setState({ isOpen: !this.state.isOpen });
  }

  render() {
    return (
      <Navbar color="light" light expand="md">
        <NavbarBrand>Mello</NavbarBrand>
        <NavbarToggler onClick={ this.toggle } />
        <Collapse isOpen={ this.state.isOpen } navbar>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <NavLink>New List</NavLink>
            </NavItem>
            <NavItem>
              <NavLink>Logout</NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    );
  }
}

export default MelloNav;