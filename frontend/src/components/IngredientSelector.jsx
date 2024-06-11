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
