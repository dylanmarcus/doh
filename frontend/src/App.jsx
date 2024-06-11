import React from 'react'
import { AppShell, Burger, Group, Skeleton, Title } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import logo from '../src/assets/donut.png'
import Ingredients from './components/Ingredients'

function App() {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure();

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
        </Group>
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

export default App
