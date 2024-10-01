import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import App from '../src/App';
import { api } from '../api/axios'; 
import '@testing-library/jest-dom';

jest.mock('../api/axios');

const mockDataPage1 = {
  data: {
    results: [
      { 
        id: 1, 
        name: 'Rick Sanchez', 
        status: 'Alive',
        species: 'Human',
        origin: {
          name: 'Earth (C-137)'
        },
        location: {
          name: 'Citadel of Ricks',
        }
      },
      { 
        id: 2, 
        name: 'Morty Smith', 
        status: 'Alive',
        species: 'Human',
        origin: {
          name: 'unknown'
        },
        location: {
          name: 'Citadel of Ricks',
        }
      },
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
      { 
        id: 3, 
        name: 'Summer Smith', 
        status: 'Alive',
        species: 'Human',
        origin: {
          name: 'Earth (Replacement Dimension)'
        },
        location: {
          name: 'Earth (Replacement Dimension)',
        }
      },
      { 
        id: 4, 
        name: 'Beth Smith', 
        status: 'Alive',
        species: 'Human',
        origin: {
          name: 'Earth (Replacement Dimension)'
        },
        location: {
          name: 'Earth (Replacement Dimension)',
        }
      },
    ],
    info: {
      next: '/character/?page=3',
      prev: '/character/?page=1',
    },
  },
};

const mockDataRick = {
  data: {
    results: [
      { id: 1, name: 'Rick Sanchez', image: '', status: 'Alive', species: 'Human', origin: {}, location: {} }
    ],
    info: {
      next: null,
      prev: null,
      count: 1
    }
  }
}

const mockDataEmpty = {
  data: {
    results: [],
    info: {
      count: 0,
      pages: 0,
      next: null,
      prev: null,
    },
  },
};

describe('App Component', () => {
  it('renders characters and pagination buttons', async () => {
    api.get.mockResolvedValueOnce(mockDataPage1);

    const prevButton = screen.queryByText('Previous Page')

    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
      expect(screen.getAllByText('Origin:')).toHaveLength(2);
      expect(screen.getByText('Earth (C-137)')).toBeInTheDocument();
      expect(screen.getAllByText('Last known location:')).toHaveLength(2);
      expect(screen.getAllByText('Citadel of Ricks')).toHaveLength(2);
      expect(screen.getByText('Morty Smith')).toBeInTheDocument();
      expect(screen.getByText('unknown')).toBeInTheDocument();
      expect(screen.getByText('Next Page')).toBeInTheDocument();
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

    fireEvent.click(screen.getByText('Next Page'));

    await waitFor(() => {
      expect(screen.getByText('Summer Smith')).toBeInTheDocument();
      expect(screen.getByText('Beth Smith')).toBeInTheDocument();
    });

    api.get.mockResolvedValueOnce(mockDataPage1); 

    fireEvent.click(screen.getByText('Previous Page'));

    await waitFor(() => {
      expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
      expect(screen.getByText('Morty Smith')).toBeInTheDocument();
    });
  });

  it('should filter characters based on the search input', async () => {
    api.get.mockResolvedValueOnce(mockDataPage1);

    render(<App />);

    await waitFor(() => expect(screen.getByText('Rick Sanchez')).toBeInTheDocument());
    expect(screen.getByText('Morty Smith')).toBeInTheDocument();

    api.get.mockResolvedValueOnce(mockDataRick);

    const searchInput = screen.getByPlaceholderText('Search by name...');
    fireEvent.change(searchInput, { target: { value: 'Rick' } });

    await waitFor(() => expect(screen.getByText('Rick Sanchez')).toBeInTheDocument());

    expect(screen.queryByText('Morty Smith')).not.toBeInTheDocument();
    expect(screen.getByText('1 result for: Rick')).toBeInTheDocument();
  });

  it('should display no results message when no characters match the search query', async () => {
    api.get.mockResolvedValueOnce(mockDataEmpty);

    render(<App />);

    const searchInput = screen.getByPlaceholderText('Search by name...');
    fireEvent.change(searchInput, { target: { value: 'Unknown Character' } });

    await waitFor(() =>
      expect(screen.getByText(/No characters matching/i)).toBeInTheDocument()
    );
    expect(screen.getByText(/Unknown Character/i)).toBeInTheDocument()
    expect(screen.getByText(/were found on this page/i)).toBeInTheDocument()
  });
});
