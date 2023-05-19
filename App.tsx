/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import { RecoilRoot } from 'recoil'


import Main from './Components/Main'

function App(): JSX.Element {
    return (
        <RecoilRoot>
            <Main/>
        </RecoilRoot>
    );
}


export default App;
