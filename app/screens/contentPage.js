import React, {useState, useEffect, useRef, useCallback} from 'react';
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
import CustomDatePicker from '../components';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import DatePicker from 'react-native-date-picker';
import client from '../api';
import axios from 'axios';

import {
  BookmarkComponent,
  ContentsView,
  InputComponent,
  SearchView,
} from '../components';

import realm from '../models';
import uuid from 'react-native-uuid';

import LottieView from 'lottie-react-native';
import moment from 'moment';
import {useFocusEffect} from '@react-navigation/native';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import ContentsList from '../components';
export default function ContentPage({navigation, route}) {
  const [openStart, setOpenStart] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [contents, setContents] = useState([]);
  const toast = useToast();
  const [fields, setFields] = useState({
    title: '',
    image: '',
    description: '',
    url: '',
    active_start: '',
    active_end: '',
    uri: null,
    imageType: '',
    imageName: '',
  });

  const size = Dimensions.get('window');

  const getContents = async () => {
    const contentsCollection = firestore().collection('contents');

    contentsCollection.get().then(querySnapshot => {
      const contentData = [];
      querySnapshot.forEach(doc => {
        const {
          title,
          description,
          image,
          url,
          active_start,
          active_end,
          uri,
          imageType,
          imageName,
        } = doc.data();

        const contentId = doc.id;

        contentData.push({
          contentId,
          title,
          description,
          image,
          url,
          active_start,
          active_end,
          uri,
          imageType,
          imageName,
        });
      });

      setContents(contentData);
    });
  };

  useFocusEffect(
    useCallback(() => {
      getContents();
    }, []),
  );

  useEffect(() => {
    getContents();
  }, []);

  const handleEdit = e => {
    console.log(e);
    navigation.navigate('ContentInput', {
      data: e,
      type: 'edit',
    });
  };

  const handleCreate = e => {
    navigation.navigate('ContentInput', {
      data: null,
      type: 'create',
    });
  };

  const handleDelete = e => {
    console.log(e.contentId);
    Alert.alert('Konfirmasi', 'Hapus konten ini ?', [
      {text: 'Tidak', onPress: () => {}},
      {
        text: 'Hapus',
        onPress: async () => {
          const id = e.contentId;
          firestore()
            .collection('contents')
            .doc(id)
            .delete()
            .then(result => {
              toast.show({
                placement: 'bottom',
                render: ({id}) => {
                  return (
                    <Toast action="success" variant="accent">
                      <VStack space="xs">
                        <ToastTitle>Berhasil</ToastTitle>
                        <ToastDescription>
                          Konten berhasil dihapus
                        </ToastDescription>
                      </VStack>
                    </Toast>
                  );
                },
              });
              getContents();
            })
            .catch(err => {
              toast.show({
                placement: 'bottom',
                render: ({id}) => {
                  return (
                    <Toast action="error" variant="accent">
                      <VStack space="xs">
                        <ToastTitle>Error</ToastTitle>
                        <ToastDescription>{err}</ToastDescription>
                      </VStack>
                    </Toast>
                  );
                },
              });
            });
        },
      },
    ]);
  };

  return (
    <Box flex={1} backgroundColor="$white">
      {contents.length > 0 ? (
        <ContentsView
          data={contents}
          onSubmit={handleEdit}
          onDelete={handleDelete}
        />
      ) : (
        <Center flex={1}>
          <Spinner />
        </Center>
      )}
      <Button mx={10} onPress={handleCreate} mb={5}>
        <ButtonText>Tambah Content</ButtonText>
      </Button>
      <Button
        action="secondary"
        mx={10}
        onPress={() => navigation.goBack()}
        mb={5}>
        <ButtonText>Kembali</ButtonText>
      </Button>
    </Box>
  );
}
