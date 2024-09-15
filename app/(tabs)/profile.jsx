import { Button } from 'react-native';
import { useAuth } from '@clerk/clerk-expo';
import { useNavigation } from '@react-navigation/native';

const profile = () => {
  const { signOut } = useAuth();
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Button
      title="Sign out"
      onPress={handleSignOut}
    />
  );
};
export default profile