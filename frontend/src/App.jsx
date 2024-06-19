import React, { useState, useEffect } from 'react';
import { AppShell, Burger, Grid, Group, Container, Title, Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import axios from 'axios';
import logo from '../src/assets/donut.png';
import Recipe from './components/Recipe';
import Login from './components/Login';
import SignUp from './components/SignUp';

const App = () => {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginOpened, setLoginOpened] = useState(false);
  const [signUpOpened, setSignUpOpened] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [recipeChangeTrigger, setRecipeChangeTrigger] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    axios.get('/api/recipes')
      .then(response => setRecipes(response.data))
      .catch(error => console.error('Failed to fetch recipes:', error));
  }, [recipeChangeTrigger]);

  const handleLogin = (token) => {
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setIsAuthenticated(false);
  };

  const selectRecipe = (id) => {
    axios.get(`/api/recipes/${id}`)
      .then(response => {
        setSelectedRecipe(response.data);
      })
      .catch(error => console.error('Failed to fetch recipe details:', error));
  };

  return (
    <AppShell
      header={{ height: { base: 60, md: 70, lg: 80 } }}
      navbar={{
        width: { base: 200, md: 300, lg: 400 },
        breakpoint: 'sm',
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
      padding='md'
    >
      <AppShell.Header>
        <Group style={{ width: '100%', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', marginBottom: 0, marginTop: 10, marginLeft: 10, paddingRight: 20 }}>
          <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom='sm' size='sm' />
          <Burger opened={desktopOpened} onClick={toggleDesktop} visibleFrom='sm' size='sm' />
          <img src={logo} alt="Logo" style={{ height: '50px' }} />
          <Title order={1} style={{ flexGrow: 1 }}>Doh</Title>
          <Group>
            {!isAuthenticated && (
              <>
                <Button onClick={() => setLoginOpened(true)}>Login</Button>
                <Button onClick={() => setSignUpOpened(true)}>Sign Up</Button>
              </>
            )}
            {isAuthenticated && (
              <Button color='red' onClick={handleLogout}>Logout</Button>
            )}
          </Group>
          <Login opened={loginOpened} onClose={() => setLoginOpened(false)} onLoginSuccess={handleLogin} />
          <SignUp opened={signUpOpened} onClose={() => setSignUpOpened(false)} onSignUpSuccess={handleLogin} />
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p='md'>
        {recipes.map(recipe => (
          <Button key={recipe._id} onClick={() => selectRecipe(recipe._id)}>
            {recipe.name}
          </Button>
        ))}
      </AppShell.Navbar>
      <AppShell.Main>
        <Container padding="md" size="xl" style={{ maxWidth: '100%' }}>
          <Grid>
            <Grid.Col span={12} style={{ marginBottom: 20 }}>
              <div>
                <Button onClick={() => setSelectedRecipe(null)}>New Recipe</Button>
              </div>
            </Grid.Col>
          </Grid>
          <Recipe recipe={selectedRecipe} onRecipeSaved={() => setRecipeChangeTrigger(prev => !prev)} />
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}

export default App;