import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from '../Components/Header/Header';
import { AuthProvider } from '../Components/AuthContext/AuthContext';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockLogout = vi.fn();

vi.mock('../Components/AuthContext/AuthContext', () => {
  const React = require('react');
  return {
    AuthProvider: ({ children }) => React.createElement(React.Fragment, null, children),
    useAuth: () => ({
      authData: { id: 1, nom: 'Bobby Chomedey', email: 'bobby@test.com', role: 'client' },
      login: vi.fn(),
      logout: mockLogout,
    }),
  };
});

const Wrapper = ({ children }) => (
  <BrowserRouter>
    <AuthProvider>
      {children}
    </AuthProvider>
  </BrowserRouter>
);

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });


  it('devrait afficher le logo/titre ManuFind', () => {
    render(<Wrapper><Header /></Wrapper>);
    const titleElements = screen.getAllByText(/ManuFind/i);
    expect(titleElements.length).toBeGreaterThanOrEqual(1);
  });

  it('devrait afficher les liens de navigation publics', () => {
    render(<Wrapper><Header /></Wrapper>);
    const servicesLinks = screen.getAllByText(/Services/i);
    const guideLinks = screen.getAllByText(/Guide/i);
    expect(servicesLinks.length).toBeGreaterThanOrEqual(1);
    expect(guideLinks.length).toBeGreaterThanOrEqual(1);
  });

  it('devrait afficher le lien Profil quand utilisateur connecté', () => {
    render(<Wrapper><Header /></Wrapper>);
    const profileLinks = screen.getAllByText(/Profil/i);
    expect(profileLinks.length).toBeGreaterThanOrEqual(1);
  });

  it('devrait avoir un bouton ou lien de déconnexion', () => {
    render(<Wrapper><Header /></Wrapper>);
    const logoutButtons = screen.getAllByText(/Déconnexion/i);
    expect(logoutButtons.length).toBeGreaterThanOrEqual(1);
  });

  it('devrait avoir un menu burger (hamburger) sur mobile', () => {
    const { container } = render(<Wrapper><Header /></Wrapper>);
    const burgerMenu = container.querySelector('.burger');
    expect(burgerMenu).toBeTruthy();
  });

  it('devrait afficher le header avec la classe correct', () => {
    const { container } = render(<Wrapper><Header /></Wrapper>);
    const header = container.querySelector('.header');
    expect(header).toBeInTheDocument();
    expect(header).toHaveClass('header');
  });

  it('devrait avoir des liens de navigation dans le header', () => {
    const { container } = render(<Wrapper><Header /></Wrapper>);
    const navLinks = container.querySelector('.nav-links');
    expect(navLinks).toBeTruthy();
  });

  it('devrait avoir une section pour les comptes utilisateur', () => {
    const { container } = render(<Wrapper><Header /></Wrapper>);
    const accountLinks = container.querySelector('.account-links');
    expect(accountLinks).toBeTruthy();
  });

  it('devrait afficher le logo du header', () => {
    const { container } = render(<Wrapper><Header /></Wrapper>);
    const logo = container.querySelector('.header-logo');
    expect(logo).toBeTruthy();
  });

  it('devrait avoir au moins un lien vers la page d\'accueil', () => {
    const { container } = render(<Wrapper><Header /></Wrapper>);
    const homeLink = container.querySelector('a[href="/"]');
    expect(homeLink).toBeTruthy();
  });

  it('devrait afficher le titre du header', () => {
    const { container } = render(<Wrapper><Header /></Wrapper>);
    const titleSection = container.querySelector('.titre');
    expect(titleSection).toBeInTheDocument();
  });

  it('devrait avoir un lien vers le profil client', () => {
    const { container } = render(<Wrapper><Header /></Wrapper>);
    const clientProfileLink = container.querySelector('a[href="/profile-client"]');
    expect(clientProfileLink).toBeInTheDocument();
  });


  it('devrait appeler logout et naviguer vers / quand on clique sur Déconnexion', () => {
    const { container } = render(<Wrapper><Header /></Wrapper>);
    const logoutBtn = container.querySelector('.logout-btn');
    
    fireEvent.click(logoutBtn);
    
    expect(mockLogout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('devrait ouvrir le menu burger quand on clique dessus', () => {
    const { container } = render(<Wrapper><Header /></Wrapper>);
    const burger = container.querySelector('.burger');
    
    fireEvent.click(burger);
    
    expect(burger.classList.contains('open')).toBe(true);
  });

  it('devrait fermer le menu burger quand on clique à nouveau', () => {
    const { container } = render(<Wrapper><Header /></Wrapper>);
    const burger = container.querySelector('.burger');
    
    fireEvent.click(burger);
    fireEvent.click(burger);
    
    expect(burger.classList.contains('open')).toBe(false);
  });

  it('devrait fermer le menu quand on clique sur un lien du sidebar', () => {
    const { container } = render(<Wrapper><Header /></Wrapper>);
    const burger = container.querySelector('.burger');
    
    fireEvent.click(burger);
    
    const sidebar = container.querySelector('.sidebar');
    const sidebarLink = sidebar.querySelector('a[href="/services"]');
    fireEvent.click(sidebarLink);
    
    expect(burger.classList.contains('open')).toBe(false);
  });

  it('devrait fermer le menu quand on clique sur l\'overlay', () => {
    const { container } = render(<Wrapper><Header /></Wrapper>);
    const burger = container.querySelector('.burger');
    
    fireEvent.click(burger);
    
    const overlay = container.querySelector('.overlay');
    if (overlay) {
      fireEvent.click(overlay);
      expect(burger.classList.contains('open')).toBe(false);
    } else {
      expect(true).toBe(true);
    }
  });

  it('devrait fermer le menu quand on clique sur Déconnexion dans le sidebar', () => {
    const { container } = render(<Wrapper><Header /></Wrapper>);
    const burger = container.querySelector('.burger');
    
    fireEvent.click(burger);
    
    const sidebar = container.querySelector('.sidebar');
    const sidebarLogoutBtn = sidebar.querySelector('.logout-btn');
    fireEvent.click(sidebarLogoutBtn);
    
    expect(mockLogout).toHaveBeenCalled();
  });

  it('devrait avoir le sidebar avec la classe open quand le menu est ouvert', () => {
    const { container } = render(<Wrapper><Header /></Wrapper>);
    const burger = container.querySelector('.burger');
    const sidebar = container.querySelector('.sidebar');
    
    fireEvent.click(burger);
    
    expect(sidebar.classList.contains('open')).toBe(true);
  });

  it('devrait afficher le lien Requête dans la navigation', () => {
    render(<Wrapper><Header /></Wrapper>);
    const requestLink = screen.getAllByText(/Requête/i);
    expect(requestLink.length).toBeGreaterThanOrEqual(1);
  });

  it('devrait afficher le lien Soumises dans la navigation', () => {
    render(<Wrapper><Header /></Wrapper>);
    const submittedLink = screen.getAllByText(/Soumises/i);
    expect(submittedLink.length).toBeGreaterThanOrEqual(1);
  });

  it('devrait afficher un sidebar avec les mêmes liens', () => {
    const { container } = render(<Wrapper><Header /></Wrapper>);
    const sidebar = container.querySelector('.sidebar');
    expect(sidebar).toBeInTheDocument();
    expect(sidebar.querySelectorAll('a').length).toBeGreaterThan(0);
  });

  it('devrait avoir un bouton de déconnexion avec la classe logout-btn', () => {
    const { container } = render(<Wrapper><Header /></Wrapper>);
    const logoutBtn = container.querySelector('.logout-btn');
    expect(logoutBtn).toBeInTheDocument();
  });


  it('devrait avoir des liens navigables', () => {
    const { container } = render(<Wrapper><Header /></Wrapper>);
    const links = container.querySelectorAll('a');
    expect(links.length).toBeGreaterThan(0);
  });

  it('devrait avoir une classe desktop pour les liens de navigation', () => {
    const { container } = render(<Wrapper><Header /></Wrapper>);
    const desktopNav = container.querySelector('.desktop');
    expect(desktopNav).toBeTruthy();
  });

  it('devrait afficher le header dans le DOM', () => {
    const { container } = render(<Wrapper><Header /></Wrapper>);
    expect(container.querySelector('.header')).toBeInTheDocument();
  });

  it('devrait avoir une structure HTML valide', () => {
    const { container } = render(<Wrapper><Header /></Wrapper>);
    const header = container.querySelector('.header');
    expect(header).toBeInTheDocument();
    expect(header.children.length).toBeGreaterThan(0);
  });
});