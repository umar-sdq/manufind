// ...existing code...
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import RequestClientTab from '../Components/RequestClientTab/RequestClientTab';
import { AuthProvider } from '../Components/AuthContext/AuthContext';

const MockAuthWrapper = ({ children }) => (
  <BrowserRouter>
    <AuthProvider>
      {children}
    </AuthProvider>
  </BrowserRouter>
);

describe("RequestClientTab", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, demandes: [] })
    });

    if (typeof global.localStorage === 'undefined') {
      global.localStorage = {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
      };
    }
    global.localStorage.getItem = vi.fn().mockImplementation((key) => {
      if (key === 'authData') {
        return JSON.stringify({ id: 1, nom: 'Test User', email: 'test@example.com', role: 'client' });
      }
      return null;
    });
  });

  it("devrait afficher le titre", async () => {
    render(<MockAuthWrapper><RequestClientTab /></MockAuthWrapper>);
    expect(screen.getByText("Mes requêtes soumises")).toBeInTheDocument();
  });

    it("devrait afficher l'état vide après chargement", async () => {
    render(<MockAuthWrapper><RequestClientTab /></MockAuthWrapper>);

    expect(screen.getByText("Chargement...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Aucune requête pour l(?:’|')?instant\./i)).toBeInTheDocument();
    });
  });
});
