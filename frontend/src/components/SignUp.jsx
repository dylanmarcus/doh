import { Modal, TextInput, Button, Group } from '@mantine/core';
import axios from 'axios';

const SignUp = ({ opened, onClose, onSignUpSuccess }) => {
  const handleSignUp = async (event) => {
    event.preventDefault();
    const username = event.target.username.value;
    const email = event.target.email.value;
    const password = event.target.password.value;

    try {
      const response = await axios.post('api/auth/register', { username, email, password });
      localStorage.setItem('token', response.data.token);
      onSignUpSuccess(response.data.token);
      onClose();
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Sign Up">
      <form onSubmit={handleSignUp}>
        <TextInput label="Username" name="username" required />
        <TextInput label="Email" name="email" required />
        <TextInput label="Password" name="password" type="password" required />
        <Group position="right" mt="md">
          <Button type="submit">Sign Up</Button>
        </Group>
      </form>
    </Modal>
  );
}

export default SignUp;