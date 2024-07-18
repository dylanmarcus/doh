import React, { useState, useEffect, useRef } from 'react';
import { AppShell, Burger, Grid, Group, Container, Flex, Box, Title, Button, ActionIcon, Tooltip, rem } from '@mantine/core';
import { FaPlus } from 'react-icons/fa';
import { useDisclosure } from '@mantine/hooks';
import { useMediaQuery } from '@mantine/hooks';
import UserMenu from './components/UserMenu';
import axios from 'axios';
import logo from '../src/assets/donut.png';
import Recipe from './components/Recipe';
import Login from './components/Login';
import SignUp from './components/SignUp';
import classes from '../styles/RecipeList.module.css';

const App = () => {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginOpened, setLoginOpened] = useState(false);
  const [signUpOpened, setSignUpOpened] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [recipeChangeTrigger, setRecipeChangeTrigger] = useState(false);
  const navbarRef = useRef(null);
  const [navbarWidth, setNavbarWidth] = useState(0);
  const [userInitiatedReset, setUserInitiatedReset] = useState(false);

  /**
   * Checks if a token exists in local storage and sets the authentication state accordingly.
   * This effect is run once on component mount to initialize the authentication state.
   */
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
        if (mobileOpened) toggleMobile();
      })
      .catch(error => console.error('Failed to fetch recipe details:', error));
  };

  return (
    <AppShell
      style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}
      header={{ height: { base: 60, md: 70, lg: 80 } }}
      navbar={{
        width: { base: 200, md: 300, lg: 400 },
        breakpoint: 'sm',
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
      padding='md'
    >
      <AppShell.Header>
      <Flex
    justify="space-between"
    align="center"
    wrap="wrap"
    style={{
      width: '100%',
      padding: '0 20px',
      marginBottom: 0,
      marginTop: 5,
    }}
  >
    <Tooltip label="Saved recipes" position="bottom" withArrow>
      <Box>
        <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom="sm" size="sm" />
        <Burger opened={desktopOpened} onClick={toggleDesktop} visibleFrom="sm" size="sm" />
      </Box>
    </Tooltip>
    <img src={logo} alt="Logo" style={{ height: rem(50), marginLeft: rem(10) }} />
    <Title order={1} style={{ flexGrow: 1, marginLeft: rem(10) }}>Doh</Title>
    {isMobile ? (
      <UserMenu
        isAuthenticated={isAuthenticated}
        onLogin={() => setLoginOpened(true)}
        onSignUp={() => setSignUpOpened(true)}
        onLogout={handleLogout}
      />
    ) : (
      <Group style={{ flexShrink: 0 }}>
        {!isAuthenticated && (
          <>
            <Button onClick={() => setLoginOpened(true)}>Login</Button>
            <Button onClick={() => setSignUpOpened(true)}>Sign Up</Button>
          </>
        )}
        {isAuthenticated && (
          <Button color="red" onClick={handleLogout}>Logout</Button>
        )}
      </Group>
    )}
  </Flex>
  <Login opened={loginOpened} onClose={() => setLoginOpened(false)} onLoginSuccess={handleLogin} />
  <SignUp opened={signUpOpened} onClose={() => setSignUpOpened(false)} onSignUpSuccess={handleLogin} />
</AppShell.Header>
      <AppShell.Navbar ref={navbarRef} p='md' style={{ flexGrow: 1, overflowY: 'auto' }}>
        {recipes.map(recipe => (
          <a
            key={recipe._id}
            onClick={() => selectRecipe(recipe._id)}
            className={classes.recipeLink}
            style={{ fontSize: rem(16) }}
          >
            {recipe.name}
          </a>
        ))}
        {!recipes.length && (
          <div style={{ fontSize: rem(16), textAlign: 'center', marginTop: '1rem' }}>
            mmmmmmmmmm... saaaaved recccccipeeeeeesss...
          </div>
        )}
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
                    onClick={() => {
                      setSelectedRecipe(null);
                      setUserInitiatedReset(true);
                    }}
                    sx={(theme) => ({
                      backgroundColor: theme.colors.gray[0],
                      color: theme.black,
                      '&:hover': {
                        backgroundColor: theme.colors.gray[2],
                        color: theme.colors.blue[6],
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
            onRecipeSaved={(savedRecipe) => {
              setRecipeChangeTrigger(prev => !prev);
              setSelectedRecipe(savedRecipe);
            }}
            userInitiatedReset={userInitiatedReset}
            setUserInitiatedReset={setUserInitiatedReset}
            navbarWidth={navbarWidth}
            navbarOpened={mobileOpened || desktopOpened}
          />
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}

export default App;