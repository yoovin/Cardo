/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import type {PropsWithChildren} from 'react';
import {View} from 'react-native';

import Main from './Components/Main'
import Login from './Components/Login';

function App(): JSX.Element {
    return (
        // <View>
        <>
            <Login/>
            <Main/>
        </>
        // </View>
    );
}


export default App;
