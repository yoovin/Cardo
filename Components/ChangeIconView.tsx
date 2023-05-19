import { View, Text, Animated, TouchableOpacity, ScrollView, TouchableWithoutFeedback, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import styles from '../styles'
import Ionicons from 'react-native-vector-icons/Ionicons'
import {RFPercentage} from "react-native-responsive-fontsize"
import Icons from './icons'

type Props = {
    changeIconViewBottom: any,
    changeIconViewAnimateOut: Function,
    color: Array<string>
}

const ChangeIconView = (props: Props) => {
    const [currentIcon, setCurrentIcon] = useState('')

    const renderItem = ({item}: any) => (
        <TouchableOpacity
        style={[styles.iconCover, {margin: '3%'}]}>
            <Ionicons name={item} size={RFPercentage(3.5)} color={props.color[0]}></Ionicons>
        </TouchableOpacity>
    )

    useEffect(() => {
        console.log("iconview 생김")
    }, [])

  return (
    <Animated.View style={[styles.fullScreen ,{bottom: props.changeIconViewBottom, zIndex: 101}]}>
        <View style={[styles.changeView, {top: '7%', backgroundColor: 'white'}]}>
            <View style={{flexDirection: 'row', padding: '5%', justifyContent: 'space-between', }}>
                <TouchableOpacity
                onPress={() => {
                    props.changeIconViewAnimateOut()
                }}>
                    <Text style={styles.cancelText}>취소</Text>
                </TouchableOpacity>
                    <Text style={styles.fontBold}>아이콘변경</Text>
                <TouchableOpacity>
                    <Text style={styles.confirmText}>완료</Text>
                </TouchableOpacity>
            </View>
            <FlatList
            data={Icons}
            renderItem={renderItem}
            keyExtractor={(item) => String(item)}
            numColumns={4}
            />

        </View>
            {/* 항목 밖을 클릭하면 올라가게끔 뷰 구현 */}
            <TouchableOpacity
            onPress={() => {
                props.changeIconViewAnimateOut()
            }}
            style={[styles.fullScreen, {bottom: '5%'}]}>
            </TouchableOpacity>
    </Animated.View>
  )
}

export default ChangeIconView