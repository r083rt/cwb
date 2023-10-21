import {GluestackUIProvider} from '@gluestack-ui/themed';
import {LogBox, SafeAreaView} from 'react-native';
import {config} from './gluestack-ui.config.ts';
import Navigator from './routes';
import NetInfo from '@react-native-community/netinfo';
import React, {useEffect} from 'react';
export default function App({children}) {
  LogBox.ignoreAllLogs();
  useEffect(() => {
    const handleConnectivityChange = state => {
      console.log('Connection type: ', state.type);
      console.log('Is connected? ', state.isConnected);
    };
    const unsubscribe = NetInfo.addEventListener(handleConnectivityChange);
    return () => {
      unsubscribe();
    };
  }, []);
  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}>
      <GluestackUIProvider config={config}>
        <Navigator />
      </GluestackUIProvider>
    </SafeAreaView>
  );
}
