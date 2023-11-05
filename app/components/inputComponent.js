import React, {useState, useEffect, useRef} from 'react';
import {
  Box,
  HStack,
  Input,
  InputField,
  Divider,
  Image,
  InputSlot,
} from '@gluestack-ui/themed';
import {Dimensions, TouchableOpacity} from 'react-native';
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
  onAddNewTab,
}) => {
  const size = Dimensions.get('window');
  const searchboxRef = useRef(null);

  return (
    <Box w={size.width}>
      <HStack space="md" m={10} justifyContent="flex-start" alignItems="center">
        <TouchableOpacity onPress={() => onHome()}>
          <Image
            alt="home"
            source={require('../assets/home.png')}
            width={25}
            height={25}
            opacity={0.5}
          />
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
            ref={searchboxRef}
            onClear
            fontSize={12}
            placeholder="Masukkan alamat website"
            onSubmitEditing={() => onSubmit()}
            onChangeText={text => onSetQuery(text)}>
            {setUrl}
          </InputField>
          <InputSlot mr={'$2'}>
            <TouchableOpacity onPress={() => onClear()}>
              <Image
                alt="close"
                source={require('../assets/close.png')}
                width={20}
                height={20}
                opacity={0.5}
              />
            </TouchableOpacity>
          </InputSlot>
        </Input>

        <TouchableOpacity onPress={() => onViewBookmark()}>
          <Image
            alt="bookmark"
            source={require('../assets/bookmark.png')}
            width={20}
            height={20}
            opacity={0.5}
          />
          {/* <MaterialCommunity name="bookmark-outline" size={20} /> */}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onViewHistory()}>
          <Image
            alt="history"
            source={require('../assets/history.png')}
            width={20}
            height={20}
            opacity={0.5}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onAddNewTab()}>
          <MaterialCommunity
            name="plus"
            size={25}
            color={'#5039A3'}
            style={{fontWeight: 'bold'}}
          />
        </TouchableOpacity>
      </HStack>
      <Divider bgColor="$secondary500" height={0.5} />
    </Box>
  );
};

export default InputComponent;
