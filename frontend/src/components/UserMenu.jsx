import { Menu, Button, ActionIcon } from '@mantine/core';
import { FaUser } from 'react-icons/fa';

const UserMenu = ({ isAuthenticated, onLogin, onSignUp, onLogout }) => {
  return (
    <Menu>
      <Menu.Target>
        <ActionIcon>
          <FaUser />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        {!isAuthenticated ? (
          <>
            <Menu.Item onClick={onLogin}>Login</Menu.Item>
            <Menu.Item onClick={onSignUp}>Sign Up</Menu.Item>
          </>
        ) : (
          <Menu.Item onClick={onLogout} color="red">Logout</Menu.Item>
        )}
      </Menu.Dropdown>
    </Menu>
  );
};

export default UserMenu;