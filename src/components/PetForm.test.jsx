import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PetForm from './PetForm';
import ApiService from '../services/ApiService';

vi.mock('../services/ApiService');

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

function renderPetForm() {
  return render(
    <MemoryRouter>
      <PetForm />
    </MemoryRouter>
  );
}

describe('PetForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all form fields with labels', () => {
    renderPetForm();
    expect(screen.getByLabelText(/Name/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Species/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Breed/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Age/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Price/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add Pet' })).toBeInTheDocument();
  });

  it('shows validation errors for empty required fields on submit', async () => {
    renderPetForm();
    fireEvent.click(screen.getByRole('button', { name: 'Add Pet' }));

    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument();
      expect(screen.getByText('Species is required')).toBeInTheDocument();
      expect(screen.getByText('Price is required')).toBeInTheDocument();
    });

    expect(ApiService.createPet).not.toHaveBeenCalled();
  });

  it('clears field error when user types in that field', async () => {
    renderPetForm();
    fireEvent.click(screen.getByRole('button', { name: 'Add Pet' }));

    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/Name/), { target: { value: 'Buddy' } });
    expect(screen.queryByText('Name is required')).not.toBeInTheDocument();
  });

  it('calls ApiService.createPet and navigates to / on valid submit', async () => {
    ApiService.createPet.mockResolvedValue({ petId: 'new-1', name: 'Buddy' });
    renderPetForm();

    fireEvent.change(screen.getByLabelText(/Name/), { target: { value: 'Buddy' } });
    fireEvent.change(screen.getByLabelText(/Species/), { target: { value: 'Dog' } });
    fireEvent.change(screen.getByLabelText(/Price/), { target: { value: '299.99' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add Pet' }));

    await waitFor(() => {
      expect(ApiService.createPet).toHaveBeenCalledWith({
        name: 'Buddy',
        species: 'Dog',
        price: 299.99,
      });
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('sends optional fields when provided', async () => {
    ApiService.createPet.mockResolvedValue({ petId: 'new-2' });
    renderPetForm();

    fireEvent.change(screen.getByLabelText(/Name/), { target: { value: 'Whiskers' } });
    fireEvent.change(screen.getByLabelText(/Species/), { target: { value: 'Cat' } });
    fireEvent.change(screen.getByLabelText(/Breed/), { target: { value: 'Siamese' } });
    fireEvent.change(screen.getByLabelText(/Age/), { target: { value: '2' } });
    fireEvent.change(screen.getByLabelText(/Price/), { target: { value: '149.99' } });
    fireEvent.change(screen.getByLabelText(/Description/), { target: { value: 'A cute cat' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add Pet' }));

    await waitFor(() => {
      expect(ApiService.createPet).toHaveBeenCalledWith({
        name: 'Whiskers',
        species: 'Cat',
        breed: 'Siamese',
        age: 2,
        price: 149.99,
        description: 'A cute cat',
      });
    });
  });

  it('displays API error message on submission failure', async () => {
    ApiService.createPet.mockRejectedValue({
      response: { data: { error: 'Missing required fields: name' } },
    });
    renderPetForm();

    fireEvent.change(screen.getByLabelText(/Name/), { target: { value: 'Buddy' } });
    fireEvent.change(screen.getByLabelText(/Species/), { target: { value: 'Dog' } });
    fireEvent.change(screen.getByLabelText(/Price/), { target: { value: '100' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add Pet' }));

    await waitFor(() => {
      expect(screen.getByText('Missing required fields: name')).toBeInTheDocument();
    });
  });

  it('displays generic error when API fails without response data', async () => {
    ApiService.createPet.mockRejectedValue(new Error('Network error'));
    renderPetForm();

    fireEvent.change(screen.getByLabelText(/Name/), { target: { value: 'Buddy' } });
    fireEvent.change(screen.getByLabelText(/Species/), { target: { value: 'Dog' } });
    fireEvent.change(screen.getByLabelText(/Price/), { target: { value: '100' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add Pet' }));

    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });
  });

  it('disables submit button while submitting', async () => {
    ApiService.createPet.mockReturnValue(new Promise(() => {}));
    renderPetForm();

    fireEvent.change(screen.getByLabelText(/Name/), { target: { value: 'Buddy' } });
    fireEvent.change(screen.getByLabelText(/Species/), { target: { value: 'Dog' } });
    fireEvent.change(screen.getByLabelText(/Price/), { target: { value: '100' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add Pet' }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Adding...' })).toBeDisabled();
    });
  });
});
