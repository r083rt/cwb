import React, {useState, useEffect} from 'react';
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
  Heading,
  Text,
  Button,
  ButtonIcon,
  ButtonText,
  Icon,
  CloseIcon,
  ChevronRightIcon,
  Spinner,
  Center,
} from '@gluestack-ui/themed';
import {Image, Dimensions, StatusBar} from 'react-native';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';

export default function SplashPage({navigation}) {
  return <Box flex={1}></Box>;
}
