import React from 'react';
import {WebView} from 'react-native-webview';

const BrowserView = ({currentUrl, onShouldStartLoadWithRequest}) => {
  console.log(currentUrl);
  return (
    <WebView
      source={{uri: currentUrl}}
      onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
    />
  );
};

export default BrowserView;
