import React from 'react';
import { NavLink } from 'react-router-dom';

const NavBar = () => {
  return (
    <div style={{ borderBottom: '10px solid black', paddingBottom: '30px', marginBottom: '24px' }}>
      <NavLink
        style={{ marginRight: '20px' }}
        to="/"
      >
        Home
      </NavLink>
    </div>
  );
}

export default NavBar;
