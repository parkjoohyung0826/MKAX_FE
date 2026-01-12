'use client';

import styled from '@emotion/styled';

const StyledMain = styled.main`
  padding: 2rem;
  background-color: #f0f0f0;
  color: #333;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  h1 {
    color: #0070f3;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.1rem;
  }
`;

export default function Home() {
  return (
    <StyledMain>
      <h1>Welcome to MKAX FE</h1>
      <p>Next.js with Yarn Berry PnP</p>
    </StyledMain>
  );
}

