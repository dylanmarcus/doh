import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Box, Title } from '@mantine/core';
import { createStyles } from '@mantine/styles';

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

const defaultIngredients = [
  {
    name: "flour",
    label: "Flour",
    unit: "g",
    isBaseIngredient: true,
    defaultPercentage: 0,
    defaultSelected: true
  },
  {
    name: "water",
    label: "Water",
    unit: "g",
    isBaseIngredient: false,
    defaultPercentage: 60,
    defaultSelected: true
  },
  {
    name: "salt",
    label: "Salt",
    unit: "g",
    isBaseIngredient: false,
    defaultPercentage: 2,
    defaultSelected: true
  },
  {
    name: "yeast",
    label: "Yeast",
    unit: "g",
    isBaseIngredient: false,
    defaultPercentage: 1,
    defaultSelected: true
  },
  {
    name: "fat",
    label: "Fat",
    unit: "g",
    isBaseIngredient: false,
    defaultPercentage: 10,
    defaultSelected: true
  },
  {
    name: "sugar",
    label: "Sugar",
    unit: "g",
    isBaseIngredient: false,
    defaultPercentage: 5,
    defaultSelected: false
  },
  {
    name: "bakingSoda",
    label: "Baking Soda",
    unit: "g",
    isBaseIngredient: false,
    defaultPercentage: 1,
    defaultSelected: false
  },
  {
    name: "bakingPowder",
    label: "Baking Powder",
    unit: "g",
    isBaseIngredient: false,
    defaultPercentage: 2,
    defaultSelected: false
  }
];

function IngredientSelector({ selectedIngredients, setSelectedIngredients, onClose }) {
  const { classes } = useStyles();
  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    setIngredients(defaultIngredients);
  }, []);

  const handleCheckboxChange = (index) => {
    const newSelectedIngredients = [...selectedIngredients];
    newSelectedIngredients[index] = !newSelectedIngredients[index];
    setSelectedIngredients(newSelectedIngredients);
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
