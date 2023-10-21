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

const AdminChangePass = ({navigation}) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const handleChangePassword = async () => {
    try {
      setIsLoading(true);
      const user = auth().currentUser;
      console.log(user);
      const credential = auth.EmailAuthProvider.credential(
        user.email,
        oldPassword,
      );

      // Reauthenticate the user with their old password
      await user.reauthenticateWithCredential(credential);

      // Once reauthentication is successful, update the password
      await user.updatePassword(newPassword);

      setIsLoading(false);
      toast.show({
        placement: 'bottom',
        render: ({id}) => {
          return (
            <Toast action="success" variant="accent">
              <VStack space="xs">
                <ToastTitle>Berhasil</ToastTitle>
                <ToastDescription>
                  Password berhasil diperbarui
                </ToastDescription>
              </VStack>
            </Toast>
          );
        },
      });
      navigation.goBack();
    } catch (error) {
      console.error('Error changing password:', error.message);
      setIsLoading(false);
      toast.show({
        placement: 'bottom',
        render: ({id}) => {
          return (
            <Toast action="error" variant="accent">
              <VStack space="xs">
                <ToastTitle>Error</ToastTitle>
                <ToastDescription>{error}</ToastDescription>
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
            placeholder="Old Password"
            size="xs"
            onChangeText={text => setOldPassword(text)}></InputField>
        </Input>
        <Input>
          <InputField
            placeholder="New Password"
            size="xs"
            onChangeText={text => setNewPassword(text)}></InputField>
        </Input>

        <Button onPress={handleChangePassword}>
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

export default AdminChangePass;
