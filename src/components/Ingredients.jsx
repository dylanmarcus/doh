// src/components/Ingredients.jsx
import React, { useState, useEffect } from 'react';
import { TextInput, Grid, Box, Title, Modal, Button } from '@mantine/core';
import { createStyles } from '@mantine/styles';
import IngredientSelector from './IngredientSelector';
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

const allIngredients = [
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
  const [baseIngredientWeight, setBaseIngredientWeight] = useState(0);
  const [ingredientPercentages, setIngredientPercentages] = useState([
    100, // Percentage for flour, always 100%
    60,  // Default value for water
    2,   // Default value for salt
    1,   // Default value for yeast
    10,  // Default value for fat
  ]);
  const [selectedIngredients, setSelectedIngredients] = useState(['flour', 'water', 'salt', 'yeast', 'fat']);
  const [modalOpen, setModalOpen] = useState(false);

  const totalDoughMass = numberOfBalls * ballWeight;

  useEffect(() => {
    const otherIngredientTotalPercentage = ingredientPercentages
      .slice(1) // Exclude the base ingredient
      .filter((_, index) => selectedIngredients.includes(allIngredients[index + 1].name))
      .reduce((sum, percentage) => sum + (percentage || 0), 0);

    const baseWeight = totalDoughMass / (1 + otherIngredientTotalPercentage / 100);
    setBaseIngredientWeight(baseWeight);
  }, [numberOfBalls, ballWeight, ingredientPercentages, selectedIngredients]);

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

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const selectedIngredientDetails = allIngredients.filter(ingredient =>
    selectedIngredients.includes(ingredient.name)
  );

  return (
    <Box>
      <Button onClick={() => setModalOpen(true)}>Select Ingredients</Button>
      <Modal opened={modalOpen} onClose={handleCloseModal} title="Select Ingredients">
        <IngredientSelector
          selectedIngredients={selectedIngredients}
          setSelectedIngredients={setSelectedIngredients}
          onClose={handleCloseModal}
        />
      </Modal>
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
      {selectedIngredientDetails.map((ingredient, index) => {
        const percentageIndex = allIngredients.findIndex(ing => ing.name === ingredient.name);
        return (
          <Grid key={ingredient.name} className={classes.ingredientRow}>
            <Grid.Col span={12}>
              <Title order={5} className={classes.ingredientName}>{ingredient.label}</Title>
            </Grid.Col>
            <Grid.Col span={12} className={classes.centeredGrid}>
              <div className={classes.inputWrapper}>
                <TextInput
                  classNames={{ input: classes.input }}
                  styles={{ input: { textAlign: 'right' } }}
                  placeholder={ingredient.isBaseIngredient ? 'Total base ingredient weight' : 'Baker\'s percentage'}
                  rightSection={<span>{ingredient.isBaseIngredient ? 'g' : '%'}</span>}
                  value={ingredient.isBaseIngredient ? baseIngredientWeight.toFixed(2) : ingredientPercentages[percentageIndex]}
                  onFocus={handleInputFocus}
                  onChange={(event) => {
                    if (ingredient.isBaseIngredient) {
                      setBaseIngredientWeight(parseFloat(event.target.value) || 0);
                    } else {
                      handlePercentageChange(event, percentageIndex);
                    }
                  }}
                />
                {!ingredient.isBaseIngredient ? (
                  <TextInput
                    classNames={{ input: classes.input }}
                    styles={{ input: { textAlign: 'right' } }}
                    readOnly
                    value={percentageToGrams(ingredientPercentages[percentageIndex], baseIngredientWeight).toFixed(2)}
                    rightSection={<span>g</span>}
                  />
                ) : null}
              </div>
            </Grid.Col>
          </Grid>
        );
      })}
    </Box>
  );
}

export default Ingredients;
