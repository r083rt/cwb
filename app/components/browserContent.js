import React, {Component} from 'react';
import {View, TouchableOpacity} from 'react-native';
import {WebView} from 'react-native-webview';
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

const BrowserContent = ({
  isLoading,
  currentUrl,
  searchData,
  handleInputSubmit,
  keyword,
}) => {
  return searchData.length === 0 && currentUrl === '' ? (
    <Box>
      <Center>
        <Image
          alt="logo"
          source={require('../assets/logo.png')}
          style={{
            width: size.width * 0.3,
            height: size.width * 0.4,
            marginTop: 30,
          }}
          resizeMode="cover"
        />
      </Center>

      <Box w={'$full'} p={20}>
        <Input borderRadius={50}>
          <InputField
            value={query}
            onChangeText={text => setQuery(text)}
            fontSize={14}
            onSubmitEditing={handleInputSubmit}
            placeholder="Masukkan kata kunci pencarian"
            backgroundColor="#EDEDED"></InputField>
          <InputSlot
            pr="$3"
            onPress={handleInputSubmit}
            backgroundColor="#EDEDED">
            {isLoading == false ? (
              <InputIcon as={SearchIcon} color="$gray" />
            ) : (
              <Spinner color={'#5039A3'} />
            )}
          </InputSlot>
        </Input>
      </Box>
    </Box>
  ) : searchData.length > 0 && currentUrl === '' ? (
    <>
      <Box mx={10} alignItems="flex-end">
        <Text color="#A7A7A7" size="2xs" textAlign="right">
          Source - {searchEngine.toUpperCase()}
        </Text>
      </Box>
      <Box mx={15}>
        <Text>
          Keyword :{' '}
          <Text color={'$blue'} italic bold>
            "{keyword}"
          </Text>
        </Text>
        <Text size="xs" mt={2} mb={5} color={'#919191'} italic>
          Search Time : {dataApi}
        </Text>
      </Box>

      <SearchView
        data={searchData}
        onEndReached={handleNextPage}
        onSubmit={handleSubmit}
      />
    </>
  ) : (
    <>
      <HStack
        space="xl"
        top={1}
        elevation={4}
        justifyContent="center"
        bottom={10}
        p={10}
        backgroundColor="#F0F0F0"
        w={'$full'}>
        <TouchableOpacity onPress={onAndroidBackPress}>
          <HStack space="sm">
            <Image
              alt="back"
              source={require('../assets/back.png')}
              width={20}
              height={20}
              opacity={0.5}
            />
            <Text size="xs" color={'#000000'}>
              Back
            </Text>
          </HStack>
        </TouchableOpacity>
        <Divider orientation="vertical" />
        <TouchableOpacity
          disabled={!canGoForward}
          onPress={onAndroidForwardPress}>
          <HStack space="sm">
            <Text size="xs" color={!canGoForward ? '#C9C9C9' : '#000000'}>
              Forward
            </Text>
            <Image
              alt="next"
              source={require('../assets/next.png')}
              width={20}
              height={20}
              opacity={0.5}
            />
          </HStack>
        </TouchableOpacity>
        <Divider orientation="vertical" />
        <TouchableOpacity
          onPress={() => {
            setShowModalInput(true);
          }}>
          <HStack space="sm">
            <Image
              alt="addbookmark"
              source={require('../assets/bookmark_add.png')}
              width={20}
              height={20}
              opacity={0.5}
            />
            <Text size="xs" color={'#000000'}>
              Bookmark
            </Text>
          </HStack>
        </TouchableOpacity>
      </HStack>

      <WebView
        setSupportMultipleWindows={false}
        style={{bottom: 10}}
        ref={webViewRef}
        source={{uri: currentUrl}}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        onAddNewTab={handleNewTab}
        onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
        onNavigationStateChange={navState => {
          setCanGoBack(navState.canGoBack);
          setCanGoForward(navState.canGoForward);
          setCurrentUrl(navState.url);
          setIsLoading(navState.loading);
        }}
      />
    </>
  );
};

export default BrowserContent;
