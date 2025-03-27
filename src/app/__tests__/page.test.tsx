import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '../page';

jest.mock('@chakra-ui/react', () => ({
  Box: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Container: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Heading: ({ children }: { children: React.ReactNode }) => <h1>{children}</h1>,
  Text: ({ children }: { children: React.ReactNode }) => <p>{children}</p>,
  VStack: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('Home Page', () => {
  it('renders welcome message', () => {
    render(<Home />);
    expect(screen.getByText(/Welcome to Next.js Base/i)).toBeInTheDocument();
  });

  it('renders feature sections', () => {
    render(<Home />);
    expect(screen.getByText(/Modern Stack/i)).toBeInTheDocument();
    expect(screen.getByText(/AI Integration/i)).toBeInTheDocument();
    expect(screen.getByText(/Database Ready/i)).toBeInTheDocument();
    expect(screen.getByText(/Authentication/i)).toBeInTheDocument();
  });
}); 