import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SignUpForm from '../Components/SignupForm/SignupForm';
import { AuthProvider } from '../Components/AuthContext/AuthContext';

const MockedSignupForm = () => (
  <BrowserRouter>
    <AuthProvider>
      <SignUpForm />
    </AuthProvider>
  </BrowserRouter>
);

describe('FormulaireInscription', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it('devrait afficher le formulaire d\'inscription', () => {
    render(<MockedSignupForm />);
    
    expect(screen.getByText('Créer un compte')).toBeInTheDocument();
    expect(screen.getByText('S\'inscrire')).toBeInTheDocument();
  });

  it('devrait avoir tous les champs requis', () => {
    render(<MockedSignupForm />);
    
    expect(screen.getByText('Nom d\'utilisateur')).toBeInTheDocument();
    expect(screen.getByText('Adresse courriel')).toBeInTheDocument();
    expect(screen.getByText('Mot de passe')).toBeInTheDocument();
    expect(screen.getByText('Confirmer le mot de passe')).toBeInTheDocument();
  });

  it('devrait afficher une erreur quand les mots de passe ne correspondent pas', async () => {
    render(<MockedSignupForm />);
    
    const inputs = screen.getAllByRole('textbox');
    const selectElement = screen.getByRole('combobox');
    
    fireEvent.change(inputs[0], { target: { value: 'Bobby Chomedey' } });
    
    fireEvent.change(inputs[1], { target: { value: 'bobby45zone2@test.com' } });
    
    const passwordInputs = screen.getAllByDisplayValue('', { selector: "input[type='password']" });
    fireEvent.change(passwordInputs[0], { target: { value: 'motdepasse123' } });
    fireEvent.change(passwordInputs[1], { target: { value: 'motdepasse456' } });
    
    fireEvent.click(screen.getByText('S\'inscrire'));
    
    await waitFor(() => {
      expect(screen.getByText('Les mots de passe ne correspondent pas.')).toBeInTheDocument();
    });
  });

  it('devrait afficher le lien vers la connexion', () => {
    render(<MockedSignupForm />);
    
    const lien = screen.getByText('Se connecter');
    expect(lien).toBeInTheDocument();
  });

  it('devrait soumettre le formulaire avec succès quand les mots de passe correspondent', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Compte créé avec succès' })
    });

    render(<MockedSignupForm />);
    
    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[0], { target: { value: 'Bobby Chomedey' } });
    fireEvent.change(inputs[1], { target: { value: 'bobby45zone2@test.com' } });
    
    const passwordInputs = screen.getAllByDisplayValue('', { selector: "input[type='password']" });
    fireEvent.change(passwordInputs[0], { target: { value: 'motdepasse123' } });
    fireEvent.change(passwordInputs[1], { target: { value: 'motdepasse123' } });
    
    fireEvent.click(screen.getByText('S\'inscrire'));
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:5001/auth/signup',
        expect.any(Object)
      );
    });
  });
});