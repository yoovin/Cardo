import React from 'react'
import { RecoilRoot } from 'recoil'
import { QueryClientProvider, QueryClient } from 'react-query'
import { SERVER_ADDRESS } from '@env'
import axios from 'axios'

import Main from './Components/Main'

const queryClient = new QueryClient()
axios.defaults.baseURL = SERVER_ADDRESS

function App(): JSX.Element {
    return (
        <QueryClientProvider client={queryClient}>
            <RecoilRoot>
                <Main/>
            </RecoilRoot>
        </QueryClientProvider>
    )
}


export default App;
