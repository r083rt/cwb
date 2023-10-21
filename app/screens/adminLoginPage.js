import React, {useState, useEffect, useRef} from 'react';
import {
  Box,
  VStack,
  ScrollView,
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  ModalFooter,
  Heading,
  Text,
  Button,
  ButtonIcon,
  ButtonText,
  Icon,
  IconButton,
  SearchIcon,
  CloseIcon,
  ChevronRightIcon,
  Spinner,
  Center,
  HStack,
  Input,
  InputField,
  InputSlot,
  InputIcon,
  Divider,
  Progress,
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicatorWrapper,
  ActionsheetDragIndicator,
  ActionsheetItem,
  ActionsheetItemText,
  ButtonSpinner,
  useToast,
  Toast,
  ToastTitle,
  ToastDescription,
} from '@gluestack-ui/themed';
import {
  Image,
  Dimensions,
  StatusBarm,
  BackHandler,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {WebView} from 'react-native-webview';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import client from '../api';
import axios from 'axios';
import {
  BookmarkComponent,
  ContentsView,
  InputComponent,
  SearchView,
} from '../components';
import firestore from '@react-native-firebase/firestore';
import realm from '../models';
import uuid from 'react-native-uuid';

import LottieView from 'lottie-react-native';
import moment from 'moment';
import {firebase} from '@react-native-firebase/auth';
import auth from '@react-native-firebase/auth';
export default function AdminLoginPage({navigation}) {
  const [isLoading, setIsLoading] = useState(false);
  const [credential, setCredential] = useState({
    email: '',
    password: '',
  });

  const handleLogin = async () => {
    setIsLoading(true);
    auth()
      .signInWithEmailAndPassword(credential.email, credential.password)
      .then(res => {
        // const uid = res.user.uid;
        setIsLoading(false);
        navigation.navigate('AdminMenu');
      })
      .catch(error => {
        setIsLoading(false);
        if (error.code === 'auth/email-already-in-use') {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'That email address is already in use!',
          });
          console.log('That email address is already in use!');
        }
        if (error.code === 'auth/wrong-password') {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Wrong Password!',
          });
        }

        if (error.code === 'auth/invalid-email') {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'That email address is invalid!',
          });
        }

        console.error(error);
      });
  };

  return (
    <Box flex={1}>
      <VStack
        space="md"
        justifyContent="center"
        alignItems="center"
        mt={40}
        p={30}>
        <Heading>ADMIN LOGIN</Heading>
        <Box justifyContent="flex-start" w={'$full'}>
          <Text size="xs" bold>
            Email
          </Text>
          <Input>
            <InputField
              size="xs"
              onChangeText={text => {
                setCredential({...credential, email: text});
              }}></InputField>
          </Input>
        </Box>
        <Box justifyContent="flex-start" w={'$full'}>
          <Text size="xs" bold>
            Password
          </Text>
          <Input>
            <InputField
              size="xs"
              onChangeText={text => {
                setCredential({...credential, password: text});
              }}></InputField>
          </Input>
        </Box>
        <Box justifyContent="flex-start" w={'$full'}>
          <Button onPress={handleLogin}>
            {isLoading ? <ButtonSpinner /> : <ButtonText>Login</ButtonText>}
          </Button>
        </Box>
        {/* <Box justifyContent="flex-start" w={'$full'}>
          <Button onPress={() => navigation.navigate('AdminChangePass')}>
            <ButtonText>Change Password</ButtonText>
          </Button>
        </Box> */}
        <Box justifyContent="flex-start" w={'$full'}>
          <Button action="secondary" onPress={() => navigation.goBack()}>
            {isLoading ? <ButtonSpinner /> : <ButtonText>Kembali</ButtonText>}
          </Button>
        </Box>
      </VStack>
    </Box>
  );
}
