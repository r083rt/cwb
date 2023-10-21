import {
  Box,
  VStack,
  Text,
  FlatList,
  Divider,
  HStack,
  Image,
} from '@gluestack-ui/themed';
import React from 'react';
import {TouchableOpacity, Dimensions} from 'react-native';

const SearchView = ({data, onEndReached, onSubmit}) => {
  const size = Dimensions.get('window');
  const renderItem = ({item, index}) => {
    return (
      <Box backgroundColor="$white" overflow="hidden">
        <TouchableOpacity onPress={() => onSubmit(item)}>
          <VStack space="xs" p={'$4'}>
            <Text size="lg" bold color="#3B67C0">
              {item.title}
            </Text>

            {item.image != '' ? (
              <HStack space="md" w={'$full'}>
                <Image
                  alt="imageContent"
                  h={70}
                  w={70}
                  borderRadius={5}
                  source={{
                    uri: item.image,
                  }}
                />
                <VStack w={size.width * 0.6}>
                  <Text size="sm" numberOfLines={5}>
                    {item.description}
                  </Text>
                  <Text size="2xs" italic numberOfLines={1}>
                    {item.breadcrumb ? item.breadcrumb : item.url}
                  </Text>
                </VStack>
              </HStack>
            ) : (
              <>
                <Text size="sm" numberOfLines={2}>
                  {item.description}
                </Text>
                <Text size="2xs" italic numberOfLines={1}>
                  {item.breadcrumb ? item.breadcrumb : item.url}
                </Text>
              </>
            )}
          </VStack>
        </TouchableOpacity>

        <Divider />
      </Box>
    );
  };

  return (
    <FlatList
      renderItem={renderItem}
      data={data}
      keyExtractor={(item, index) => index.toString()}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.3}></FlatList>
  );
};

export default SearchView;
