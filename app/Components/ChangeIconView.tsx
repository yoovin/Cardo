import { View, Text, Animated, TouchableOpacity, ScrollView, TouchableWithoutFeedback, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import styles from '../styles'
import Ionicons from 'react-native-vector-icons/Ionicons'
import {RFPercentage} from "react-native-responsive-fontsize"
import { useMutation, useQueryClient } from 'react-query'
import Icons from './icons'
import axios from 'axios'

type Props = {
    changeIconViewBottom: any,
    changeIconViewAnimateOut: Function,
    color: Array<string>
    card_id: string
    currentIcon: string
}

const ChangeIconView = (props: Props) => {
    // const [currentIcon, setCurrentIcon] = useState('')
    const queryClient = useQueryClient()

    const renderItem = ({item}: any) => (
        <TouchableOpacity
        style={[styles.iconCover, {margin: '3%'}, item === props.currentIcon && {borderWidth: 3, borderColor: props.color[0]}, ]}
        onPress={() => changeIcon(item)}>
            <Ionicons name={item} size={RFPercentage(3.5)} color={props.color[0]}></Ionicons>
            {/* 현재 선택 된 아이콘 체크해주기 */}
            {item === props.currentIcon && <Text style={[styles.textXs, {color: props.color[0]}]}>선택됨</Text>}
        </TouchableOpacity>
    )

    const { mutate, isLoading } = useMutation(
        (option: any) => axios.patch('/todo/change/icon', option),
            {
                onSuccess: () => {
                    // 데이터 업데이트 성공 시 캐시를 갱신합니다.
                    queryClient.invalidateQueries("todos")
                },
            }
        )

    const changeIcon = (icon: string) => {
        console.log(icon)
        mutate({id: props.card_id, icon})
    }

    useEffect(() => {
        console.log("iconview 생김")
        console.log(props.currentIcon)
    }, [])

  return (
    <Animated.View style={[styles.fullScreen ,{bottom: props.changeIconViewBottom, zIndex: 101}]}>
        <View style={[styles.changeView, {top: '7%', backgroundColor: 'white'}]}>
            <View style={{flexDirection: 'row', padding: '5%', justifyContent: 'space-between', }}>
                    <Text>      </Text>
                    <Text style={styles.fontBold}>아이콘변경</Text>
                <TouchableOpacity
                onPress={() => {
                    props.changeIconViewAnimateOut()
                }}>
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