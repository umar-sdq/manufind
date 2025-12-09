import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProfileClient from '../Components/ProfileClient/ProfileClient';

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

  it('devrait afficher le nom du client dans la bannière', () => {
    render(<Wrapper><ProfileClient /></Wrapper>);
    expect(screen.getByText(/Bienvenue, Test Client/i)).toBeInTheDocument();
  });

  it('devrait afficher le rôle Client', () => {
    render(<Wrapper><ProfileClient /></Wrapper>);
    expect(screen.getByText(/Rôle : Client/i)).toBeInTheDocument();
  });

  it('devrait afficher le champ Nom dans le formulaire', () => {
    render(<Wrapper><ProfileClient /></Wrapper>);
    expect(screen.getByText('Nom')).toBeInTheDocument();
  });

  it('devrait afficher le champ Email dans le formulaire', () => {
    render(<Wrapper><ProfileClient /></Wrapper>);
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('devrait afficher le bouton Mettre à jour', () => {
    render(<Wrapper><ProfileClient /></Wrapper>);
    expect(screen.getByText('Mettre à jour')).toBeInTheDocument();
  });

  it('devrait afficher le bouton Voir mes requêtes', () => {
    render(<Wrapper><ProfileClient /></Wrapper>);
    expect(screen.getByText('Voir mes requêtes')).toBeInTheDocument();
  });

  it('devrait afficher le bouton Déconnexion', () => {
    render(<Wrapper><ProfileClient /></Wrapper>);
    expect(screen.getByText('Déconnexion')).toBeInTheDocument();
  });


  it('devrait afficher les cartes de statistiques', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        demandes: [
          { id: 1, statut: 'en_attente' },
          { id: 2, statut: 'complétée' },
          { id: 3, statut: 'en_attente' }
        ]
      })
    });

    render(<Wrapper><ProfileClient /></Wrapper>);

    await waitFor(() => {
      expect(screen.getByText('Requêtes totales')).toBeInTheDocument();
    });

    expect(screen.getByText('Complétées')).toBeInTheDocument();
    expect(screen.getByText('En attente')).toBeInTheDocument();
  });

  it('devrait afficher le résumé des statistiques', async () => {
    render(<Wrapper><ProfileClient /></Wrapper>);

    await waitFor(() => {
      expect(screen.getByText(/Vous avez un total de/i)).toBeInTheDocument();
    });
  });


  it('devrait mettre à jour le champ nom', () => {
    render(<Wrapper><ProfileClient /></Wrapper>);
    const nomInput = screen.getByDisplayValue('Test Client');
    
    fireEvent.change(nomInput, { target: { value: 'Nouveau Nom' } });
    
    expect(nomInput.value).toBe('Nouveau Nom');
  });

  it('devrait mettre à jour le champ email', () => {
    render(<Wrapper><ProfileClient /></Wrapper>);
    const emailInput = screen.getByDisplayValue('test@example.com');
    
    fireEvent.change(emailInput, { target: { value: 'nouveau@email.com' } });
    
    expect(emailInput.value).toBe('nouveau@email.com');
  });

  it('devrait appeler fetch lors de la soumission du formulaire', async () => {
    render(<Wrapper><ProfileClient /></Wrapper>);

    const form = screen.getByText('Mettre à jour').closest('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  it('devrait gérer les erreurs de mise à jour', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, demandes: [] })
    }).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Erreur serveur' })
    });

    render(<Wrapper><ProfileClient /></Wrapper>);

    const form = screen.getByText('Mettre à jour').closest('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });


  it('devrait avoir la classe profile-page', () => {
    const { container } = render(<Wrapper><ProfileClient /></Wrapper>);
    expect(container.querySelector('.profile-page')).toBeInTheDocument();
  });

  it('devrait avoir la bannière de profil', () => {
    const { container } = render(<Wrapper><ProfileClient /></Wrapper>);
    expect(container.querySelector('.profile-banner')).toBeInTheDocument();
  });

  it('devrait avoir la section info', () => {
    const { container } = render(<Wrapper><ProfileClient /></Wrapper>);
    expect(container.querySelector('.profile-info-section')).toBeInTheDocument();
  });

  it('devrait avoir la section stats', () => {
    const { container } = render(<Wrapper><ProfileClient /></Wrapper>);
    expect(container.querySelector('.profile-stats-section')).toBeInTheDocument();
  });

  it('devrait avoir les actions de profil', () => {
    const { container } = render(<Wrapper><ProfileClient /></Wrapper>);
    expect(container.querySelector('.profile-actions')).toBeInTheDocument();
  });

  it('devrait avoir le formulaire de profil', () => {
    const { container } = render(<Wrapper><ProfileClient /></Wrapper>);
    expect(container.querySelector('.profile-form')).toBeInTheDocument();
  });

  it('devrait avoir les cartes de stats', async () => {
    const { container } = render(<Wrapper><ProfileClient /></Wrapper>);
    
    await waitFor(() => {
      expect(container.querySelectorAll('.stat-card').length).toBeGreaterThanOrEqual(1);
    });
  });

  it('devrait avoir le bouton principal avec classe btn-main', () => {
    const { container } = render(<Wrapper><ProfileClient /></Wrapper>);
    expect(container.querySelector('.btn-main')).toBeInTheDocument();
  });

  it('devrait avoir le bouton alternatif avec classe btn-alt', () => {
    const { container } = render(<Wrapper><ProfileClient /></Wrapper>);
    expect(container.querySelector('.btn-alt')).toBeInTheDocument();
  });


  it('devrait initialiser le nom avec authData.nom', () => {
    render(<Wrapper><ProfileClient /></Wrapper>);
    expect(screen.getByDisplayValue('Test Client')).toBeInTheDocument();
  });

  it('devrait initialiser l\'email avec authData.email', () => {
    render(<Wrapper><ProfileClient /></Wrapper>);
    expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
  });

  it('devrait afficher 0 requêtes par défaut', async () => {
    render(<Wrapper><ProfileClient /></Wrapper>);
    
    await waitFor(() => {
      const zeroElements = screen.getAllByText('0');
      expect(zeroElements.length).toBeGreaterThanOrEqual(1);
    });
  });
});