import React, { useState, useEffect } from 'react';
import { TextInput, Grid, Box, Title, Button, Modal, Container } from '@mantine/core';
import { createStyles } from '@mantine/styles';
import { percentageToGrams } from '../utils/calculate';
import IngredientSelector from './IngredientSelector';
import axios from 'axios';

const useStyles = createStyles((theme) => ({
  recipeName: {
    marginBottom: theme.spacing.lg,
  },
  ingredientRow: {
    marginBottom: theme.spacing.md,
  },
  ingredientName: {
    textTransform: 'capitalize',
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  input: {
    width: '100%',
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

const Recipe = () => {
  const { classes } = useStyles();
  const [recipeName, setRecipeName] = useState('');
  const [numberOfBalls, setNumberOfBalls] = useState(1);
  const [ballWeight, setBallWeight] = useState(500);
  const [baseIngredientWeight, setBaseIngredientWeight] = useState(0);
  const [ingredientPercentages, setIngredientPercentages] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [recipeId, setRecipeId] = useState(null);

  useEffect(() => {
    fetch('src/utils/ingredients.json')
      .then(response => response.json())
      .then(data => {
        setIngredients(data);
        setIngredientPercentages(data.map(ingredient => ingredient.defaultPercentage));

        // Initialize selected ingredients based on default inclusion/exclusion
        const defaultSelectedIngredients = data.map(ingredient => ingredient.defaultSelected !== undefined ? ingredient.defaultSelected : true);
        setSelectedIngredients(defaultSelectedIngredients);
      });
  }, []);

  useEffect(() => {
    const updateBaseIngredientWeight = () => {
      const totalDoughMass = numberOfBalls * ballWeight;
      const selectedPercentages = ingredientPercentages.filter((_, index) => selectedIngredients[index] && !ingredients[index].isBaseIngredient);
      const percentageSum = selectedPercentages.reduce((sum, percentage) => sum + percentage, 0);
      setBaseIngredientWeight(totalDoughMass / (1 + percentageSum / 100));
    };

    updateBaseIngredientWeight();
  }, [numberOfBalls, ballWeight, ingredientPercentages, selectedIngredients, ingredients]);


  const handleInputFocus = (event) => {
    event.target.select();

  };

  const handleNumberOfBallsChange = (event) => {
    const value = parseInt(event.target.value) || 0;
    setNumberOfBalls(value);
  };

  const handleBallWeightChange = (event) => {
    const value = parseInt(event.target.value) || 0;
    setBallWeight(value);
  };

  const handlePercentageChange = (index, value) => {
    const newPercentages = [...ingredientPercentages];
    newPercentages[index] = parseFloat(value) || 0;
    setIngredientPercentages(newPercentages);
  };

  const handleSaveRecipe = async () => {
    const recipeData = {
      name: recipeName,
      ingredients: selectedIngredients.map((selected, index) => ({
        label: ingredients[index].label,
        percentage: ingredientPercentages[index],
        selected
      })),
      numberOfBalls,
      ballWeight
    };

    const url = recipeId ? `/api/recipes/${recipeId}` : '/api/recipes/';
    const method = recipeId ? 'put' : 'post';

    try {
      const response = await axios[method](url, recipeData);
      if (!recipeId) setRecipeId(response.data._id);
      alert('Recipe saved successfully!');
    } catch (error) {
      console.error('Failed to save recipe:', error);
      alert('Failed to save recipe');
    }
  };

  return (
    <Container padding="md" size="xl" style={{ maxWidth: '100%' }}>
      <Box>
        <Grid className={classes.recipeName}>
          <Grid.Col span={12}>
            <TextInput
              placeholder="Recipe Name"
              value={recipeName}
              onChange={(event) => setRecipeName(event.target.value)}
              onFocus={(event) => event.target.select()}
              styles={{
                input: {
                  fontSize: '2.5rem',
                  fontWeight: 'bold',
                  lineHeight: '3rem',
                  padding: '0',
                  width: '100%',
                  border: 'none',
                  borderBottom: '2px solid transparent',
                  cursor: 'text',
                }
              }}
              variant="unstyled"
            />
          </Grid.Col>
        </Grid>
        <Grid>
          <Grid.Col>
            <div>
              <Button onClick={handleSaveRecipe}>Save Recipe</Button>
            </div>
          </Grid.Col>
        </Grid>
        <Grid>
          <Grid.Col>
            <div>
              <Button onClick={() => setSelectorOpen(true)}>Select Ingredients</Button>
            </div>
          </Grid.Col>
        </Grid>
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
    </Container>
  );
}

export default Recipe;
