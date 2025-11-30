vi.mock('../Components/AuthContext/AuthContext', () => {
  const React = require('react');
  return {
    AuthProvider: ({ children }) => React.createElement(React.Fragment, null, children),
    useAuth: () => ({
      authData: { id: 1, nom: 'Test Client', email: 'test@example.com', role: 'client' },
      login: vi.fn(),
      logout: vi.fn(),
    }),
  };
});

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProfileClient from '../Components/ProfileClient/ProfileClient';

const Wrapper = ({ children }) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
);

describe('ProfilClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, demandes: [] })
    });
  });

  it('devrait afficher la section profil', () => {
    render(<Wrapper><ProfileClient /></Wrapper>);
    expect(screen.getByText('Informations personnelles')).toBeInTheDocument();
  });

  it('devrait afficher les statistiques', async () => {
    render(<Wrapper><ProfileClient /></Wrapper>);
    await waitFor(() => {
      expect(screen.getByText("Résumé d'activité")).toBeInTheDocument();
    });
  });
});