# 카두(Cardo)
> 🔗 [웹버전](http://yoovin.iptime.org/cardo/) 에서 웹페이지로 경험해보실 수 있습니다.
> 
> ✏️ https://github.com/chadingTV/dribbble-todo의 디자인을 차용하여 만든 카드 형식으로 할일을 관리하는 투두 앱 입니다.

## 📱 🖥️ 실행방법
### 공통
- (각 폴더별로) npm install
### Backend
- Mongodb가 설치되어 있어야 합니다.
- cd backend
- ts-node index.ts
### Web
- cd web
- npm start or npm build
### ios
- cd ios && pod install && cd ..
- npm run ios
### android
- npm run android

## 🛠️ 사용기술 및 라이브러리
- **Frontend**
    - **Framework**: React Native (0.71.4)
    - **Library**: React (18.2.0)
    - **Network**: Axios, React-query
    - **State management**: AsyncStorage, Recoil
    - **Login**: kakao-login, apple-authentication
    - **Other**: jwt-decode, Animated
   
- **Backend**
    - **Framework**: Express
    - **Database**: Mongodb, Mongoose
    - **Deployment**: Docker
    - **Logging**: Winston
