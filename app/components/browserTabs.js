import React, {Component} from 'react';
import {View, TouchableOpacity} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {
  FlatList,
  Box,
  VStack,
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
  ButtonText,
  Icon,
  SearchIcon,
  CloseIcon,
  Spinner,
  Center,
  HStack,
  Input,
  InputField,
  InputSlot,
  InputIcon,
  Divider,
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicatorWrapper,
  ActionsheetDragIndicator,
  ActionsheetItem,
  ActionsheetItemText,
  Image,
} from '@gluestack-ui/themed';
import MaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons';

const BrowserTabs = ({data, onDelete, onOpen, onSelect}) => {
  const renderItem = ({item, index}) => {
    return (
      <HStack
        alignItems="center"
        space="md"
        mr={'$3'}
        px={10}
        py={3}
        borderTopLeftRadius={10}
        borderTopRightRadius={10}
        backgroundColor="#dedede">
        <TouchableOpacity
          onPress={() => {
            onSelect(item);
          }}>
          <Text bold size="xs">
            Tab {index + 1}
          </Text>
        </TouchableOpacity>
        {data.length > 1 ? (
          <TouchableOpacity
            onPress={() => {
              onDelete(item);
            }}>
            <MaterialCommunity name="close" style={{fontWeight: 'bold'}} />
          </TouchableOpacity>
        ) : null}
      </HStack>
    );
  };

  return (
    <FlatList
      showsHorizontalScrollIndicator={false}
      horizontal
      renderItem={renderItem}
      data={data}
      keyExtractor={item => item.id}></FlatList>
  );
};

export default BrowserTabs;
