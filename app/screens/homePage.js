import React, {useState, useEffect, useRef, useCallback} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {
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
import {Dimensions, BackHandler, TouchableOpacity, Alert} from 'react-native';
import {WebView} from 'react-native-webview';
import MaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import {BookmarkComponent, InputComponent, SearchView} from '../components';
import firestore from '@react-native-firebase/firestore';
import realm from '../models';
import uuid from 'react-native-uuid';
import * as Progress from 'react-native-progress';
// import LottieView from 'lottie-react-native';
import moment from 'moment';
export default function HomePage({navigation, route}) {
  const [nextLink, setNextLink] = useState(null);
  const [webTitle, setWebTitle] = useState('');
  const [isFirstPage, setIsFirstPage] = useState(false);
  const size = Dimensions.get('window');
  const [dataApi, setDataApi] = useState(null);
  const [searchEngine, setSearchEngine] = useState('google');
  const [bookmarkName, setBookmarkName] = useState('');
  const [query, setQuery] = useState('');
  const [keyword, setKeyword] = useState('');
  const [b, setB] = useState(1);
  const [start, setStart] = useState(0);
  const [prevUrl, setPrevUrl] = useState('');
  const [isValidURL, setIsValidURL] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const [dataBookmark, setDataBookmark] = useState([]);
  const webViewRef = React.useRef(null);
  const [searchMode, setSearchMode] = useState(false);
  const [searchData, setSearchData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [contents, setContents] = useState([]);
  const [title, setTitle] = useState('');
  const [showModalBookmark, setShowModalBookmark] = useState(false);
  const [showModalInput, setShowModalInput] = useState(false);
  const [showSetting, setShowSetting] = useState(false);
  const bookmarkRef = useRef(null);

  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');
  const apiKey =
    '7b86c901fb584ce52676a3182d64be676c16a4a53920d467b2d83b0b10e1e83e';
  const getContents = async () => {
    const contentsCollection = firestore().collection('contents');

    contentsCollection.get().then(querySnapshot => {
      const contentData = [];
      querySnapshot.forEach(doc => {
        const {title, subtitle, description, content_type, image, url} =
          doc.data();

        contentData.push({
          title,
          subtitle,
          description,
          content_type,
          image,
          url,
        });
      });

      setContents(contentData);
    });
  };

  const onAndroidBackPress = () => {
    // return false;
    stopLoadingWebView();

    if (canGoBack) {
      webViewRef.current.goBack();
    } else {
      if (searchMode === true && currentUrl === '') {
        setSearchData([]);
      } else {
        setCurrentUrl('');
      }
    }
    return true;
  };

  const onAndroidForwardPress = () => {
    // return false;
    stopLoadingWebView();

    if (webViewRef.current) {
      webViewRef.current.goForward();
    }
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', onAndroidBackPress);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onAndroidBackPress);
    };
  }, [canGoBack, currentUrl, canGoForward, searchData]);

  useEffect(() => {
    async function getSearchEngine() {
      const settingsRef = firestore().collection('settings').doc('1');
      settingsRef
        .get()
        .then(documentSnapshot => {
          if (documentSnapshot.exists) {
            const searchData = documentSnapshot.data().search_engine;
            console.log('Search Engine:', searchData);
            setSearchEngine(searchData);
          } else {
            console.log('No such document!');
          }
        })
        .catch(error => {
          console.error('Error getting document:', error);
        });
    }
    getSearchEngine();
  }, []);

  useFocusEffect(
    useCallback(() => {
      async function getSearchEngine() {
        const settingsRef = firestore().collection('settings').doc('1');
        settingsRef
          .get()
          .then(documentSnapshot => {
            if (documentSnapshot.exists) {
              const searchData = documentSnapshot.data().search_engine;
              console.log('Search Engine:', searchData);
              setSearchEngine(searchData);
            } else {
              console.log('No such document!');
            }
          })
          .catch(error => {
            console.error('Error getting document:', error);
          });
      }
      getSearchEngine();
    }, []),
  );

  const onShouldStartLoadWithRequest = event => {
    const {url} = event;

    if (url !== currentUrl) {
      const id = uuid.v4();

      axios
        .get(url)
        .then(response => {
          const pageTitle = /<title>(.*?)<\/title>/.exec(response.data);
          setWebTitle(pageTitle ? pageTitle[1] : url);
          realm.write(() => {
            realm.create('HistorySchema', {
              id: id,
              name: pageTitle ? pageTitle[1] : url, // Use the title or URL if title not found
              url: url,
              date: moment().format('YYYY-MM-DD HH:mm:ss'),
            });
          });

          setCurrentUrl(url);
        })
        .catch(error => {
          console.error('Error fetching web page title:', error);
        });

      return true; // Allow the navigation
    }

    return true; // Allow the initial URL to load
  };

  const handleNextPage = async () => {
    console.log('getting next page');

    const p = query;
    const vc = 'id';
    const vm = 'p';
    const device = 'mobile';

    console.log(searchEngine);
    let params;

    if (searchEngine === 'yahoo') {
      params = {
        api_key: apiKey,
        engine: searchEngine,
        b: b,
        p: query,
        vc: 'id',
        vm: 'p',
        device: 'mobile',
      };
    } else if (searchEngine === 'google') {
      params = {
        api_key: apiKey,
        engine: searchEngine,
        start: start,
        q: query,
        hl: 'id',
        gl: 'id',
        device: 'mobile',
        safe: 'off',
        location_requested: 'Indonesia',
        location_used: 'Indonesia',
      };
    }

    setIsLoading(true);
    axios
      .get('https://serpapi.com/search', {
        params: params,
      })
      .then(response => {
        const queryResults = response.data.organic_results;
        setDataApi(response.data.search_metadata.total_time_taken);
        setNextLink(response.data.serpapi_pagination.next_link);
        if (response.data.serpapi_pagination.next_link != '') {
          if (searchEngine === 'yahoo') {
            const next = b + 10;
            setB(parseInt(next));
          } else if (searchEngine === 'google') {
            const next = start + 10;
            setStart(parseInt(next));
          }
        }
        const dataQuery = queryResults.map(item => {
          return {
            title: item.title,
            description: item.snippet,
            url: item.link,
            image: item.thumbnail ? item.thumbnail : '',
            breadcrumb: item.displayed_link,
          };
        });
        setSearchData(prevData => [...prevData, ...dataQuery]);
        setIsLoading(false);
      })
      .catch(error => {
        setIsLoading(false);
        console.error('An error occurred:', error);
      });
  };

  const handleSearch = async () => {
    if (query == '') {
      return;
    }

    setIsLoading(true);
    setSearchMode(true);
    setKeyword(query);
    const contentsCollection = firestore().collection('contents');
    contentsCollection.get().then(async querySnapshot => {
      const contentData = [];
      querySnapshot.forEach(doc => {
        const {title, subtitle, description, content_type, image, url} =
          doc.data();

        contentData.push({
          title,
          subtitle,
          description,
          content_type,
          image,
          url,
        });
      });

      try {
        console.log(searchEngine);
        let params;

        if (searchEngine === 'yahoo') {
          params = {
            api_key: apiKey,
            engine: searchEngine,
            b: b,
            p: query,
            vc: 'id',
            vm: 'p',
            device: 'mobile',
          };
        } else if (searchEngine === 'google') {
          params = {
            api_key: apiKey,
            engine: searchEngine,
            start: 1,
            q: query,
            hl: 'id',
            gl: 'id',
            device: 'mobile',
            safe: 'off',
            location_requested: 'Indonesia',
            location_used: 'Indonesia',
          };
        }

        axios
          .get('https://serpapi.com/search', {
            params: params,
          })
          .then(response => {
            console.log(response.data.organic_results);
            const c = contentData.map(item => {
              return {
                title: item.title,
                description: item.description,
                url: item.url,
                image: item.image,
                breadcrumb: item.url,
              };
            });

            const queryResults = response.data.organic_results;
            setDataApi(response.data.search_metadata.total_time_taken);
            setNextLink(response.data.serpapi_pagination.next_link);
            if (response.data.serpapi_pagination.next_link != '') {
              if (searchEngine === 'yahoo') {
                const nextB = 11;
                console.log('next B : ', nextB);
                setB(nextB);
              } else if (searchEngine === 'google') {
                const nextStart = 10;
                console.log('next Start : ', nextStart);
                setStart(10);
              }
            }
            const dataQuery = queryResults.map(item => {
              console.log(item.position + ' : ' + item.snippet);
              return {
                title: item.title,
                description: item.snippet,
                url: item.link,
                image: item.thumbnail ? item.thumbnail : '',
                breadcrumb: item.displayed_link,
              };
            });
            const combinedData = [...c, ...dataQuery];
            setSearchData(combinedData);
            setIsLoading(false);
          })
          .catch(error => {
            setIsLoading(false);
            console.error('An error occurred:', error);
          });
      } catch (error) {
        setIsLoading(false);
        console.error('An error occurred:', error);
      }
    });
  };

  const handleInputSubmit = () => {
    // setSearchData([]);
    if (query === '$admin$') {
      navigation.navigate('AdminLogin');
      return;
    }
    const urlPattern = /^(http?|https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;

    if (urlPattern.test(query)) {
      setIsValidURL(true);
      // setPrevUrl(currentUrl);
      setCurrentUrl(query);
    } else {
      const isValidDomain = /^(?![./])[a-zA-Z0-9./]*\.[a-z]+/.test(query);

      if (isValidDomain) {
        const urlWithHttp = 'https://www.' + query.toLowerCase();

        setIsValidURL(true);

        setCurrentUrl(urlWithHttp);
        const id = uuid.v4();
        axios
          .get(urlWithHttp)
          .then(response => {
            console.log;
            const pageTitle = /<title>(.*?)<\/title>/.exec(response.data);
            setWebTitle(pageTitle);
            realm.write(() => {
              realm.create('HistorySchema', {
                id: id,
                name: pageTitle ? pageTitle[1] : urlWithHttp, // Use the title or URL if title not found
                url: urlWithHttp,
                date: moment().format('YYYY-MM-DD HH:mm:ss'),
              });
            });
          })
          .catch(error => {
            console.error('Error fetching web page title:', error);
          });
      } else {
        setIsValidURL(false);
        handleSearch();
      }
    }
  };
  const stopLoadingWebView = () => {
    setIsLoading(false);
    if (webViewRef.current) {
      webViewRef.current.stopLoading();
    }
  };
  const handleSubmit = e => {
    setIsFirstPage(false);
    setShowModalBookmark(false);
    setCurrentUrl(e.url);
    const id = uuid.v4();
    axios
      .get(e.url)
      .then(response => {
        console.log(response.data);
        const pageTitle = /<title>(.*?)<\/title>/.exec(response.data);
        setWebTitle(pageTitle);
        realm.write(() => {
          realm.create('HistorySchema', {
            id: id,
            name: pageTitle ? pageTitle[1] : e.url, // Use the title or URL if title not found
            url: e.url,
            date: moment().format('YYYY-MM-DD HH:mm:ss'),
          });
        });
      })
      .catch(error => {
        console.error('Error fetching web page title:', error);
      });
  };

  const showBookmark = () => {
    setTitle('Bookmark');
    const bookmarks = realm.objects('BookmarkSchema').sorted('date', true);

    setDataBookmark(bookmarks);
    setShowModalBookmark(true);
  };

  const showHistory = () => {
    setTitle('History');
    const histories = realm.objects('HistorySchema').sorted('date', true);
    setDataBookmark(histories);
    setShowModalBookmark(true);
  };

  const handleClearBookmark = e => {
    Alert.alert('Konfirmasi', `Hapus semua ${title} ?`, [
      {
        text: 'Batal',
        onPress: () => {},
      },
      {
        text: 'Hapus',
        onPress: () => {
          if (title === 'Bookmark') {
            const bookmark = realm.objects('BookmarkSchema');
            realm.write(() => {
              bookmark.forEach(item => {
                realm.delete(item);
              });
            });
          } else {
            const history = realm.objects('HistorySchema');
            realm.write(() => {
              history.forEach(item => {
                realm.delete(item);
              });
            });
          }

          setShowModalBookmark(false);
        },
      },
    ]);
  };
  const handleDeleteBookmark = e => {
    Alert.alert('Konfirmasi', `Hapus ${title} ?`, [
      {
        text: 'Batal',
        onPress: () => {},
      },
      {
        text: 'Hapus',
        onPress: () => {
          if (title === 'Bookmark') {
            const bookmark = realm.objectForPrimaryKey('BookmarkSchema', e.id);
            realm.write(() => {
              realm.delete(bookmark);
            });

            const bookmarks = realm
              .objects('BookmarkSchema')
              .sorted('date', true);

            setDataBookmark(bookmarks);
          } else {
            const History = realm.objectForPrimaryKey('HistorySchema', e.id);
            realm.write(() => {
              realm.delete(History);
            });

            const histories = realm
              .objects('HistorySchema')
              .sorted('date', true);

            setDataBookmark(histories);
          }
        },
      },
    ]);
  };

  return (
    <Box flex={1} backgroundColor="$white">
      <Actionsheet
        isOpen={showModalBookmark}
        onClose={() => {
          setShowModalBookmark(false);
        }}
        zIndex={999}>
        <ActionsheetBackdrop />
        <ActionsheetContent maxHeight="50%" zIndex={999}>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          <HStack
            bold
            alignItems="center"
            justifyContent="space-between"
            w={'$full'}
            p={5}>
            <Text size="lg" bold>
              {title}
            </Text>
            {dataBookmark.length > 0 ? (
              <Button
                onPress={handleClearBookmark}
                variant="outline"
                size="xs"
                borderRadius={60}
                action="negative"
                p={3}>
                <ButtonText>Hapus Semua</ButtonText>
              </Button>
            ) : null}
          </HStack>
          <Divider my={10} />
          <BookmarkComponent
            data={dataBookmark}
            onSubmit={handleSubmit}
            onDelete={handleDeleteBookmark}
          />
        </ActionsheetContent>
      </Actionsheet>

      <Modal
        size="lg"
        isOpen={showModalInput}
        onClose={() => {
          setShowModalInput(false);
        }}
        finalFocusRef={bookmarkRef}>
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Heading size="lg">Bookmarks</Heading>
            <ModalCloseButton>
              <Icon as={CloseIcon} />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            <VStack space="md">
              <Text numberOfLines={2} size="2xs" mb={20}>
                {currentUrl}
              </Text>
              <Input>
                <InputField
                  onChangeText={text => setBookmarkName(text)}
                  placeholder="Masukkan nama bookmark">
                  {webTitle}
                </InputField>
              </Input>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="solid"
              size="sm"
              action="positive"
              mr="$3"
              onPress={() => {
                setShowModalInput(false);
                const id = uuid.v4();
                realm.write(() => {
                  realm.create('BookmarkSchema', {
                    id: id,
                    name: bookmarkName != '' ? bookmarkName : webTitle,
                    url: currentUrl,
                    date: moment().format('YYYY-MM-DD HH:mm:ss'),
                  });
                });
                setBookmarkName('');
                // Alert.alert('', 'Bookmark disimpan');
              }}>
              <ButtonText>Simpan</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <InputComponent
        onClear={() => {
          stopLoadingWebView();
          // setCurrentUrl('');
          // setSearchData([]);
        }}
        onViewHistory={showHistory}
        onViewBookmark={showBookmark}
        onHome={() => {
          setB('');
          stopLoadingWebView();
          setCurrentUrl('');
          setSearchData([]);
        }}
        setUrl={currentUrl}
        onSubmit={handleInputSubmit}
        onSetQuery={e => {
          setQuery(e);
        }}
      />
      {isLoading && (
        <Progress.Bar
          borderRadius={0}
          color="#5039A3"
          useNativeDriver
          indeterminate={true}
          height={1}
          width={size.width}
        />
      )}

      {/* Search View */}
      {searchData.length === 0 && currentUrl === '' ? (
        <Box>
          <Center>
            <Image
              source={require('../assets/logo.png')}
              style={{
                width: size.width * 0.3,
                height: size.width * 0.4,
                marginTop: 30,
              }}
              resizeMode="cover"
            />
            {/* <LottieView
              style={{
                width: 200,
                height: 190,
                // opacity: 0.9,
              }}
              source={require('../assets/search2.json')}
              autoPlay
              loop
            /> */}
          </Center>

          <Box w={'$full'} p={20}>
            <Input borderRadius={50}>
              <InputField
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
            {/* {searchData.length > 0 ? (
              <>
                <TouchableOpacity
                  onPress={() => {
                    setCurrentUrl('');
                    // console.log(searchData.length);
                  }}>
                  <HStack space="sm">
                    <MaterialCommunity name="backup-restore" size={20} />
                    <Text size="sm">Search result</Text>
                  </HStack>
                </TouchableOpacity>
                <Divider orientation="vertical" />
              </>
            ) : null} */}
            <TouchableOpacity onPress={onAndroidBackPress}>
              <HStack space="sm">
                {/* <MaterialCommunity
                  name="arrow-left"
                  size={20}
                  color={'#000000'}
                /> */}
                <Image
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
                  source={require('../assets/next.png')}
                  width={20}
                  height={20}
                  opacity={0.5}
                />
                {/* <MaterialCommunity
                  name="arrow-right"
                  size={20}
                  color={!canGoForward ? '#C9C9C9' : '#000000'}
                /> */}
              </HStack>
            </TouchableOpacity>
            <Divider orientation="vertical" />
            <TouchableOpacity
              onPress={() => {
                setShowModalInput(true);
              }}>
              <HStack space="sm">
                {/* <MaterialCommunity
                  name="bookmark-plus-outline"
                  size={20}
                  color={'#000000'}
                /> */}
                <Image
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
            onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
            onNavigationStateChange={navState => {
              setCanGoBack(navState.canGoBack);
              setCanGoForward(navState.canGoForward);
              setCurrentUrl(navState.url);
              setIsLoading(navState.loading);
            }}
          />
        </>
      )}
    </Box>
  );
}
