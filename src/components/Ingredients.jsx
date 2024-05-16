import React from 'react';
import { TextInput, Grid, Box, Title } from '@mantine/core';
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

const ingredients = ['flour', 'water', 'salt', 'yeast', 'fat'];

function Ingredients() {
  const { classes } = useStyles();

  return (
    <Box>
      {ingredients.map((ingredient) => (
        <Grid key={ingredient} className={classes.ingredientRow}>
          <Grid.Col span={12}>
            <Title order={5} className={classes.ingredientName}>{ingredient}</Title>
          </Grid.Col>
          <Grid.Col span={12} className={classes.centeredGrid}>
            <div className={classes.inputWrapper}>
              <TextInput
                classNames={{ input: classes.input }}
                rightSection={<span>%</span>}
								styles={{ input: { textAlign: 'right' } }}
              />
              <TextInput
                classNames={{ input: classes.input }}
                rightSection={<span>g</span>}
								styles={{ input: { textAlign: 'right' } }}
              />
            </div>
          </Grid.Col>
        </Grid>
      ))}
    </Box>
  );
}

export default Ingredients;
