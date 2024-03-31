import React from 'react';
import styled from 'styled-components';


const NavContainer = styled.nav`
  background-color: #333;
  color: #fff;
  padding: 10px 20px;
`;


const LinksContainer = styled.div`
  display: flex;
`;


const NavLink = styled.a`
  color: #fff;
  text-decoration: none;
  padding: 0 10px;
  &:hover {
    text-decoration: underline;
  }
`;


const NavBar = () => {
  return (
    <NavContainer>
      
      <LinksContainer>
        <NavLink href="/">CodeBugged Task</NavLink>
      </LinksContainer>
    </NavContainer>
  );
};

export default NavBar;
