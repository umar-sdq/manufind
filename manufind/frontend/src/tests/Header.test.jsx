import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from '../Components/Header/Header';
import { AuthProvider } from '../Components/AuthContext/AuthContext';

const Wrapper = ({ children }) => (
  <BrowserRouter><AuthProvider>{children}</AuthProvider></BrowserRouter>
);

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('affiche ManuFind et liens publics', () => {
    render(<Wrapper><Header /></Wrapper>);
    expect(screen.getAllByText(/ManuFind/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Services/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Guide/i).length).toBeGreaterThanOrEqual(1);
  });
});