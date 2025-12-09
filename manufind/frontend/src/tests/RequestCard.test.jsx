import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import RequestCard from '../Components/RequestCard/RequestCard';
import { AuthProvider } from '../Components/AuthContext/AuthContext';

vi.mock('../Components/AuthContext/AuthContext', () => {
  const React = require('react');
  return {
    AuthProvider: ({ children }) => React.createElement(React.Fragment, null, children),
    useAuth: () => ({
      authData: { id: 1, nom: 'Bobby Chomedey', email: 'bobby@test.com', role: 'client' },
      login: vi.fn(),
      logout: vi.fn(),
    }),
  };
});

vi.mock('../config/api.js', () => ({
  default: 'http://localhost:5001'
}));

const CarteRequêteSimulée = () => (
  <BrowserRouter>
    <AuthProvider>
      <RequestCard />
    </AuthProvider>
  </BrowserRouter>
);

describe('CarteRequête', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
    global.alert = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });


  it('devrait afficher le titre du formulaire de requête', () => {
    render(<CarteRequêteSimulée />);
    expect(screen.getByText('Créer une nouvelle demande')).toBeInTheDocument();
  });

  it('devrait avoir une liste déroulante de catégories', () => {
    render(<CarteRequêteSimulée />);
    const select = screen.getByDisplayValue('Choisir une catégorie');
    expect(select).toBeInTheDocument();
  });

  it('devrait avoir un champ de description', () => {
    render(<CarteRequêteSimulée />);
    expect(screen.getByPlaceholderText('Description')).toBeInTheDocument();
  });

  it('devrait avoir un champ d\'adresse', () => {
    render(<CarteRequêteSimulée />);
    expect(screen.getByPlaceholderText('Adresse')).toBeInTheDocument();
  });

  it('devrait avoir un champ de code postal', () => {
    render(<CarteRequêteSimulée />);
    expect(screen.getByPlaceholderText('Code postal')).toBeInTheDocument();
  });

  it('devrait avoir un bouton d\'envoi', () => {
    render(<CarteRequêteSimulée />);
    expect(screen.getByText('Soumettre')).toBeInTheDocument();
  });

  it('devrait afficher le sous-titre du formulaire', () => {
    render(<CarteRequêteSimulée />);
    expect(screen.getByText(/Remplissez les informations/i)).toBeInTheDocument();
  });

  it('devrait afficher le titre de section Détails', () => {
    render(<CarteRequêteSimulée />);
    expect(screen.getByText('Détails de la demande')).toBeInTheDocument();
  });


  it('devrait mettre à jour le champ de description', () => {
    render(<CarteRequêteSimulée />);
    const champDesc = screen.getByPlaceholderText('Description');
    fireEvent.change(champDesc, { target: { value: 'Fuite d\'eau urgente' } });
    expect(champDesc.value).toBe('Fuite d\'eau urgente');
  });

  it('devrait mettre à jour le champ d\'adresse', () => {
    render(<CarteRequêteSimulée />);
    const champAddr = screen.getByPlaceholderText('Adresse');
    fireEvent.change(champAddr, { target: { value: '123 rue Test' } });
    expect(champAddr.value).toBe('123 rue Test');
  });

  it('devrait sélectionner une catégorie', () => {
    render(<CarteRequêteSimulée />);
    const select = screen.getByDisplayValue('Choisir une catégorie');
    fireEvent.change(select, { target: { value: 'Plomberie' } });
    expect(select.value).toBe('Plomberie');
  });

  it('devrait mettre à jour le code postal', () => {
    render(<CarteRequêteSimulée />);
    const codePostalInput = screen.getByPlaceholderText('Code postal');
    fireEvent.change(codePostalInput, { target: { value: 'H3B 1A1' } });
    expect(codePostalInput.value).toBe('H3B 1A1');
  });

  it('devrait mettre à jour la durée estimée', () => {
    render(<CarteRequêteSimulée />);
    const dureeInput = screen.getByPlaceholderText('Durée estimée (minutes)');
    fireEvent.change(dureeInput, { target: { value: '120' } });
    expect(dureeInput.value).toBe('120');
  });

  it('devrait mettre à jour la date et heure', () => {
    const { container } = render(<CarteRequêteSimulée />);
    const dateInput = container.querySelector("input[type='datetime-local']");
    fireEvent.change(dateInput, { target: { value: '2024-12-15T10:30' } });
    expect(dateInput.value).toBe('2024-12-15T10:30');
  });


  it('devrait soumettre le formulaire avec succès et afficher le message', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true })
    });

    render(<CarteRequêteSimulée />);

    fireEvent.change(screen.getByDisplayValue('Choisir une catégorie'), { target: { value: 'Plomberie' } });
    fireEvent.change(screen.getByPlaceholderText('Description'), { target: { value: 'Réparation de fuite' } });
    fireEvent.change(screen.getByPlaceholderText('Adresse'), { target: { value: '123 rue Test' } });
    fireEvent.change(screen.getByPlaceholderText('Code postal'), { target: { value: 'H3B 1A1' } });

    const form = screen.getByPlaceholderText('Description').closest('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:5001/demandes/ajouter',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Demande soumise')).toBeInTheDocument();
    });
  });

  it('devrait envoyer les bonnes données dans le body', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true })
    });

    render(<CarteRequêteSimulée />);

    fireEvent.change(screen.getByDisplayValue('Choisir une catégorie'), { target: { value: 'Électricité' } });
    fireEvent.change(screen.getByPlaceholderText('Description'), { target: { value: 'Installation prise' } });
    fireEvent.change(screen.getByPlaceholderText('Adresse'), { target: { value: '456 avenue Test' } });
    fireEvent.change(screen.getByPlaceholderText('Code postal'), { target: { value: 'H2X 1Y2' } });
    fireEvent.change(screen.getByPlaceholderText('Durée estimée (minutes)'), { target: { value: '90' } });

    const form = screen.getByPlaceholderText('Description').closest('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
      const callArgs = global.fetch.mock.calls[0];
      const body = JSON.parse(callArgs[1].body);
      expect(body.client_id).toBe(1);
      expect(body.categorie).toBe('Électricité');
      expect(body.description).toBe('Installation prise');
      expect(body.adresse).toBe('456 avenue Test');
      expect(body.code_postal).toBe('H2X 1Y2');
      expect(body.duree_estimee).toBe('90');
    });
  });

  it('devrait gérer les erreurs de fetch', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    global.fetch.mockRejectedValueOnce(new Error('Erreur réseau'));

    render(<CarteRequêteSimulée />);

    fireEvent.change(screen.getByDisplayValue('Choisir une catégorie'), { target: { value: 'Peinture' } });
    fireEvent.change(screen.getByPlaceholderText('Description'), { target: { value: 'Peinture mur' } });
    fireEvent.change(screen.getByPlaceholderText('Adresse'), { target: { value: '789 rue Test' } });
    fireEvent.change(screen.getByPlaceholderText('Code postal'), { target: { value: 'H1A 1B1' } });

    const form = screen.getByPlaceholderText('Description').closest('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Erreur serveur:', expect.any(Error));
    });

    consoleSpy.mockRestore();
  });

  it('devrait réinitialiser les champs après soumission réussie', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true })
    });

    render(<CarteRequêteSimulée />);

    const descInput = screen.getByPlaceholderText('Description');
    const addrInput = screen.getByPlaceholderText('Adresse');

    fireEvent.change(screen.getByDisplayValue('Choisir une catégorie'), { target: { value: 'Toiture' } });
    fireEvent.change(descInput, { target: { value: 'Réparation toit' } });
    fireEvent.change(addrInput, { target: { value: '111 rue Test' } });
    fireEvent.change(screen.getByPlaceholderText('Code postal'), { target: { value: 'H3A 2B2' } });

    const form = descInput.closest('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(descInput.value).toBe('');
    }, { timeout: 4000 });

    expect(addrInput.value).toBe('');
  });


  it('devrait remplir tous les champs du formulaire', () => {
    render(<CarteRequêteSimulée />);

    const select = screen.getByDisplayValue('Choisir une catégorie');
    const descInput = screen.getByPlaceholderText('Description');
    const addrInput = screen.getByPlaceholderText('Adresse');
    const codePostalInput = screen.getByPlaceholderText('Code postal');
    const dureeInput = screen.getByPlaceholderText('Durée estimée (minutes)');

    fireEvent.change(select, { target: { value: 'Rénovation' } });
    fireEvent.change(descInput, { target: { value: 'Rénovation complète' } });
    fireEvent.change(addrInput, { target: { value: '456 avenue du Parc' } });
    fireEvent.change(codePostalInput, { target: { value: 'H2V 4J3' } });
    fireEvent.change(dureeInput, { target: { value: '240' } });

    expect(select.value).toBe('Rénovation');
    expect(descInput.value).toBe('Rénovation complète');
    expect(addrInput.value).toBe('456 avenue du Parc');
    expect(codePostalInput.value).toBe('H2V 4J3');
    expect(dureeInput.value).toBe('240');
  });

  it('devrait afficher toutes les catégories disponibles', () => {
    render(<CarteRequêteSimulée />);
    const select = screen.getByDisplayValue('Choisir une catégorie');

    const categories = [
      'Plomberie', 'Électricité', 'Peinture', 'Rénovation', 'Toiture',
      'Charpenterie', 'Nettoyage', 'Paysagement', 'Déménagement',
      'Réparation automobile', 'Climatisation et chauffage',
      'Informatique', 'Serrurerie', 'Maçonnerie', 'Petits travaux'
    ];

    categories.forEach(cat => {
      expect(select).toContainHTML(`<option value="${cat}">${cat}</option>`);
    });
  });

  it('devrait avoir des champs requis', () => {
    render(<CarteRequêteSimulée />);
    expect(screen.getByPlaceholderText('Description')).toHaveAttribute('required');
    expect(screen.getByPlaceholderText('Adresse')).toHaveAttribute('required');
    expect(screen.getByPlaceholderText('Code postal')).toHaveAttribute('required');
  });

  it('devrait avoir le bouton avec la bonne classe CSS', () => {
    render(<CarteRequêteSimulée />);
    const button = screen.getByText('Soumettre').closest('button');
    expect(button).toHaveClass('submit-btn');
  });

  it('devrait changer plusieurs fois la catégorie', () => {
    render(<CarteRequêteSimulée />);
    const select = screen.getByDisplayValue('Choisir une catégorie');

    fireEvent.change(select, { target: { value: 'Plomberie' } });
    expect(select.value).toBe('Plomberie');

    fireEvent.change(select, { target: { value: 'Électricité' } });
    expect(select.value).toBe('Électricité');

    fireEvent.change(select, { target: { value: 'Toiture' } });
    expect(select.value).toBe('Toiture');
  });

  it('devrait avoir 15 catégories dans la liste', () => {
    render(<CarteRequêteSimulée />);
    const options = screen.getAllByRole('option');
    expect(options.length).toBeGreaterThanOrEqual(15);
  });

  it('devrait envoyer date_heure null si non rempli', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true })
    });

    render(<CarteRequêteSimulée />);

    fireEvent.change(screen.getByDisplayValue('Choisir une catégorie'), { target: { value: 'Nettoyage' } });
    fireEvent.change(screen.getByPlaceholderText('Description'), { target: { value: 'Nettoyage complet' } });
    fireEvent.change(screen.getByPlaceholderText('Adresse'), { target: { value: '222 rue Test' } });
    fireEvent.change(screen.getByPlaceholderText('Code postal'), { target: { value: 'H4B 3C3' } });

    const form = screen.getByPlaceholderText('Description').closest('form');
    fireEvent.submit(form);

    await waitFor(() => {
      const callArgs = global.fetch.mock.calls[0];
      const body = JSON.parse(callArgs[1].body);
      expect(body.date_heure).toBeNull();
      expect(body.duree_estimee).toBe(60);
    });
  });

  it('devrait envoyer la date_heure si remplie', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true })
    });

    const { container } = render(<CarteRequêteSimulée />);

    fireEvent.change(screen.getByDisplayValue('Choisir une catégorie'), { target: { value: 'Déménagement' } });
    fireEvent.change(screen.getByPlaceholderText('Description'), { target: { value: 'Déménagement complet' } });
    fireEvent.change(screen.getByPlaceholderText('Adresse'), { target: { value: '333 rue Test' } });
    fireEvent.change(screen.getByPlaceholderText('Code postal'), { target: { value: 'H5C 4D4' } });

    const dateInput = container.querySelector("input[type='datetime-local']");
    fireEvent.change(dateInput, { target: { value: '2025-12-20T14:00' } });

    const form = screen.getByPlaceholderText('Description').closest('form');
    fireEvent.submit(form);

    await waitFor(() => {
      const callArgs = global.fetch.mock.calls[0];
      const body = JSON.parse(callArgs[1].body);
      expect(body.date_heure).toBe('2025-12-20T14:00');
    });
  });
});