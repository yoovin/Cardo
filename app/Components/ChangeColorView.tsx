import { View, Text, Animated, TouchableOpacity, Dimensions, TouchableWithoutFeedback, FlatList } from 'react-native'
import React, { useEffect } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import styles from '../styles'
import LinearGradient from 'react-native-linear-gradient'

const { width, height } = Dimensions.get('window')

import colors from './colors'
import axios from 'axios'

type Props = {
    changeColorViewBottom: any
    changeColorViewAnimateOut: Function
    card_id: string
    color: Array<string>
}

const ChangeColorView = (props: Props) => {
    const queryClient = useQueryClient()

    const renderItem = ({item}: any) => (
        <TouchableOpacity
        onPress={() => changeColor(item)}
        style={[styles.colorCover, {margin: '3%'}, item[0] === props.color[0] &&  {borderWidth: 32, borderColor: 'black'}]}>
            <LinearGradient colors={item} style={[styles.colorCover]}>
                {item[0] === props.color[0] && <Text style={[styles.textXs, {color: 'black'}]}>선택됨</Text>}
            </LinearGradient>
        </TouchableOpacity>
    )

    const { mutate, isLoading } = useMutation(
        (option: any) => axios.patch('/todo/change/color', option),
            {
                onSuccess: () => {
                    // 데이터 업데이트 성공 시 캐시를 갱신합니다.
                    // props.changeColorViewAnimateOut()
                    queryClient.invalidateQueries("todos")
                },
            }
        )

    const changeColor = (color: Array<string>) => {
        console.log(color)
        mutate({id: props.card_id, color})
    }

    useEffect(() => {
        console.log("colorview 생김")
    }, [])

    return (
        <Animated.View style={[styles.fullScreen ,{bottom: props.changeColorViewBottom, zIndex: 101}]}>
            <View style={[styles.changeView, {top: '7%', backgroundColor: 'white'}]}>
                <View style={{flexDirection: 'row', padding: '5%', justifyContent: 'space-between', }}>
                        <Text style={styles.cancelText}>      </Text>
                        <Text style={styles.fontBold}>색상변경</Text>
                    <TouchableOpacity
                        onPress={() => {
                            props.changeColorViewAnimateOut()
                        }}>
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