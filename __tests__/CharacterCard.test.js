import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { api } from '../api/axios';
import CharacterCard from '../src/components/CharacterCard';

jest.mock('../api/axios');

const characterData = {
  name: 'Rick Sanchez',
  origin: {
    name: "Unity's Planet",
  },
  location: {
    name: 'Citadel of Ricks',
  },
};

const mockedOriginResponse = {
  id: 28,
  name: "Unity's Planet",
  type: "Planet",
  dimension: "Replacement Dimension",
  residents: [
    "https://rickandmortyapi.com/api/character/90",
    "https://rickandmortyapi.com/api/character/188"
  ],
};

const mockedResidentResponses = [
  { id: 90, name: 'Character 90' },
  { id: 188, name: 'Character 188' },
];

describe('Character Card Component', () => {
  it('renders location and origin details on click', async () => {
    render(<CharacterCard 
      characterName={characterData.name}
      characterOrigin={characterData.origin}
      characterLocation={characterData.location}
    />);

    api.get.mockResolvedValueOnce({ data: mockedOriginResponse });

    mockedResidentResponses.forEach((resident, index) => {
      api.get.mockResolvedValueOnce({ data: resident });
    });
    
    fireEvent.click(screen.getByText("Unity's Planet"));

    await waitFor(() => {
      expect(screen.getAllByText("Unity's Planet")).toHaveLength(2);
      expect(screen.getByText('Dimension')).toBeInTheDocument();
      expect(screen.getByText('Replacement Dimension')).toBeInTheDocument();
      expect(screen.getByText('Residents')).toBeInTheDocument();
      expect(screen.getByText('Character 90')).toBeInTheDocument();
      expect(screen.getByText('Character 188')).toBeInTheDocument();
    });
  })
})
