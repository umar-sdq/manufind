import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import RequestCard from '../Components/RequestCard/RequestCard';
import { AuthProvider } from '../Components/AuthContext/AuthContext';

const CarteRequêteSimulée = ({ donnéesAuth } = { donnéesAuth: { id: 1, nom: 'Bobby Chomedey', role: 'client' } }) => (
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
});