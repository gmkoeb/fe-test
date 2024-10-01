import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import App from '../src/App';
import { api } from '../api/axios'; 
import '@testing-library/jest-dom';

jest.mock('../api/axios');

const mockDataPage1 = {
  data: {
    results: [
      { id: 1, name: 'Rick Sanchez' },
      { id: 2, name: 'Morty Smith' },
    ],
    info: {
      next: '/character/?page=2',
      prev: null,
    },
  },
};

const mockDataPage2 = {
  data: {
    results: [
      { id: 3, name: 'Summer Smith' },
      { id: 4, name: 'Beth Smith' },
    ],
    info: {
      next: '/character/?page=3',
      prev: '/character/?page=1',
    },
  },
};

describe('App Component', () => {
  it('renders characters and pagination buttons', async () => {
    api.get.mockResolvedValueOnce(mockDataPage1);

    const prevButton = screen.queryByText('prev')

    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
      expect(screen.getByText('Morty Smith')).toBeInTheDocument();
      expect(screen.getByText('next')).toBeInTheDocument();
      expect(prevButton).toBeNull();
    });
    
  });

  it('handles pagination', async () => {
    api.get.mockResolvedValueOnce(mockDataPage1);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
      expect(screen.getByText('Morty Smith')).toBeInTheDocument();
    });

    api.get.mockResolvedValueOnce(mockDataPage2);

    fireEvent.click(screen.getByText('next'));

    await waitFor(() => {
      expect(screen.getByText('Summer Smith')).toBeInTheDocument();
      expect(screen.getByText('Beth Smith')).toBeInTheDocument();
    });

    api.get.mockResolvedValueOnce(mockDataPage1); 

    fireEvent.click(screen.getByText('prev'));

    await waitFor(() => {
      expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
      expect(screen.getByText('Morty Smith')).toBeInTheDocument();
    });
  });
});
