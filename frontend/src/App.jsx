import React, { useState, useEffect, useRef } from 'react';
import { AppShell, Burger, Grid, Group, Container, Title, Button, ActionIcon, Tooltip } from '@mantine/core';
import { FaPlus } from 'react-icons/fa';
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
  const navbarRef = useRef(null);
  const [navbarWidth, setNavbarWidth] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      axios.get('/api/recipes')
        .then(response => setRecipes(response.data))
        .catch(error => console.error('Failed to fetch recipes:', error));
    } else {
      setRecipes([]);
    }
  }, [recipeChangeTrigger, isAuthenticated]);

  useEffect(() => {
    const handleResize = () => {
      if (navbarRef.current) {
        setNavbarWidth(navbarRef.current.offsetWidth);
      }
    };

    // Measure initially in case the initial width is needed on load
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogin = (token) => {
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setIsAuthenticated(true);
    setRecipeChangeTrigger(prev => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setIsAuthenticated(false);
    setRecipeChangeTrigger(prev => !prev);
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
          <Tooltip
            label="Saved recipes"
            placement="bottom"
            withArrow
            disabled={mobileOpened || desktopOpened}
          >
            <span>
              <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom='sm' size='sm' />
              <Burger opened={desktopOpened} onClick={toggleDesktop} visibleFrom='sm' size='sm' />
            </span>
          </Tooltip>
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
      <AppShell.Navbar ref={navbarRef} p='md'>
        {recipes.map(recipe => (
          <Button key={recipe._id} onClick={() => selectRecipe(recipe._id)}>
            {recipe.name}
          </Button>
        ))}
      </AppShell.Navbar>
      <AppShell.Main>
        <Container padding="md" size="xl" style={{ maxWidth: '100%' }}>
          <Grid>
            <Grid.Col span={12} style={{ display: 'flex', justifyContent: 'right', alignItems: 'center', marginBottom: '-2rem' }}>
              <div>
                <Tooltip
                  label="Add new recipe"
                  position="left"
                  withArrow
                >
                  <ActionIcon
                    variant="filled"
                    size="xl"
                    onClick={() => setSelectedRecipe(null)}
                    sx={(theme) => ({
                      backgroundColor: theme.colors.gray[0], // Regular background color
                      color: theme.black, // Regular icon color
                      '&:hover': {
                        backgroundColor: theme.colors.gray[2], // Hover background color
                        color: theme.colors.blue[6], // Hover icon color
                      }
                    })}
                  >
                    <FaPlus size={20} style={{ color: 'inherit' }} />
                  </ActionIcon>
                </Tooltip>
              </div>
            </Grid.Col>
          </Grid>
          <Recipe
            recipe={selectedRecipe}
            onRecipeSaved={() => setRecipeChangeTrigger(prev => !prev)}
            navbarWidth={navbarWidth}
            navbarOpened={mobileOpened || desktopOpened}
          />
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}

export default App;