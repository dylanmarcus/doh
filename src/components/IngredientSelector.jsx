import React from 'react';
import { Checkbox, Button, Box } from '@mantine/core';

const ingredientsList = [
  { name: 'flour', label: 'Flour' },
  { name: 'water', label: 'Water' },
  { name: 'salt', label: 'Salt' },
  { name: 'yeast', label: 'Yeast' },
  { name: 'fat', label: 'Fat' },
];

function IngredientSelector({ selectedIngredients, setSelectedIngredients, onClose }) {
  const handleCheckboxChange = (name) => {
    setSelectedIngredients((prev) =>
      prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]
    );
  };

  return (
    <Box>
      {ingredientsList.map((ingredient) => (
        <Checkbox
          key={ingredient.name}
          label={ingredient.label}
          checked={selectedIngredients.includes(ingredient.name)}
          onChange={() => handleCheckboxChange(ingredient.name)}
        />
      ))}
      <Button onClick={onClose}>Close</Button>
    </Box>
  );
}

export default IngredientSelector;
