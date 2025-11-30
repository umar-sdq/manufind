vi.mock('../Components/AuthContext/AuthContext', () => {
  const React = require('react');
  return {
    AuthProvider: ({ children }) => React.createElement(React.Fragment, null, children),
    useAuth: () => ({
      authData: { id: 1, nom: 'Test Prestataire', email: 'pres@test.com', role: 'prestataire' },
      login: vi.fn(),
      logout: vi.fn(),
    }),
  };
});

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProfilePrestataire from '../Components/ProfilePrestataire/ProfilePrestataire';

const MockAuthContext = ({ children }) => {
  return (
    <BrowserRouter>
      {children}
    </BrowserRouter>
  );
};

describe('ProfilPrestataire', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, demandes: [] }),
    });
  });

  it('devrait afficher la section compte', async () => {
    render(
      <MockAuthContext>
        <ProfilePrestataire />
      </MockAuthContext>
    );

    await waitFor(() => {
      expect(screen.getByText('Informations du compte')).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('devrait afficher les performances', async () => {
    render(
      <MockAuthContext>
        <ProfilePrestataire />
      </MockAuthContext>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Performance')).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('devrait afficher le nom du prestataire', async () => {
    render(
      <MockAuthContext>
        <ProfilePrestataire />
      </MockAuthContext>
    );

    await waitFor(() => {
      expect(screen.getByText(/Bonjour, Test Prestataire/i)).toBeInTheDocument();
    }, { timeout: 2000 });
  });
});