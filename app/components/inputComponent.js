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
} from '@gluestack-ui/themed';
import {
  Image,
  Dimensions,
  StatusBarm,
  BackHandler,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons';

const InputComponent = ({
  onSubmit,
  onViewBookmark,
  onViewHistory,
  onSetQuery,
  onHome,
  onSetSearchEngine,
  onClear,
  setUrl,
}) => {
  const size = Dimensions.get('window');
  return (
    <Box w={size.width}>
      <HStack space="md" m={10} justifyContent="flex-start" alignItems="center">
        <TouchableOpacity onPress={() => onHome()}>
          <Feather name="home" size={25} />
        </TouchableOpacity>
        <Input
          borderRadius={30}
          // padding={2}
          width={size.width * 0.55}
          height={40}
          backgroundColor="$secondary200"
          variant="outline"
          size="md"
          isDisabled={false}
          isInvalid={false}
          isReadOnly={false}>
          <InputField
            onClear
            fontSize={12}
            placeholder="Masukkan alamat website"
            onSubmitEditing={() => onSubmit()}
            onChangeText={text => onSetQuery(text)}>
            {setUrl}
          </InputField>
        </Input>
        <TouchableOpacity onPress={() => onViewBookmark()}>
          <MaterialCommunity name="close-outline" size={20} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onViewBookmark()}>
          <MaterialCommunity name="bookmark-outline" size={20} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onViewHistory()}>
          <MaterialCommunity name="history" size={20} />
        </TouchableOpacity>
        {/* <TouchableOpacity onPress={() => onSetSearchEngine()}>
          <MaterialCommunity name="cog" size={25} />
        </TouchableOpacity> */}
      </HStack>
      <Divider bgColor="$secondary500" height={0.5} />
    </Box>
  );
};

export default InputComponent;
