import { View, Text } from 'react-native'
import React from 'react'
import styles from '../styles'

type Props = {
    left?: JSX.Element,
    title?: string,
    right?: JSX.Element,
}

const Topbar = (props: Props) => {
  return (
    <View style={styles.topbar}>
        {props.left}
        <Text>{props.title}</Text>
        {props.right}
    </View>
  )
}

export default Topbar