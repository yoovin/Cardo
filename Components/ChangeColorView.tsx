import { View, Text, Animated, TouchableOpacity, Dimensions, TouchableWithoutFeedback, FlatList } from 'react-native'
import React, { useEffect } from 'react'
import styles from '../styles'
import LinearGradient from 'react-native-linear-gradient'

const { width, height } = Dimensions.get('window')

import colors from './colors'

type Props = {
    changeColorViewBottom: any,
    changeColorViewAnimateOut: Function
}

const ChangeColorView = (props: Props) => {


    const renderItem = ({item}: any) => (
        <TouchableOpacity
        style={[styles.colorCover, {margin: '3%'}]}>
            <LinearGradient colors={item} style={[styles.colorCover]}></LinearGradient>
        </TouchableOpacity>
    )

    useEffect(() => {
        console.log("colorview 생김")
    }, [])

    return (
        <Animated.View style={[styles.fullScreen ,{bottom: props.changeColorViewBottom, zIndex: 101}]}>
            <View style={[styles.changeView, {top: '7%', backgroundColor: 'white'}]}>
                <View style={{flexDirection: 'row', padding: '5%', justifyContent: 'space-between', }}>
                    <TouchableOpacity
                    onPress={() => {
                        props.changeColorViewAnimateOut()
                    }}>
                        <Text style={styles.cancelText}>취소</Text>
                    </TouchableOpacity>
                        <Text style={styles.fontBold}>색상변경</Text>
                    <TouchableOpacity>
                        <Text style={styles.confirmText}>완료</Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                data={colors}
                renderItem={renderItem}
                keyExtractor={(item) => String(item)}
                numColumns={4}
                />

            </View>
                {/* 항목 밖을 클릭하면 올라가게끔 뷰 구현 */}
                <TouchableOpacity
                onPress={() => {
                    props.changeColorViewAnimateOut()
                }}
                style={[styles.fullScreen, {bottom: '5%'}]}>
                </TouchableOpacity>
        </Animated.View>
    )
}

export default ChangeColorView