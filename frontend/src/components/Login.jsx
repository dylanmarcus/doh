import { Modal, TextInput, Button, Group } from '@mantine/core';
import axios from 'axios';

const Login = ({ opened, onClose, onLoginSuccess }) => {
  const handleLogin = async (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;

    try {
      const response = await axios.post('/api/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      onLoginSuccess(response.data.token);
      onClose();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Login">
      <form onSubmit={handleLogin}>
        <TextInput label="Email" name="email" required />
        <TextInput label="Password" name="password" type="password" required />
        <Group position="right" mt="md">
          <Button type="submit">Login</Button>
        </Group>
      </form>
    </Modal>
  );
}

export default Login;