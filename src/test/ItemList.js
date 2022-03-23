import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Animated, { runOnJS, runOnUI, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import AnswerBox from './AnswerBox';
import DraggableItem from './DraggableItem';
import { width, calculateTopOffset, calculateBuffer, MARGIN_TOP, DROPBOX_HEIGHT } from './Utils';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    box: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignContent: 'space-between',
    }
})

const ItemList = ({children, answers}) => {

    const [isReady, setReady] = useState(false)
    const [calculating, setCalculating] = useState(true)

    const offsets = children.map((child) => ({
        group: useSharedValue(-1),
        order: useSharedValue(0),
        width: useSharedValue(0),
        height: useSharedValue(0),
        x: useSharedValue(0),
        y: useSharedValue(0),
        originalX: useSharedValue(0),
        originalY: useSharedValue(0),
        initialX: useSharedValue(0),
        initialY: useSharedValue(0),
    }))

    const borders = answers.map(() => (
        [useSharedValue(0), useSharedValue(0)]
    ))

    if(!isReady) {
        return (
            <View>
                {
                    answers.map((answer, index) => {
                        return(
                            <View
                                key={index}
                                onLayout={({
                                    nativeEvent: {
                                        layout
                                    }
                                }) => {
                                    const border = borders[index]
                                    border[0].value = (layout.y + layout.height) - (MARGIN_TOP + DROPBOX_HEIGHT)
                                    border[1].value = (layout.y + layout.height) - MARGIN_TOP
                                    runOnUI(() => {
                                        "worklet";
                                        if(borders.length - 1 == index){
                                            runOnJS(setCalculating)(false)
                                        }
                                    })();
                            }}
                            >
                                <Text style={{fontSize: 20, fontWeight: '500'}}>{answer}</Text>
                                <AnswerBox offsets={offsets} index={index} borders={borders}/>                            
                            </View>
                        )
                    })
                }
                {
                    calculating 
                    ?
                    null
                    :
                    <View style={styles.box}>
                        {children.map((child, index) => {
                        return(
                            <View 
                                key={index}
                                onLayout={({
                                    nativeEvent: {
                                    layout: { x, y, width, height },
                                    },
                                }) => {
                                    const offset = offsets[index]
                                    offset.order.value = -1;
                                    offset.width.value = width;
                                    offset.height.value = height;
                                    offset.originalX.value = x;
                                    offset.originalY.value = y + calculateTopOffset(borders);
                                    offset.initialX.value = x;
                                    offset.initialY.value = y + calculateTopOffset(borders);
                                    runOnUI(() => {
                                        "worklet";
                                        if (
                                            offsets.filter((o) => o.order.value !== -1).length === 0
                                        ) {
                                            runOnJS(setReady)(true)
                                        }
                                    })();
                                }}
                            >
                                {child}
                            </View>
                        )
                    })
                }
                </View>
                }
            </View>
        )
    }

    console.log("Initital offsets : " , offsets)
    console.log("Borders : " , borders)

    return(
        <View style={styles.container}>
            {
                answers.map((answer, index) => {
                    return(
                        <View
                            key={index}
                        >
                            <Text style={{fontSize: 20, fontWeight: '500'}}>{answer}</Text>
                            <AnswerBox offsets={offsets} index={index} borders={borders}/>                         
                        </View>
                    )
                })
            }
            {
                children.map((child, index) => 
                    <DraggableItem
                        index={index}
                        key={index}
                        offsets={offsets}
                        numberOfAnswers={answers.length}
                        borders={borders}
                        scrollY={child.props.scrollY}
                    >
                        {child}
                    </DraggableItem>
                )
            }
            <View
                style={{
                    marginTop: calculateBuffer(offsets),
                    width: width,
                }}
            />
        </View>
    )
}

export default ItemList;
