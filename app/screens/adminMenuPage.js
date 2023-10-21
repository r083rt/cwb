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

export default function AdminMenuPage({navigation}) {
  const [showSetting, setShowSetting] = useState(false);
  const toast = useToast();
  const updateSearchEngine = e => {
    firestore()
      .collection('settings')
      .doc('1')
      .update({
        search_engine: e,
      })
      .then(res => {
        setShowSetting(false);
        toast.show({
          placement: 'bottom',
          render: ({id}) => {
            return (
              <Toast action="success" variant="accent">
                <VStack space="xs">
                  <ToastTitle>Berhasil</ToastTitle>
                  <ToastDescription>
                    Search engine telah diperbarui
                  </ToastDescription>
                </VStack>
              </Toast>
            );
          },
        });
      })
      .catch(error => {
        toast.show({
          placement: 'bottom',
          render: ({id}) => {
            return (
              <Toast action="error" variant="accent">
                <VStack space="xs">
                  <ToastTitle>Gagal</ToastTitle>
                  <ToastDescription>
                    Search engine gagal diperbarui
                  </ToastDescription>
                </VStack>
              </Toast>
            );
          },
        });
      });
  };
  return (
    <Box flex={1}>
      <Actionsheet
        isOpen={showSetting}
        onClose={() => {
          setShowSetting(false);
        }}
        zIndex={999}>
        <ActionsheetBackdrop />
        <ActionsheetContent maxHeight="50%" zIndex={999}>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          <HStack
            bold
            alignItems="center"
            justifyContent="space-between"
            w={'$full'}
            p={5}>
            <Text size="lg" bold>
              Pilih Search Engine
            </Text>
          </HStack>
          <Divider my={10} />
          <ActionsheetItem
            onPress={() => {
              updateSearchEngine('google');
            }}>
            <ActionsheetItemText bold size={'lg'}>
              <HStack space="lg" justifyContent="center">
                <MaterialCommunity name="google" size={25} />
                <Text bold size="xl">
                  Google
                </Text>
              </HStack>
            </ActionsheetItemText>
          </ActionsheetItem>
          {/* <ActionsheetItem
            onPress={() => {
              updateSearchEngine('bing');
            }}>
            <ActionsheetItemText bold size={'lg'}>
              <HStack space="lg" justifyContent="center">
                <MaterialCommunity name="microsoft-bing" size={25} />
                <Text bold size="xl">
                  Bing
                </Text>
              </HStack>
            </ActionsheetItemText>
          </ActionsheetItem> */}
          <ActionsheetItem
            onPress={() => {
              updateSearchEngine('yahoo');
            }}>
            <ActionsheetItemText bold size={'lg'}>
              <HStack space="lg" justifyContent="center">
                <MaterialCommunity name="yahoo" size={25} />
                <Text bold size="xl">
                  Yahoo
                </Text>
              </HStack>
            </ActionsheetItemText>
          </ActionsheetItem>
        </ActionsheetContent>
      </Actionsheet>

      <VStack
        space="md"
        justifyContent="center"
        alignItems="center"
        mt={40}
        p={30}>
        <Text>ADMIN</Text>
        <Box justifyContent="flex-start" w={'$full'}>
          <Button onPress={() => setShowSetting(true)}>
            <ButtonText>Pilih Search Engine</ButtonText>
          </Button>
        </Box>
        <Box justifyContent="flex-start" w={'$full'}>
          <Button onPress={() => navigation.navigate('ContentPage')}>
            <ButtonText>Buat Konten</ButtonText>
          </Button>
        </Box>
        <Box justifyContent="flex-start" w={'$full'}>
          <Button
            action="negative"
            onPress={() => {
              navigation.navigate('Home');
            }}>
            <ButtonText>Keluar</ButtonText>
          </Button>
        </Box>
      </VStack>
    </Box>
  );
}
