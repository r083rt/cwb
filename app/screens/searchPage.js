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
import client from '../api';
import axios from 'axios';
import {ContentsView, InputComponent, SearchView} from '../components';
import firestore from '@react-native-firebase/firestore';

export default function SearchPage({navigation}) {
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
        const {title, subtitle, description, link, content_type} = doc.data();
        contentData.push({title, subtitle, description, link, content_type});
      });

      setContents(contentData);
      console.log(contents);
    });
  };

  useEffect(() => {
    // const backAction = () => {
    //   console.log('backpress');
    // };
    // const backHandler = BackHandler.addEventListener(
    //   'hardwareBackPress',
    //   backAction,
    // );
    // return () => {
    //   backHandler.remove();
    // };
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
    setCurrentUrl(e.link);
    console.log(e.link);
  };

  return (
    <Box flex={1}>
      <InputComponent
        onSubmit={handleInputSubmit}
        onSetQuery={e => {
          setQuery(e);
        }}
      />

      {isLoading === true ? (
        <Center flex={1}>
          <Spinner />
        </Center>
      ) : (
        <SearchView data={searchData} />
      )}
    </Box>
  );
}
