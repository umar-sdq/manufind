vi.mock('../Components/AuthContext/AuthContext', () => {
  const React = require('react');
  return {
    AuthProvider: ({ children }) => React.createElement(React.Fragment, null, children),
    useAuth: () => ({
      authData: { id: 1, nom: 'Test Prestataire', email: 'test@ex.com', role: 'prestataire' },
    }),
  };
});

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import RequestTab from '../Components/RequestTab/RequestTab';

const Wrapper = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('RequestTab', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, demandes: [] }),
    });
  });

  it('affiche le titre', () => {
    render(<Wrapper><RequestTab /></Wrapper>);
    expect(screen.getByText(/Demandes Acceptées/i)).toBeInTheDocument();
  });

  it('affiche message vide quand pas de demandes', async () => {
    render(<Wrapper><RequestTab /></Wrapper>);
    await waitFor(() => {
      expect(screen.getByText(/Aucune demande acceptée/i)).toBeInTheDocument();
    });
  });
});