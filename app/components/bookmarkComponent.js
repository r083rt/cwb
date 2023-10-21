import {
  Box,
  VStack,
  Text,
  FlatList,
  Divider,
  Image,
  HStack,
  Center,
} from '@gluestack-ui/themed';
import React from 'react';
import {TouchableOpacity, Dimensions} from 'react-native';
import MaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
const BookmarkComponent = ({data, onDelete, onSubmit}) => {
  const size = Dimensions.get('window');
  const renderItem = ({item, index}) => {
    return (
      <Box w={size.width * 0.9}>
        <HStack space="sm" alignItems="flex-start">
          <TouchableOpacity
            onPress={() => {
              onDelete(item);
            }}>
            <MaterialCommunity
              name="delete"
              size={20}
              style={{color: '#CB0D0D'}}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onSubmit(item)}>
            <VStack w={size.width * 0.8}>
              <Text bold size="sm" numberOfLines={1}>
                {item.name}
              </Text>
              <Text size="xs" numberOfLines={1}>
                {item.url}
              </Text>
              <Text size="2xs" numberOfLines={1}>
                {moment(item.date).format('DD MMM YYYY HH:mm:ss')}
              </Text>
            </VStack>
          </TouchableOpacity>
        </HStack>
        <Divider my={10} color={'#f6f6f6'} />
      </Box>
    );
  };

  return (
    <FlatList
      renderItem={renderItem}
      data={data}
      ListEmptyComponent={() => (
        <Box h={100}>
          <Center flex={1}>
            <Text color={'#9C9C9C'}>Belum ada data</Text>
          </Center>
        </Box>
      )}
      keyExtractor={item => item.id}></FlatList>
  );
};

export default BookmarkComponent;
