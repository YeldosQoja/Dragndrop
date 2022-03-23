import React from 'react';
import { Text, View, Dimensions } from 'react-native';

const {width, height} = Dimensions.get('screen')

const ScrollItem = ({
    index,
}) => (
    <View style={{
        width: width,
        height: height/4,
        backgroundColor: `rgba(19, 158, 56, ${index*0.1})`
    }}>
        {/* <Text>ScrollItem</Text> */}
    </View>
);

export default ScrollItem;
