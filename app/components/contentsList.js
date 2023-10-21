import {
  Box,
  VStack,
  Text,
  FlatList,
  Divider,
  Image,
  HStack,
} from '@gluestack-ui/themed';
import React from 'react';
import {TouchableOpacity, Dimensions} from 'react-native';

const ContentsList = ({data, onSubmit}) => {
  const size = Dimensions.get('window');
  const renderItem = ({item, index}) => {
    return (
      <Box backgroundColor="$white" overflow="hidden">
        <TouchableOpacity onPress={() => onSubmit(item)}>
          <VStack space="xs" p={'$4'}>
            <Text size="lg" bold color="#7E98CB">
              {item.title}
            </Text>

            {item.image != null ? (
              <HStack space="md" w={'$full'}>
                <Image
                  alt="imageContent"
                  h={100}
                  w={100}
                  borderRadius={10}
                  source={{
                    uri: item.image,
                  }}
                />
                <VStack w={size.width * 0.6}>
                  <Text size="sm" numberOfLines={5}>
                    {item.description}
                  </Text>
                </VStack>
              </HStack>
            ) : (
              <>
                <Text size="sm" numberOfLines={2}>
                  {item.description}
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
      keyExtractor={item => item.title}></FlatList>
  );
};

export default ContentsList;
