import React, { useState, useEffect } from 'react';
import { TextInput, Group, Grid, Box, Title, Button, Modal, Tooltip, rem } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { FaClipboardList, FaSave, FaTrash } from 'react-icons/fa';
import { createStyles } from '@mantine/styles';
import IngredientSelector from './IngredientSelector';
import defaultIngredients from '../utils/defaultIngredients';
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

const Recipe = ({ recipe, onRecipeSaved, navbarWidth, navbarOpened, userInitiatedReset, setUserInitiatedReset }) => {
  const { classes } = useStyles();

  const [recipeState, setRecipeState] = useState(() => {
    const sessionRecipe = sessionStorage.getItem('recipe');
    return sessionRecipe ? JSON.parse(sessionRecipe) : {
      name: recipe ? recipe.name : '',
      numberOfBalls: recipe ? recipe.numberOfBalls : 1,
      ballWeight: recipe ? recipe.ballWeight : 500,
      ingredientPercentages: defaultIngredients.map(ingredient => ingredient.defaultPercentage),
      selectedIngredients: defaultIngredients.map(ingredient => ingredient.defaultSelected),
      customIngredients: [], // Ensure this is always an array
    };
  });

  const [baseIngredientWeight, setBaseIngredientWeight] = useState(0);
  const [ingredients, setIngredients] = useState([...defaultIngredients, ...recipeState.customIngredients]);
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [recipeId, setRecipeId] = useState(recipe ? recipe._id : null);
  const [deleteDialogOpened, setDeleteDialogOpened] = useState(false);

  useEffect(() => {
    if (!recipe && userInitiatedReset) {
      resetRecipe();
      setUserInitiatedReset(false); // Reset the flag
    }
  }, [recipe, userInitiatedReset]);

  useEffect(() => {
    sessionStorage.setItem('recipe', JSON.stringify(recipeState));
  }, [recipeState]);

  useEffect(() => {
    const defaultSelectedIngredients = defaultIngredients.map(ingredient => ingredient.defaultSelected);
    const defaultPercentages = defaultIngredients.map(ingredient => ingredient.defaultPercentage);
    setRecipeState(prevState => ({
      ...prevState,
      ingredientPercentages: prevState.ingredientPercentages.length > 0 ? prevState.ingredientPercentages : defaultPercentages,
      selectedIngredients: prevState.selectedIngredients.length > 0 ? prevState.selectedIngredients : defaultSelectedIngredients,
    }));
  }, []);

  useEffect(() => {
    setIngredients([...defaultIngredients, ...recipeState.customIngredients]);
  }, [recipeState.customIngredients]);

  useEffect(() => {
    const updateBaseIngredientWeight = () => {
      const totalDoughMass = recipeState.numberOfBalls * recipeState.ballWeight;
      const selectedPercentages = recipeState.ingredientPercentages?.filter((_, index) =>
        recipeState.selectedIngredients[index] && !(ingredients[index]?.isBaseIngredient)
      ) || [];
      const percentageSum = selectedPercentages.reduce((sum, percentage) => sum + percentage, 0);
      setBaseIngredientWeight(totalDoughMass / (1 + percentageSum / 100));
    };

    updateBaseIngredientWeight();
  }, [recipeState.numberOfBalls, recipeState.ballWeight, recipeState.ingredientPercentages, recipeState.selectedIngredients, ingredients]);

  useEffect(() => {
    if (recipe) {
      setRecipeState({
        name: recipe.name,
        numberOfBalls: recipe.numberOfBalls,
        ballWeight: recipe.ballWeight,
        ingredientPercentages: recipe.ingredients.map(ingredient => ingredient.percentage),
        selectedIngredients: recipe.ingredients.map(ingredient => ingredient.selected),
        customIngredients: recipe.customIngredients || [], // Ensure this is always an array
      });
    }
  }, [recipe]);

  useEffect(() => {
    setIngredients([...defaultIngredients, ...recipeState.customIngredients]);
  }, [recipeState]);

  useEffect(() => {
    setRecipeId(recipe ? recipe._id : null);
  }, [recipe]);

  const handleInputChange = (field, value) => {
    setRecipeState(prev => ({ ...prev, [field]: value }));
  };

  const handlePercentageChange = (index, value) => {
    const newPercentages = [...recipeState.ingredientPercentages];
    newPercentages[index] = parseFloat(value) || 0;
    setRecipeState(prevState => ({
      ...prevState,
      ingredientPercentages: newPercentages,
    }));
  };

  const handleInputFocus = (event) => {
    setTimeout(() => event.target.select(), 10);
  };

  const showMessage = (message, color) => {
    notifications.show({
      title: message,
      color: color,
    });
  }

  const handleSaveRecipe = async () => {
    if (!recipeState.name) {
      notifications.show({
        title: 'This recipe deserves a name...',
        message: 'Give it a name and try again.',
        color: 'orange',
      });
      return;
    }
    const recipeData = {
      name: recipeState.name,
      ingredients: recipeState.selectedIngredients.map((selected, index) => ({
        label: ingredients[index]?.label || recipeState.customIngredients[index - ingredients.length]?.label,
        percentage: recipeState.ingredientPercentages[index],
        selected
      })),
      numberOfBalls: recipeState.numberOfBalls,
      ballWeight: recipeState.ballWeight,
      customIngredients: recipeState.customIngredients,
    };

    const url = recipeId ? `/api/recipes/${recipeId}` : '/api/recipes/';
    const method = recipeId ? 'put' : 'post';

    try {
      const response = await axios[method](url, recipeData);
      if (!recipeId) setRecipeId(response.data._id);
      onRecipeSaved(response.data);
      showMessage('Recipe saved!', 'green');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error('Unauthorized access:', error);
        showMessage('Recipe not saved. Login or Sign Up to save this recipe', 'blue');
      } else {
        console.error('Failed to save recipe:', error);
        showMessage('Failed to save recipe', 'red');
      }
    }
  };

  const handleDeleteRecipe = async () => {
    try {
      await axios.delete(`/api/recipes/${recipeId}`);
      onRecipeSaved(); // Trigger a refresh or redirect after deletion
      resetRecipe();
      showMessage('Recipe deleted.', 'green');
    } catch (error) {
      console.error('Failed to delete recipe:', error);
      showMessage('Failed to delete recipe', 'red');
    }
    setDeleteDialogOpened(false);
  };

  const resetRecipe = () => {
    setRecipeState({
      name: '',
      numberOfBalls: 1,
      ballWeight: 500,
      ingredientPercentages: defaultIngredients.map(ingredient => ingredient.defaultPercentage),
      selectedIngredients: defaultIngredients.map(ingredient => ingredient.defaultSelected),
      customIngredients: [],
    });
    sessionStorage.removeItem('recipe');
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
            value={recipeState.name}
            onChange={(event) => handleInputChange('name', event.target.value)}
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
              position="bottom"
              withArrow
            >
              <Button onClick={handleSaveRecipe} style={{ marginRight: '0.5rem', }}>
                <FaSave size={20} />
              </Button>
            </Tooltip>
            {recipeId && (
              <Tooltip
                label="Delete recipe"
                position="bottom"
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
            title="Are you sure you want to delete this recipe?"
          >
            <Group position="apart" style={{ marginTop: '1rem' }}>
              <Button color="red" onClick={handleDeleteRecipe}>Delete</Button>
              <Button onClick={() => setDeleteDialogOpened(false)}>Keep</Button>
            </Group>
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
              left: navbarOpened && window.innerWidth > 768 ? rem(navbarWidth + 15) : rem(15),
              top: 'calc(100% - 2rem)',
              transform: 'translateY(-50%)',
              transition: 'left 200ms ease',
              zIndex: 99,
            }}
          >
            <FaClipboardList size={20} />
          </Button>
        </Tooltip>
      </Grid>
      <Modal opened={selectorOpen} onClose={() => setSelectorOpen(false)} title="Select Ingredients">
        <IngredientSelector
          selectedIngredients={recipeState.selectedIngredients}
          setSelectedIngredients={(newSelectedIngredients) => setRecipeState(prevState => ({
            ...prevState,
            selectedIngredients: newSelectedIngredients
          }))}
          onClose={() => setSelectorOpen(false)}
          customIngredients={recipeState.customIngredients}
          setCustomIngredients={(newCustomIngredients) => setRecipeState(prevState => ({
            ...prevState,
            customIngredients: newCustomIngredients,
            ingredientPercentages: [...prevState.ingredientPercentages, 0], // Add default percentage for new custom ingredient
          }))}
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
              value={recipeState.numberOfBalls}
              onChange={(event) => handleInputChange('numberOfBalls', event.target.value)}
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
              value={recipeState.ballWeight}
              onChange={(event) => handleInputChange('ballWeight', event.target.value)}
              onFocus={handleInputFocus}
            />
          </div>
        </Grid.Col>
      </Grid>
      {ingredients.map((ingredient, index) => (
        recipeState.selectedIngredients[index] && (
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
                  value={ingredient.isBaseIngredient ? baseIngredientWeight.toFixed(2) : recipeState.ingredientPercentages[index]}
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
                    value={percentageToGrams(recipeState.ingredientPercentages[index], baseIngredientWeight).toFixed(2)}
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