import React from 'react';
import AppNavigator from './AppNavigator';
import { Provider } from "react-redux";
import store from './src/redux/store';
import { ModalPortal } from 'react-native-modals';
import { UserContext } from './UseContext';

export default function App() {

  return (
    <Provider store={store}>
      <UserContext>
        <AppNavigator />
        <ModalPortal />
      </UserContext>
    </Provider>
  );
}


