import React, { useState, useEffect } from 'react';
import { TextInput, Text, Grid, Box, Title, Button, Modal, Tooltip } from '@mantine/core';
import { FaClipboardList, FaSave, FaTrash } from 'react-icons/fa';
import { createStyles } from '@mantine/styles';
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

const Recipe = ({ recipe, onRecipeSaved, navbarWidth, navbarOpened }) => {
  const { classes } = useStyles();

  const [recipeName, setRecipeName] = useState(recipe ? recipe.name : '');
  const [numberOfBalls, setNumberOfBalls] = useState(recipe ? recipe.numberOfBalls : 1);
  const [ballWeight, setBallWeight] = useState(recipe ? recipe.ballWeight : 500);
  const [ingredientPercentages, setIngredientPercentages] = useState(recipe ? recipe.ingredients.map(ing => ing.percentage) : []);
  const [selectedIngredients, setSelectedIngredients] = useState(recipe ? recipe.ingredients.map(ing => ing.selected) : []);
  const [ingredients, setIngredients] = useState([]);
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [recipeId, setRecipeId] = useState(recipe ? recipe._id : null);
  const [deleteDialogOpened, setDeleteDialogOpened] = useState(false);

  const [baseIngredientWeight, setBaseIngredientWeight] = useState(0);

  useEffect(() => {
    fetch('src/utils/ingredients.json')
      .then(response => response.json())
      .then(data => {
        setIngredients(data);
        setIngredientPercentages(data.map(ingredient => ingredient.defaultPercentage));

        // Initialize selected ingredients based on default ingredients
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

  useEffect(() => {
    if (recipe) {
      setRecipeName(recipe.name);
      setNumberOfBalls(recipe.numberOfBalls);
      setBallWeight(recipe.ballWeight);
      setIngredientPercentages(recipe.ingredients.map(ing => ing.percentage));
      setSelectedIngredients(recipe.ingredients.map(ing => ing.selected));
    }
  }, [recipe]);

  useEffect(() => {
    setRecipeId(recipe ? recipe._id : null);
  }, [recipe]);

  useEffect(() => {
    if (!recipe) {
      resetRecipe();
    }
  }, [recipe]);

  const handleInputFocus = (event) => {
    setTimeout(() => event.target.select(), 10);
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
      onRecipeSaved();
      alert('Recipe saved successfully!');
    } catch (error) {
      console.error('Failed to save recipe:', error);
      alert('Failed to save recipe');
    }
  };

  const handleDeleteRecipe = async () => {
    try {
      await axios.delete(`/api/recipes/${recipeId}`);
      onRecipeSaved(); // Trigger a refresh or redirect after deletion
      resetRecipe();
      alert('Recipe deleted successfully!');
    } catch (error) {
      console.error('Failed to delete recipe:', error);
      alert('Failed to delete recipe');
    }
    setDeleteDialogOpened(false); // Close the confirmation dialog
  };

  const resetRecipe = () => {
    setRecipeName('');
    setNumberOfBalls(1);
    setBallWeight(500);
    setIngredientPercentages(ingredients.map(ingredient => ingredient.defaultPercentage));
    setSelectedIngredients(ingredients.map(ingredient => ingredient.defaultSelected !== undefined ? ingredient.defaultSelected : true));
    setRecipeId(null);
  };

  const percentageToGrams = (bakerPercentage, baseIngredient) => {
    return (bakerPercentage / 100) * baseIngredient;
  };

  return (
    <Box>
      <Grid className={classes.recipeName}>
        <Grid.Col span={8}>
          <TextInput
            placeholder="Recipe Name"
            value={recipeName}
            onChange={(event) => setRecipeName(event.target.value)}
            onFocus={(event) => event.target.select()}
            styles={{
              input: {
                fontSize: '2rem',
                fontWeight: 'bold',
                lineHeight: '6rem',
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
        <Grid.Col span={12} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div>
            <Tooltip
              label="Save recipe"
              position="right"
              withArrow
            >
              <Button onClick={handleSaveRecipe} style={{ marginRight: '0.5rem', }}>
                <FaSave size={20} />
              </Button>
            </Tooltip>
            {recipeId && (
              <Tooltip
                label="Delete recipe"
                position="right"
                withArrow
              >
                <Button color="red" onClick={() => setDeleteDialogOpened(true)}>
                  <FaTrash size={20} />
                </Button>
              </Tooltip>
            )}
          </div>
          <Modal
            opened={deleteDialogOpened}
            onClose={() => setDeleteDialogOpened(false)}
            title="Confirm Deletion"
          >
            <Text>Are you sure you want to delete this recipe?</Text>
            <Button color="red" onClick={handleDeleteRecipe}>Yes</Button>
            <Button onClick={() => setDeleteDialogOpened(false)}>No</Button>
          </Modal>
        </Grid.Col>
      </Grid>
      <Grid>
        <Tooltip
          label="Select ingredients"
          position="right"
          withArrow
        >
          <Button
            onClick={() => setSelectorOpen(true)}
            style={{
              position: 'fixed',
              left: navbarOpened && window.innerWidth > 768 ? `${navbarWidth + 30}px` : '30px',
              top: 'calc(100% - 50px)',
              transform: 'translateY(-50%)',
              transition: 'left 200ms ease',
              zIndex: 1000
            }}
          >
            <FaClipboardList size={20} />
          </Button>
        </Tooltip>
      </Grid>
      <Modal opened={selectorOpen} onClose={() => setSelectorOpen(false)} title="Select Ingredients">
        <IngredientSelector
          selectedIngredients={selectedIngredients}
          setSelectedIngredients={setSelectedIngredients}
          onClose={() => setSelectorOpen(false)}
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

export default Recipe;
