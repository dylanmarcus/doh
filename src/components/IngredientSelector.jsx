// src/components/IngredientSelector.jsx
import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Grid, Box, Title } from '@mantine/core';
import { createStyles } from '@mantine/styles';

const useStyles = createStyles((theme) => ({
  ingredientRow: {
    marginBottom: theme.spacing.md,
  },
  ingredientName: {
    textTransform: 'capitalize',
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  centeredGrid: {
    display: 'flex',
    justifyContent: 'center',
  },
}));

function IngredientSelector({ selectedIngredients, setSelectedIngredients, onClose }) {
  const { classes } = useStyles();
  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    fetch('src/utils/ingredients.json')
      .then(response => response.json())
      .then(data => setIngredients(data));
  }, []);

  const handleCheckboxChange = (index) => {
    const newSelectedIngredients = [...selectedIngredients];
    newSelectedIngredients[index] = !newSelectedIngredients[index];
    setSelectedIngredients(newSelectedIngredients);
  };

  return (
    <Box>
      {ingredients.map((ingredient, index) => (
        <Grid key={ingredient.name} className={classes.ingredientRow}>
          <Grid.Col span={12} className={classes.centeredGrid}>
            <Checkbox
              checked={selectedIngredients[index]}
              onChange={() => handleCheckboxChange(index)}
              label={ingredient.label}
            />
          </Grid.Col>
        </Grid>
      ))}
      <Grid className={classes.ingredientRow}>
        <Grid.Col span={12} className={classes.centeredGrid}>
          <Button onClick={onClose}>Done</Button>
        </Grid.Col>
      </Grid>
    </Box>
  );
}

export default IngredientSelector;
