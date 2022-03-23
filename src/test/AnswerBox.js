import React, {useEffect, useState, useCallback} from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useDerivedValue, useSharedValue, withSpring } from 'react-native-reanimated';
import { calculateHeight, DROPBOX_HEIGHT, MARGIN_TOP } from './Utils';

const AnswerBox = ({offsets=[], index, borders}) => {

    const height = useDerivedValue(() => calculateHeight(offsets, index, borders))

    const animatedStyle = useAnimatedStyle(() => {
        return{
            height: withSpring(height.value),
        }
    }, [])

    return(
        <Animated.View style={[animatedStyle, styles.container]}>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginBottom: MARGIN_TOP,
        borderWidth: 1,
        borderColor: '#b885ff',
        borderRadius: 12,
    }
})

export default AnswerBox;
