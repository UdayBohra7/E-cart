import styled from '@emotion/styled';
import React from 'react';
import logo from "@/assets/logo.png";

interface SidebarHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

const StyledSidebarHeader = styled.div`
  height: 80px;
  display: flex;
  align-items: center;
  padding: 0 20px;

  > div {
    width: 100%;
    overflow: hidden;
  }
`;

const StyledLogo = styled.div`
  width: 100%;
  min-width: 35px;
  min-height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  }
`;

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({ children, ...rest }) => {
  return (
    <StyledSidebarHeader {...rest}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <StyledLogo><img width="100" src={logo} alt="Workflow" /></StyledLogo>
      </div>
    </StyledSidebarHeader>
  );
};
