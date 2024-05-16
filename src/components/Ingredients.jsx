// src/components/Ingredients.jsx
import React, { useState } from 'react';
import { TextInput, Grid, Box, Title } from '@mantine/core';
import { createStyles } from '@mantine/styles';
import { percentageToGrams } from '../utils/calculate';

const useStyles = createStyles((theme) => ({
  ingredientRow: {
    marginBottom: theme.spacing.md,
  },
  ingredientName: {
    textTransform: 'capitalize',
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  input: {
    width: '100px',
  },
  centeredGrid: {
    display: 'flex',
    justifyContent: 'center',
  },
  inputWrapper: {
    display: 'flex',
    gap: theme.spacing.xs,
    justifyContent: 'center',
  },
}));

const ingredients = [
  { name: 'flour', label: 'Flour', unit: 'g', isBaseIngredient: true },
  { name: 'water', label: 'Water', unit: 'g', isBaseIngredient: false },
  { name: 'salt', label: 'Salt', unit: 'g', isBaseIngredient: false },
  { name: 'yeast', label: 'Yeast', unit: 'g', isBaseIngredient: false },
  { name: 'fat', label: 'Fat', unit: 'g', isBaseIngredient: false },
];

function Ingredients() {
  const { classes } = useStyles();
  const [baseIngredientWeight, setBaseIngredientWeight] = useState(0);
  const [ingredientPercentages, setIngredientPercentages] = useState(new Array(ingredients.length).fill(0));

  const handleInputFocus = (event) => {
    event.target.select();
  };

  return (
    <Box>
      {ingredients.map((ingredient, index) => (
        <Grid key={ingredient.name} className={classes.ingredientRow}>
          <Grid.Col span={12}>
            <Title order={5} className={classes.ingredientName}>{ingredient.label}</Title>
          </Grid.Col>
          <Grid.Col span={12} className={classes.centeredGrid}>
            <div className={classes.inputWrapper}>
              <TextInput
                classNames={{ input: classes.input }}
                placeholder={ingredient.isBaseIngredient ? 'Total baseIngredient weight' : 'Baker\'s percentage'}
                rightSection={<span>{ingredient.isBaseIngredient ? 'g' : '%'}</span>}
                value={ingredient.isBaseIngredient ? baseIngredientWeight : ingredientPercentages[index]}
                onFocus={handleInputFocus}
                onChange={(event) => {
                  if (ingredient.isBaseIngredient) {
                    setBaseIngredientWeight(parseFloat(event.target.value));
                  } else {
                    const updatedPercentages = [...ingredientPercentages];
                    updatedPercentages[index] = parseFloat(event.target.value);
                    setIngredientPercentages(updatedPercentages);
                  }
                }}
              />
              {!ingredient.isBaseIngredient ? (
                <TextInput
                classNames={{ input: classes.input }}
                readOnly
                value={
                  ingredient.isBaseIngredient
                    ? ''
                    : percentageToGrams(ingredientPercentages[index], baseIngredientWeight).toFixed(2)
                }
                rightSection={<span>g</span>}
              />
              ) : (<></>)}
            </div>
          </Grid.Col>
        </Grid>
      ))}
    </Box>
  );
}

export default Ingredients;
