import React, { useState, useEffect } from 'react';
import { AppShell, Burger, Group, Skeleton, Title, Button, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import axios from 'axios';
import logo from '../src/assets/donut.png';
import Ingredients from './components/Ingredients';
import Login from './components/Login';
import SignUp from './components/SignUp';


const App = () => {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginOpened, setLoginOpened] = useState(false);
  const [signUpOpened, setSignUpOpened] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setIsAuthenticated(true);
      // Fetch user data here if needed
    }
  }, []);

  const handleLogin = (token) => {
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setIsAuthenticated(true);
    // Fetch user data here if needed
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
      padding='md'
    >
      <AppShell.Header>
        <Group h='100%' px='md'>
          <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom='sm' size='sm' />
          <Burger opened={desktopOpened} onClick={toggleDesktop} visibleFrom='sm' size='sm' />
          <Group position="apart">
            <img src={logo} alt="Logo" style={{ height: '40px' }} />
            <Title>Doh</Title>
            {!isAuthenticated && (
              <Group>
                <Button onClick={() => setLoginOpened(true)}>Login</Button>
                <Button onClick={() => setSignUpOpened(true)}>Register</Button>
              </Group>
            )}
            <Login opened={loginOpened} onClose={() => setLoginOpened(false)} onLoginSuccess={handleLogin} />
            <SignUp opened={signUpOpened} onClose={() => setSignUpOpened(false)} onSignUpSuccess={handleLogin} />
          </Group>
          {isAuthenticated && (
            <Button color='red' onClick={handleLogout}>Logout</Button>
          )}
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p='md'>
        Navbar
        {Array(15)
          .fill(0)
          .map((_, index) => (
            <Skeleton key={index} h={28} mt='sm' animate={false} />
          ))}
      </AppShell.Navbar>
      <AppShell.Main>
        <Ingredients />
      </AppShell.Main>
    </AppShell>
  )
}

export default App;
