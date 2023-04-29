import React from 'react'
import { RecoilRoot } from 'recoil'
import { QueryClientProvider, QueryClient } from 'react-query'
import { SERVER_ADDRESS } from '@env'
import axios from 'axios'
import CodePush from 'react-native-code-push'

import Main from './Components/Main'

const queryClient = new QueryClient()
axios.defaults.baseURL = SERVER_ADDRESS

function App(): JSX.Element {
    console.log(SERVER_ADDRESS)
    return (
        <QueryClientProvider client={queryClient}>
            <RecoilRoot>
                <Main/>
            </RecoilRoot>
        </QueryClientProvider>
    )
}

const codePushOptions = {
    checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME,
    installMode: CodePush.InstallMode.IMMEDIATE 
}

export default CodePush(codePushOptions)(App)