import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginForm from '../Components/LoginForm/LoginForm';
import { AuthProvider } from '../Components/AuthContext/AuthContext';

const FormulaireConnexionSimulé = () => (
  <BrowserRouter>
    <AuthProvider>
      <LoginForm />
    </AuthProvider>
  </BrowserRouter>
);

describe('FormulaireConnexion', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it('devrait afficher le formulaire de connexion', () => {
    render(<FormulaireConnexionSimulé />);
    
    expect(screen.getByText('Connexion')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('exemple@courriel.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
  });

  it('devrait mettre à jour la valeur du champ email', () => {
    render(<FormulaireConnexionSimulé />);
    
    const champEmail = screen.getByPlaceholderText('exemple@courriel.com');
    fireEvent.change(champEmail, { target: { value: 'test@example.com' } });
    
    expect(champEmail.value).toBe('test@example.com');
  });

  it('devrait mettre à jour la valeur du champ mot de passe', () => {
    render(<FormulaireConnexionSimulé />);
    
    const champMotDePasse = screen.getByPlaceholderText('••••••••');
    fireEvent.change(champMotDePasse, { target: { value: 'motdepasse123' } });
    
    expect(champMotDePasse.value).toBe('motdepasse123');
  });

  it('devrait afficher le lien vers l\'inscription', () => {
    render(<FormulaireConnexionSimulé />);
    
    const lien = screen.getByText('Créer un compte.');
    expect(lien).toBeInTheDocument();
  });

  it('devrait soumettre le formulaire avec les bonnes données', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        user: {
          id: 1,
          nom: 'Bobby Chomedey',
          email: 'bobby45zone2@test.com',
          role: 'client'
        }
      })
    });

    render(<FormulaireConnexionSimulé />);
    
    fireEvent.change(screen.getByPlaceholderText('exemple@courriel.com'), {
      target: { value: 'bobby45zone2@test.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), {
      target: { value: 'motdepasse123' }
    });
    
    fireEvent.click(screen.getByText('Se connecter'));
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:5001/auth/login',
        expect.any(Object)
      );
    });
  });
});