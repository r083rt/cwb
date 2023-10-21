import {
  Box,
  VStack,
  Text,
  FlatList,
  Divider,
  Image,
  HStack,
  Button,
  ButtonText,
} from '@gluestack-ui/themed';
import React, {useEffect} from 'react';
import {TouchableOpacity, Dimensions} from 'react-native';

const ContentsView = ({data, onSubmit, onDelete}) => {
  const size = Dimensions.get('window');

  const renderItem = ({item, index}) => {
    return (
      <Box
        backgroundColor="$white"
        mx="$2"
        h={130}
        elevation={1}
        shadowColor="#A4A4A4"
        borderColor="$borderLight200"
        borderRadius="$lg"
        borderWidth="$1"
        my="$2">
        <TouchableOpacity onPress={() => onSubmit(item)}>
          <HStack space="xs">
            <Image
              alt="imageContent"
              borderTopLeftRadius={'$lg'}
              borderBottomLeftRadius={'$lg'}
              h={130}
              w={'$1/2'}
              maxHeight={130}
              size="md"
              borderRadius="$none"
              source={{
                uri: item.image,
              }}
            />
            <VStack
              space="xs"
              p={'$2'}
              width={size.width * 0.47}
              maxHeight={120}>
              <Text size="xs" bold>
                {item.title}
              </Text>
              <Text size="2xs" numberOfLines={3}>
                {item.description}
              </Text>
              <Text size="2xs" italic numberOfLines={1}>
                {item.url}
              </Text>
              <Button
                action="negative"
                size="xs"
                my={10}
                onPress={() => {
                  onDelete(item);
                }}>
                <ButtonText>Hapus</ButtonText>
              </Button>
            </VStack>
          </HStack>
        </TouchableOpacity>
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

export default ContentsView;
