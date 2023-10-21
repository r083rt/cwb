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

import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';

export default function ContentInputPage({navigation, route}) {
  const [openStart, setOpenStart] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const data = route.params.data;
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

  const openGallery = async () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('Image picker error: ', response.error);
      } else {
        console.log(response);
        let imageUri = response.uri || response.assets?.[0]?.uri;
        setFields({
          ...fields,
          uri: imageUri,
          imageType: response.assets?.[0]?.type,
          imageName: response.assets?.[0]?.fileName,
        });
        console.log(imageUri);
        // setSelectedImage(imageUri);
      }
    });
  };

  const size = Dimensions.get('window');

  const handleUpdate = async () => {
    try {
      const id = data.contentId;
      setIsLoading(true);
      const reference = storage().ref(`${fields.imageName}`);
      const task = reference.putFile(fields.uri);
      const downloadURL = await new Promise((resolve, reject) => {
        task.on(
          'state_changed',
          taskSnapshot => {
            console.log(
              `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
            );
          },
          error => {
            reject(error);
          },
          async () => {
            const url = await reference.getDownloadURL();
            resolve(url);
          },
        );
      });

      const startDate = new Date(fields.active_start);
      const endDate = new Date(fields.active_end);

      await firestore()
        .collection('contents')
        .doc(id)
        .update({
          title: fields.title,
          description: fields.description,
          url: fields.url,
          image: downloadURL,
          active_start: firestore.Timestamp.fromDate(startDate),
          active_end: firestore.Timestamp.fromDate(endDate),
          content_type: '',
          subtitle: '',
          uri: fields.uri,
          imageName: fields.imageName,
          imageType: fields.imageType,
        });
      setIsLoading(false);
      toast.show({
        placement: 'bottom',
        render: ({id}) => {
          return (
            <Toast action="success" variant="accent">
              <VStack space="xs">
                <ToastTitle>Berhasil</ToastTitle>
                <ToastDescription>Konten berhasil diperbarui</ToastDescription>
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
                <ToastDescription>{error}</ToastDescription>
              </VStack>
            </Toast>
          );
        },
      });
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const reference = storage().ref(`${fields.imageName}`);
      const task = reference.putFile(fields.uri);
      const downloadURL = await new Promise((resolve, reject) => {
        task.on(
          'state_changed',
          taskSnapshot => {
            console.log(
              `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
            );
          },
          error => {
            reject(error);
          },
          async () => {
            const url = await reference.getDownloadURL();
            resolve(url);
          },
        );
      });

      console.log(route.params.type);

      await firestore().collection('contents').add({
        title: fields.title,
        description: fields.description,
        url: fields.url,
        image: downloadURL,
        active_start: firestore.FieldValue.serverTimestamp(),
        active_end: firestore.FieldValue.serverTimestamp(),
        content_type: '',
        subtitle: '',
        uri: fields.uri,
        imageName: fields.imageName,
        imageType: fields.imageType,
      });
      setIsLoading(false);
      toast.show({
        placement: 'bottom',
        render: ({id}) => {
          return (
            <Toast action="success" variant="accent">
              <VStack space="xs">
                <ToastTitle>Berhasil</ToastTitle>
                <ToastDescription>Konten berhasil dibuat</ToastDescription>
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
                <ToastDescription>{error}</ToastDescription>
              </VStack>
            </Toast>
          );
        },
      });
    }
  };

  useEffect(() => {
    // console.log(route.params.data);
    if (data) {
      const activeStartTimestamp = data.active_start;
      const activeEndTimestamp = data.active_end;

      const activeStartMoment = moment
        .unix(activeStartTimestamp.seconds)
        .format('YYYY-MM-DD');
      const activeEndMoment = moment
        .unix(activeEndTimestamp.seconds)
        .format('YYYY-MM-DD');

      console.log({
        title: data.title,
        image: data.image,
        description: data.description,
        url: data.url,
        active_start: activeStartMoment,
        active_end: activeEndMoment,
        uri: data.uri,
        imageType: data.imageType,
        imageName: data.imageName,
      });

      setFields({
        title: data.title,
        image: data.image,
        description: data.description,
        url: data.url,
        active_start: activeStartMoment,
        active_end: activeEndMoment,
        uri: data.uri,
        imageType: data.imageType,
        imageName: data.imageName,
      });
    }
  }, []);

  return (
    <Box flex={1}>
      <DatePicker
        modal
        mode="date"
        locale="id"
        is24hourSource="locale"
        open={openStart}
        date={new Date()}
        onConfirm={date => {
          setOpenStart(false);
          setFields({
            ...fields,
            active_start: moment(date).format('YYYY-MM-DD'),
          });
        }}
        onCancel={() => {
          setOpenStart(false);
        }}
      />
      <DatePicker
        modal
        mode="date"
        locale="id"
        is24hourSource="locale"
        open={openEnd}
        date={new Date()}
        onConfirm={date => {
          setOpenEnd(false);
          setFields({
            ...fields,
            active_end: moment(date).format('YYYY-MM-DD'),
          });
        }}
        onCancel={() => {
          setOpenEnd(false);
        }}
      />
      <ScrollView space="md" mt={40} mb={20} p={30}>
        <Heading>BUAT CONTENT</Heading>
        <Box justifyContent="flex-start" w={'$full'}>
          <Text size="xs" bold>
            Judul
          </Text>
          <Input>
            <InputField
              size="xs"
              onChangeText={text => {
                setFields({...fields, title: text});
              }}>
              {data ? data.title : null}
            </InputField>
          </Input>
        </Box>
        <Box justifyContent="flex-start" w={'$full'}>
          <Text size="xs" bold>
            Deskripsi
          </Text>
          <Input h={200} justifyContent="flex-start" alignItems="flex-start">
            <InputField
              justifyContent="flex-start"
              alignItems="flex-start"
              multiline
              height={200}
              size="xs"
              onChangeText={text => {
                setFields({...fields, description: text});
              }}>
              {data ? data.description : null}
            </InputField>
          </Input>
        </Box>
        <Box justifyContent="flex-start" w={'$full'}>
          <Text size="xs" bold>
            Periode
          </Text>
          <HStack space="xs" justifyContent="space-between">
            <Box w={size.width * 0.4}>
              <Input>
                <InputField
                  size="xs"
                  placeholder={
                    fields.active_start
                      ? moment(fields.active_start).format('DD MMM YYYY')
                      : 'Periode mulai'
                  }
                  onFocus={() => setOpenStart(true)}></InputField>
              </Input>
            </Box>
            <Box w={size.width * 0.4}>
              <Input>
                <InputField
                  size="xs"
                  placeholder={
                    fields.active_end
                      ? moment(fields.active_end).format('DD MMM YYYY')
                      : 'Periode mulai'
                  }
                  onFocus={() => setOpenEnd(true)}></InputField>
              </Input>
            </Box>
          </HStack>
        </Box>
        <Box justifyContent="flex-start" w={'$full'}>
          <Text size="xs" bold>
            URL
          </Text>
          <Input>
            <InputField
              size="xs"
              onChangeText={text => {
                setFields({...fields, url: text});
              }}>
              {data ? data.url : null}
            </InputField>
          </Input>
        </Box>
        <Box justifyContent="flex-start" w={'$full'}>
          <Text size="xs" bold>
            Gambar/Foto
          </Text>
          <Box h={200} backgroundColor="$lightgrey">
            {fields.uri || data ? (
              <TouchableOpacity onPress={openGallery}>
                <Box m={5} alignItems="center" justifyContent="center" h={180}>
                  <Image
                    source={{uri: fields.uri}}
                    resizeMode="cover"
                    style={{
                      height: 180,
                      width: size.width * 0.85,
                    }}
                  />
                </Box>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={openGallery}>
                <Box m={5} alignItems="center" justifyContent="center" h={180}>
                  <MaterialCommunity name="camera" size={50} />
                  <Text>Tambah Banner</Text>
                </Box>
              </TouchableOpacity>
            )}
          </Box>
        </Box>
        <Box justifyContent="flex-start" w={'$full'}>
          <Button
            onPress={
              route.params.type === 'create' ? handleSave : handleUpdate
            }>
            {isLoading === false ? (
              <ButtonText>Simpan</ButtonText>
            ) : (
              <HStack space="md">
                <Spinner color={'$white'} />
                <Text bold color={'$white'}>
                  Tunggu
                </Text>
              </HStack>
            )}
          </Button>
          <Button
            action="secondary"
            mt={5}
            onPress={() => navigation.goBack()}
            mb={35}>
            <ButtonText>Kembali</ButtonText>
          </Button>
        </Box>
      </ScrollView>
    </Box>
  );
}
