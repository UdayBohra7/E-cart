import styled from '@emotion/styled';
import React from 'react';
import logo from "@/assets/logo.svg";

interface SidebarHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

const StyledSidebarHeader = styled.div`
  height: 160px;
  display: flex;
  align-items: center;
  padding: 0;

  > div {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
`;

const StyledLogo = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({ children, ...rest }) => {
  return (
    <StyledSidebarHeader {...rest}>
      <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <StyledLogo><img style={{ width: '100%', height: '100%', objectFit: 'contain' }} src={logo} alt="Workflow" /></StyledLogo>
      </div>
    </StyledSidebarHeader>
  );
};
