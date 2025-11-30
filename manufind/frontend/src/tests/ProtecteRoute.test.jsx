vi.mock('../Components/AuthContext/AuthContext', () => {
  const React = require('react');
  return {
    AuthProvider: ({ children }) => React.createElement(React.Fragment, null, children),
    useAuth: () => ({
      authData: { id: 1, nom: 'Test User', email: 'test@ex.com', role: 'client' },
      login: vi.fn(),
      logout: vi.fn(),
    }),
  };
});

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProtectedRoute from '../Components/ProtectedRoute/ProtectedRoute';

const Wrapper = ({ roles }) => (
  <BrowserRouter>
    <ProtectedRoute allowedRoles={roles} />
  </BrowserRouter>
);

describe('ProtectedRoute', () => {
  it('rende sans erreur pour rôle autorisé', () => {
    render(<Wrapper roles={['client']} />);
    expect(true).toBe(true);
  });

  it('rende sans erreur pour plusieurs rôles', () => {
    render(<Wrapper roles={['client','prestataire']} />);
    expect(true).toBe(true);
  });
});