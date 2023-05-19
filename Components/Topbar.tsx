import { View, Text } from 'react-native'
import React from 'react'
import styles from '../styles'

import { useRecoilValue } from 'recoil'
import { titleText } from './recoil/atom'

type Props = {
    left?: JSX.Element,
    right?: JSX.Element,
    title?: string
}

const Topbar = (props: Props) => {
    const title = useRecoilValue(titleText)

  return (
    <View style={styles.topbar}>
        {props.left}
        <Text style={[styles.fontBold, styles.textBase]}>{props.title ? props.title : title}</Text>
        {props.right ? props.right :
        <View style={{width: '7%'}}></View>
        }
    </View>
  )
}

export default Topbar