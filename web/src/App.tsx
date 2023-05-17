import React from 'react'
import { RecoilRoot } from 'recoil'
import { QueryClientProvider, QueryClient } from 'react-query'
import axios from 'axios'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import './App.css'
import Home from './components/Home'
import Login from './components/Login/Login'
import KakaoRedirect from './components/Login/KakaoRedirect';
import Main from './components/Main';

const queryClient = new QueryClient()

axios.defaults.baseURL = process.env.REACT_APP_SERVER_ADDRESS

function App() {
    return (
        <BrowserRouter basename={process.env.PUBLIC_URL}>
            <QueryClientProvider client={queryClient}>
                <RecoilRoot>
                    <div className="App">
                        <Routes>
                            <Route path="/" Component={Main}/>
                            <Route path="/kakao/callback*" Component={KakaoRedirect}/>
                        </Routes>
                    </div>
                </RecoilRoot>
            </QueryClientProvider>
        </BrowserRouter>
    )
}

export default App
