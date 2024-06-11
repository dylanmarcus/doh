// src/components/Ingredients.jsx
import React, { useState, useEffect } from 'react';
import { TextInput, Grid, Box, Title, Button, Modal } from '@mantine/core';
import { createStyles } from '@mantine/styles';
import { percentageToGrams } from '../utils/calculate';
import IngredientSelector from './IngredientSelector';

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

function Ingredients() {
  const { classes } = useStyles();
  const [numberOfBalls, setNumberOfBalls] = useState(1);
  const [ballWeight, setBallWeight] = useState(500);
  const [baseIngredientWeight, setBaseIngredientWeight] = useState(0);
  const [ingredientPercentages, setIngredientPercentages] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [selectorOpen, setSelectorOpen] = useState(false);

  useEffect(() => {
    fetch('/path/to/ingredients.json')
      .then(response => response.json())
      .then(data => {
        setIngredients(data);
        setIngredientPercentages(data.map(ingredient => ingredient.defaultPercentage));
        setSelectedIngredients(data.map(() => true));
      });
  }, []);

  useEffect(() => {
    updateBaseIngredientWeight();
  }, [numberOfBalls, ballWeight, ingredientPercentages, selectedIngredients]);

  const handleInputFocus = (event) => {
    const input = event.target;
    setTimeout(() => {
      input.select();
    }, 0);
  };

  const handleNumberOfBallsChange = (event) => {
    const value = parseInt(event.target.value) || 0;
    setNumberOfBalls(value);
  };

  const handleBallWeightChange = (event) => {
    const value = parseInt(event.target.value) || 0;
    setBallWeight(value);
  };

  const updateBaseIngredientWeight = () => {
    const totalDoughMass = numberOfBalls * ballWeight;
    const selectedPercentages = ingredientPercentages.filter((_, index) => selectedIngredients[index] && !ingredients[index].isBaseIngredient);
    const percentageSum = selectedPercentages.reduce((sum, percentage) => sum + percentage, 0);
    setBaseIngredientWeight(totalDoughMass / (1 + percentageSum / 100));
  };

  const handlePercentageChange = (index, value) => {
    const newPercentages = [...ingredientPercentages];
    newPercentages[index] = parseFloat(value) || 0;
    setIngredientPercentages(newPercentages);
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
      <Button onClick={() => setSelectorOpen(true)}>Select Ingredients</Button>
      <Modal opened={selectorOpen} onClose={() => setSelectorOpen(false)} title="Select Ingredients">
        <IngredientSelector
          selectedIngredients={selectedIngredients}
          setSelectedIngredients={setSelectedIngredients}
          onClose={() => setSelectorOpen(false)}
        />
      </Modal>
      {ingredients.map((ingredient, index) => (
        selectedIngredients[index] && (
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
                  value={ingredient.isBaseIngredient ? baseIngredientWeight.toFixed(2) : ingredientPercentages[index]}
                  onFocus={handleInputFocus}
                  onChange={(event) => {
                    if (!ingredient.isBaseIngredient) {
                      handlePercentageChange(index, event.target.value);
                    }
                  }}
                  readOnly={ingredient.isBaseIngredient}
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
        )
      ))}
    </Box>
  );
}

export default Ingredients;
