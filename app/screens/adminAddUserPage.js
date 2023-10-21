import React, {useState} from 'react';
import {
  Box,
  VStack,
  Button,
  ButtonText,
  Input,
  InputField,
  ButtonSpinner,
  useToast,
  Toast,
  ToastTitle,
  ToastDescription,
} from '@gluestack-ui/themed';
import auth from '@react-native-firebase/auth';

const AdminAddUser = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleRegistration = async () => {
    try {
      setIsLoading(true);
      await auth().createUserWithEmailAndPassword(email, password);
      console.log('User registered successfully');
      setIsLoading(false);
      toast.show({
        placement: 'bottom',
        render: ({id}) => {
          return (
            <Toast action="success" variant="accent">
              <VStack space="xs">
                <ToastTitle>Berhasil</ToastTitle>
                <ToastDescription>Akun admin berhasil dibuat.</ToastDescription>
              </VStack>
            </Toast>
          );
        },
      });
      navigation.goBack();
    } catch (error) {
      setIsLoading(false);
      toast.show({
        placement: 'bottom',
        render: ({id}) => {
          return (
            <Toast action="error" variant="accent">
              <VStack space="xs">
                <ToastTitle>Error</ToastTitle>
                <ToastDescription> Akun admin gagal dibuat.</ToastDescription>
              </VStack>
            </Toast>
          );
        },
      });
    }
  };

  return (
    <Box p={10}>
      <VStack space="md">
        <Input>
          <InputField
            placeholder="Email"
            size="xs"
            onChangeText={text => setEmail(text)}></InputField>
        </Input>
        <Input>
          <InputField
            placeholder="Password"
            size="xs"
            onChangeText={text => setPassword(text)}></InputField>
        </Input>

        <Button onPress={handleRegistration}>
          {isLoading === true ? (
            <ButtonSpinner />
          ) : (
            <ButtonText>Simpan</ButtonText>
          )}
        </Button>
        <Button action="secondary" onPress={() => navigation.goBack()} mb={35}>
          <ButtonText>Kembali</ButtonText>
        </Button>
      </VStack>
    </Box>
  );
};

export default AdminAddUser;
