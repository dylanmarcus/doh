// src/components/Ingredients.jsx
import React, { useState, useEffect } from 'react';
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
  const [numberOfBalls, setNumberOfBalls] = useState(1);
  const [ballWeight, setBallWeight] = useState(500);
  const [baseIngredientWeight, setBaseIngredientWeight] = useState(numberOfBalls * ballWeight);
  const [ingredientPercentages, setIngredientPercentages] = useState([
    numberOfBalls * ballWeight, // Default value for flour
    60,                         // Default value for water
    2,                          // Default value for salt
    1,                          // Default value for yeast
    10,                         // Default value for fat
  ]);

  useEffect(() => {
    setBaseIngredientWeight(numberOfBalls * ballWeight);
  }, [numberOfBalls, ballWeight]);

  const handleInputFocus = (event) => {
    event.target.select();
  };

  const handleNumberOfBallsChange = (event) => {
    const value = parseInt(event.target.value);
    setNumberOfBalls(value || 0); // Ensure value is a valid number
  };

  const handleBallWeightChange = (event) => {
    const value = parseInt(event.target.value);
    setBallWeight(value || 0); // Ensure value is a valid number
  };

  const handlePercentageChange = (event, index) => {
    const value = parseFloat(event.target.value);
    const updatedPercentages = [...ingredientPercentages];
    updatedPercentages[index] = isNaN(value) ? 0 : value; // Ensure value is a valid number
    setIngredientPercentages(updatedPercentages);
  };

  return (
    <Box>
      <Grid className={classes.ingredientRow}>
        <Grid.Col span={12}>
          <Title order={5} className={classes.ingredientName}>Number of Balls</Title>
        </Grid.Col>
        <Grid.Col span={12} className={classes.centeredGrid}>
          <div className={classes.inputWrapper}>
            <TextInput
              classNames={{ input: classes.input }}
              styles={{ input: { textAlign: 'center' } }}
              placeholder="Number of balls"
              value={numberOfBalls}
              onChange={handleNumberOfBallsChange}
              onFocus={handleInputFocus}
            />
          </div>
        </Grid.Col>
      </Grid>
      <Grid className={classes.ingredientRow}>
        <Grid.Col span={12}>
          <Title order={5} className={classes.ingredientName}>Ball Weight</Title>
        </Grid.Col>
        <Grid.Col span={12} className={classes.centeredGrid}>
          <div className={classes.inputWrapper}>
            <TextInput
              classNames={{ input: classes.input }}
              styles={{ input: { textAlign: 'center' } }}
              placeholder="Ball weight"
              value={ballWeight}
              onChange={handleBallWeightChange}
              onFocus={handleInputFocus}
            />
          </div>
        </Grid.Col>
      </Grid>
      {ingredients.map((ingredient, index) => (
        <Grid key={ingredient.name} className={classes.ingredientRow}>
          <Grid.Col span={12}>
            <Title order={5} className={classes.ingredientName}>{ingredient.label}</Title>
          </Grid.Col>
          <Grid.Col span={12} className={classes.centeredGrid}>
            <div className={classes.inputWrapper}>
              <TextInput
                classNames={{ input: classes.input }}
                styles={{ input: { textAlign: 'right' } }}
                placeholder={ingredient.isBaseIngredient ? 'Total baseIngredient weight' : 'Baker\'s percentage'}
                rightSection={<span>{ingredient.isBaseIngredient ? 'g' : '%'}</span>}
                value={ingredient.isBaseIngredient ? baseIngredientWeight : ingredientPercentages[index]}
                onFocus={handleInputFocus}
                onChange={(event) => {
                  if (ingredient.isBaseIngredient) {
                    setBaseIngredientWeight(parseInt(event.target.value) || 0);
                  } else {
                    handlePercentageChange(event, index);
                  }
                }}
              />
              {!ingredient.isBaseIngredient ? (
                <TextInput
                  classNames={{ input: classes.input }}
                  styles={{ input: { textAlign: 'right' } }}
                  readOnly
                  value={percentageToGrams(ingredientPercentages[index], baseIngredientWeight).toFixed(2)}
                  rightSection={<span>g</span>}
                />
              ) : null}
            </div>
          </Grid.Col>
        </Grid>
      ))}
    </Box>
  );
}

export default Ingredients;
