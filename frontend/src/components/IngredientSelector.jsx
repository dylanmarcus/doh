import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Box, TextInput } from '@mantine/core';
import { createStyles } from '@mantine/styles';
import defaultIngredients from '../utils/defaultIngredients';

const useStyles = createStyles((theme) => ({
  centeredContent: {
    display: 'flex',
    justifyContent: 'center',
  },
  ingredientList: {
    maxWidth: '300px',
  },
  buttonWrapper: {
    marginTop: theme.spacing.md,
  },
}));

const IngredientSelector = ({ selectedIngredients, setSelectedIngredients, onClose, customIngredients = [], setCustomIngredients }) => {
  const { classes } = useStyles();
  const [ingredients, setIngredients] = useState([]);
  const [newIngredient, setNewIngredient] = useState('');

  useEffect(() => {
    setIngredients(defaultIngredients);
  }, []);

  const handleCheckboxChange = (index, isCustom = false) => {
    const newSelectedIngredients = [...selectedIngredients];
    newSelectedIngredients[index] = !newSelectedIngredients[index];
    setSelectedIngredients(newSelectedIngredients);
  };

  const handleAddCustomIngredient = () => {
    if (newIngredient.trim() === '') return;
    if (customIngredients.some(ingredient => ingredient.name === newIngredient)) return; // Prevent duplicates
    const newCustomIngredients = [...customIngredients, { name: newIngredient, label: newIngredient, isBaseIngredient: false }];
    setCustomIngredients(newCustomIngredients);
    setSelectedIngredients([...selectedIngredients, true]); // Add the new custom ingredient as selected
    setNewIngredient('');
  };

  return (
    <Box>
      <div className={classes.centeredContent}>
        <div className={classes.ingredientList}>
          {ingredients.map((ingredient, index) => (
            <Checkbox
              key={ingredient.name}
              checked={selectedIngredients[index]}
              onChange={() => handleCheckboxChange(index)}
              label={ingredient.label}
              style={{ marginBottom: '8px' }}
            />
          ))}
          {Array.isArray(customIngredients) && customIngredients.map((ingredient, index) => (
            <Checkbox
              key={ingredient.name}
              checked={selectedIngredients[ingredients.length + index]}
              onChange={() => handleCheckboxChange(ingredients.length + index, true)}
              label={ingredient.label}
              style={{ marginBottom: '8px' }}
            />
          ))}
        </div>
      </div>
      <div className={classes.centeredContent}>
        <div className={classes.buttonWrapper}>
          <TextInput
            placeholder="New ingredient"
            value={newIngredient}
            onChange={(event) => setNewIngredient(event.target.value)}
            style={{ marginBottom: '8px' }}
          />
          <Button onClick={handleAddCustomIngredient}>Add Ingredient</Button>
        </div>
      </div>
      <div className={classes.centeredContent}>
        <div className={classes.buttonWrapper}>
          <Button onClick={onClose}>Done</Button>
        </div>
      </div>
    </Box>
  );
}

export default IngredientSelector;