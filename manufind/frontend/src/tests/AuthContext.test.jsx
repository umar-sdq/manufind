import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../Components/AuthContext/AuthContext';

describe('ContexteAuthentification', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('devrait initialiser avec authData null', () => {
    const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    expect(result.current.authData).toBeNull();
  });

  it('devrait connecter l\'utilisateur et sauvegarder dans localStorage', () => {
    const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    const donnéesUtilisateur = { 
      id: 1, 
      nom: 'Bobby Chomedey', 
      email: 'bobby45zone2@test.com', 
      role: 'client' 
    };
    
    act(() => {
      result.current.login(donnéesUtilisateur);
    });
    
    expect(result.current.authData).toEqual(donnéesUtilisateur);
    expect(localStorage.setItem).toHaveBeenCalledWith('authData', JSON.stringify(donnéesUtilisateur));
  });

  it('devrait déconnecter l\'utilisateur et supprimer de localStorage', () => {
    const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    const donnéesUtilisateur = { id: 1, nom: 'Bobby Chomedey', email: 'bobby45zone2@test.com', role: 'client' };
    
    act(() => {
      result.current.login(donnéesUtilisateur);
    });
    
    act(() => {
      result.current.logout();
    });
    
    expect(result.current.authData).toBeNull();
    expect(localStorage.removeItem).toHaveBeenCalledWith('authData');
  });
});