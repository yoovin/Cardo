
import React, { useEffect, useState } from 'react';
import type {PropsWithChildren} from 'react';
import {View} from 'react-native'
import { RecoilRoot, useRecoilState } from 'recoil'
import { isSigned, currentUserid, currentUsername, currentUserImageUri } from './recoil/atom';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Home from './Home'
import Login from './Login';

type Props = {}

const Main = (props: Props) => {
    const [signed, setSigned] = useRecoilState(isSigned)

    useEffect(() => {
        AsyncStorage.getItem('login')
        .then(value => setSigned(Boolean(value)))
        // AsyncStorage.getItem('')
        // .then(value => setSigned(Boolean(value)))
        
    }, [])

  return (
    <>
        {signed ? <Home/> : <Login/>}
    </>
  )
}

export default Main