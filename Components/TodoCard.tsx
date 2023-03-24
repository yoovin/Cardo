import { View, Text, Dimensions, Animated, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import styles from '../styles';
import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'
import {RFPercentage} from "react-native-responsive-fontsize"
import SimpleGradientProgressbarView from "react-native-simple-gradient-progressbar-view"

const { width, height } = Dimensions.get('window');

type Props = {
    cardWidth: any,
    cardMargin: any,
    todoListOpacity: any,
    todoListHeight: any,
    eventHandler: any,
    onFullscreen: boolean,
    setOnFullscreen: Function,
}

const TodoCard = (props: Props) => {
    
                        

    return(
            <Animated.View style={[styles.todoCard,{
                    width: props.cardWidth,
                    marginHorizontal: props.cardMargin,
                    borderRadius: width * 0.03,}]}
                    {...props.eventHandler}>
                <SafeAreaView style={{flex: 1}}>
                    <View style={[{flex:1, padding:'10%', justifyContent: 'space-between', borderRadius: width * 0.03}, props.onFullscreen && {paddingTop:'15%'}]}>
                        <View style={styles.iconCover}>
                            <Ionicons name="person" size={RFPercentage(3.5)} color='#9a9a9a'></Ionicons>
                        </View>
                        <View style={{marginVertical: '5%'}}>
                            <Text style={[styles.textBase, {marginBottom: 10}]}>9 Tasks</Text>
                            <Text style={[styles.text2xl, {marginBottom: 10}]}>Personal</Text>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <SimpleGradientProgressbarView
                                style={{width: width * 0.6, height:height * 0.005, backgroundColor: '#D9D9D9'}}
                                fromColor='#f69744'
                                toColor='#e9445d'
                                progress={0.5}
                                maskedCorners={[1, 1, 0, 0]}
                                cornerRadius={0} 
                                />
                                <Text style={[styles.progressText, styles.textSm]}>50%</Text>
                            </View>
                        </View>
                        <Animated.View style={{height: props.todoListHeight, backgroundColor: 'pink', opacity: props.todoListOpacity}}>
                            <ScrollView>

                            </ScrollView>
                        </Animated.View>
                        
                    </View>

                </SafeAreaView>
            </Animated.View>
    )
}

export default TodoCard