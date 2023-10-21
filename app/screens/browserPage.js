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
import {WebView} from 'react-native-webview';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import client from '../api';
import axios from 'axios';
import {ContentsView, SearchView} from '../components';
import firestore from '@react-native-firebase/firestore';

import LottieView from 'lottie-react-native';
export default function BrowserPage({navigation}) {
  const size = Dimensions.get('window');
  const [query, setQuery] = useState('');
  const [currentUrl, setCurrentUrl] = useState('https://www.detik.com');
  const [prevUrl, setPrevUrl] = useState('');
  const [isValidURL, setIsValidURL] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [canGoBack, setCanGoBack] = useState(false);
  const webViewRef = React.useRef(null);
  const [searchMode, setSearchMode] = useState(false);
  const [searchData, setSearchData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [contents, setContents] = useState([]);

  const handleBackPress = () => {
    if (webViewRef && webViewRef.current) {
      if (webViewRef.current.canGoBack) {
        // Check if WebView can go back
        webViewRef.current.goBack();
        return true; // Prevent the default behavior (exit the app)
      }
    }
    return false; // Allow the default behavior (exit the app)
  };

  const getContents = async () => {
    const contentsCollection = firestore().collection('contents');
    console.log(contentsCollection);
    contentsCollection.get().then(querySnapshot => {
      const contentData = [];
      querySnapshot.forEach(doc => {
        const {title, subtitle, description, link, content_type, image} =
          doc.data();
        contentData.push({
          title,
          subtitle,
          description,
          link,
          content_type,
          image,
        });
      });

      setContents(contentData);
      console.log(contents);
    });
  };

  useEffect(() => {
    const backAction = () => {
      try {
        webViewRef.current?.goBack();
      } catch (err) {
        console.log('[handleBackButtonPress] Error : ', err.message);
      }
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    const swipeBackHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    navigation.addListener('beforeRemove', e => {
      e.preventDefault();
      //clear setInterval here and go back
    });
    return () => {
      backHandler.remove();
      swipeBackHandler.remove();
    };
  }, []);

  onShouldStartLoadWithRequest = event => {
    const {url} = event;

    if (url !== currentUrl) {
      setCurrentUrl(url);
      return true; // Allow the navigation
    }

    return true; // Allow the initial URL to load
  };

  const searchKeyword = async () => {
    const data = [
      {
        keyword: query,
        location_code: 2360,
        language_code: 'id',
        device: 'mobile',
        os: 'android',
        depth: 100,
      },
    ];

    try {
      setIsLoading(true);
      const response = await axios.post(
        'https://api.dataforseo.com/v3/serp/google/organic/live/regular',
        data,
        {
          headers: {
            Authorization:
              'Basic cnNqYW1zdWFyQGdtYWlsLmNvbTpmZjg3NGNlMWQ3NjAyNWNm',
            'Content-Type': 'application/json',
          },
        },
      );

      console.log(contents);
      const c = contents.map(item => {
        return {
          title: item.title,
          description: item.title,
          url: item.url,
        };
      });

      setSearchData(response.data.tasks[0].result[0].items);
      setSe;
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleInputSubmit = () => {
    setSearchData([]);
    const urlPattern = /^(http?|https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;

    if (urlPattern.test(query)) {
      setSearchMode(false);
      setIsValidURL(true);
      setPrevUrl(currentUrl);
      setCurrentUrl(query);
    } else {
      console.log('Search web triggered ');
      getContents();
      setSearchMode(true);
      setIsValidURL(false);
      searchKeyword();
    }
  };

  const handleSubmit = e => {
    setSearchData([]);
    setCurrentUrl(e.url);
    console.log(e.url);
  };

  return (
    <Box flex={1}>
      <Box w={size.width}>
        <HStack
          space="md"
          m={10}
          justifyContent="flex-start"
          alignItems="center">
          <TouchableOpacity onPress={handleInputSubmit}>
            <MaterialCommunity name="home-variant-outline" size={30} />
          </TouchableOpacity>
          <Input
            borderRadius={30}
            padding={2}
            width={size.width * 0.65}
            height={40}
            backgroundColor="$secondary200"
            variant="outline"
            size="md"
            isDisabled={false}
            isInvalid={false}
            isReadOnly={false}>
            <InputField
              fontSize={10}
              placeholder="Masukkan alamat website"
              onSubmitEditing={handleInputSubmit}
              onChangeText={text => setQuery(text)}
            />
          </Input>

          <TouchableOpacity onPress={handleInputSubmit}>
            <MaterialCommunity name="bookmark-plus-outline" size={25} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleInputSubmit}>
            <MaterialCommunity name="history" size={25} />
          </TouchableOpacity>
        </HStack>
        <Divider bgColor="$secondary500" height={0.5} />
      </Box>
      {isLoading === true ? <Spinner size={'small'} /> : null}
      {searchData.length > 0 ? (
        <>
          <ContentsView data={contents} onSubmit={handleSubmit} />
          <SearchView data={searchData} onSubmit={handleSubmit} />
        </>
      ) : (
        <>
          <Center>
            <LottieView
              source={require('../assets/search2.json')}
              autoPlay
              loop
            />
          </Center>

          <Box w={'$full'} p={20}>
            <Input borderRadius={50}>
              <InputField
                onChangeText={text => setQuery(text)}
                fontSize={11}
                onSubmitEditing={handleInputSubmit}
                placeholder="Masukkan kata kunci pencarian"
                backgroundColor="#EDEDED"></InputField>
              <InputSlot pr="$3" onPress={() => {}}>
                <InputIcon as={SearchIcon} color="$darkBlue500" />
              </InputSlot>
            </Input>
          </Box>
        </>

        // <WebView
        //   ref={webViewRef}
        //   source={{uri: currentUrl}}
        //   onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
        // />
      )}
    </Box>
  );
}
