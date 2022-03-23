import React from 'react';
import { PanGestureHandler } from 'react-native-gesture-handler';
import {useWindowDimensions} from 'react-native'
import Animated, { useAnimatedGestureHandler, useAnimatedStyle, useDerivedValue, useSharedValue, withSpring, cancelAnimation, withTiming } from 'react-native-reanimated';
import { calculateLayout, DROPBOX_HEIGHT, getLastOrder, MARGIN_TOP, getExtraHeight, moveUnselectedDown, isInGroup, setGroup, belongsTo, remove, reorder, addOffset, removeOffset } from './Utils';


const DraggableItem = ({offsets, index, children, extraHeight, numberOfAnswers, borders, scrollY}) => {

    const offset = offsets[index]

    const isGestureActive = useSharedValue(false)
    const isSelected = useDerivedValue(() => offset.order.value !== -1)
    const x = useSharedValue(0)
    const y = useSharedValue(0)

    const dimensions = useWindowDimensions()

    const eventHandler = useAnimatedGestureHandler({
        onStart: (event, ctx) => {
            if(!isSelected.value){
                x.value = offset.originalX.value
                y.value = offset.originalY.value
            } else {
                x.value = offset.x.value
                y.value = offset.y.value
            }
            ctx.initialScrollY = scrollY.value
            ctx.x = x.value
            ctx.y = y.value
            isGestureActive.value = true
        },
        onActive: (event, ctx) => {
            const positionY = event.absoluteY + scrollY.value

            if (positionY <= scrollY.value + 100) {
                // Scroll up
                scrollY.value = withTiming(0, {duration: 300});
              } else if (positionY >= scrollY.value + dimensions.height - 100) {
                // Scroll down
                scrollY.value = withTiming(1000, {duration: 300});
              } else {
                cancelAnimation(scrollY);
              }

            // console.log("positionY : " , positionY)

            // console.log("scrollY : " , scrollY.value)

            x.value = ctx.x + event.translationX
            y.value = ctx.y + event.translationY + scrollY.value - ctx.initialScrollY
        },
        onEnd: ({velocityX, velocityY}, ctx) => {
            if(!isSelected.value && isInGroup(y.value, borders)){
                setGroup(y.value, borders, offset)
                offset.order.value = getLastOrder(offsets, offset.group.value)
                calculateLayout(offsets, offset.group.value, borders)
                addOffset(offsets, borders, offset)
                x.value = withSpring(offset.x.value, {velocity: velocityX})
                y.value = withSpring(offset.y.value, {velocity: velocityY})
            } else if(isSelected.value && !isInGroup(y.value, borders)){
                removeOffset(offsets, borders, offset)
                remove(offsets, offset)
                calculateLayout(offsets, offset.group.value, borders)
                offset.group.value = -1
                offset.order.value = -1
            } else if(isSelected.value && isInGroup(y.value, borders) && !belongsTo(offset.group.value, y.value, borders) ) {
                removeOffset(offsets, borders, offset)
                remove(offsets, offset)
                calculateLayout(offsets, offset.group.value, borders)
                setGroup(y.value, borders, offset)
                offset.order.value = getLastOrder(offsets, offset.group.value)
                calculateLayout(offsets, offset.group.value, borders)
                addOffset(offsets, borders, offset)
                x.value = withSpring(offset.x.value, {velocity: velocityX})
                y.value = withSpring(offset.y.value, {velocity: velocityY})
            }
            isGestureActive.value = false
        }
    })

    const translateX = useDerivedValue(() => {
        if(isGestureActive.value){
            return x.value
        }
        return withSpring(isSelected.value ? offset.x.value : offset.originalX.value)
    })
    const translateY = useDerivedValue(() => {
        if(isGestureActive.value) {
            return y.value
        }
        return withSpring(isSelected.value ? offset.y.value : offset.originalY.value)
    })


    const animatedStyle = useAnimatedStyle(() => {
        return {
            top: 0,
            left: 0,
            position: 'absolute',
            width: offset.width.value,
            height: offset.height.value,
            transform: [
                {translateX: translateX.value},
                {translateY: translateY.value}
            ]
        }
    })

    return(
        <>
            <PanGestureHandler onGestureEvent={eventHandler}>
                <Animated.View style={animatedStyle}>
                    {children}
                </Animated.View>
            </PanGestureHandler>
        </>
    )
}

export default DraggableItem;
