import React from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';

const {width} = Dimensions.get('screen')

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: "#000",
        justifyContent: 'center',
        alignItems: 'center',
        margin: 3
    },
    text: {
        fontSize: 18,
        fontWeight: '600',
        color: "#000",
    },
    image: {
        width: (width-62)/2,
        height: (width-62)/2,
        borderRadius: 5
    }
})

const Item = ({source, type}) => {

    return(
        <View style={[styles.container, {
            paddingHorizontal: type == 'text' ? 16 : 0,
            paddingVertical: type == 'text' ? 8 : 0,
            borderRadius: type == 'text' ? 20 : 5
        }]}>
            {
                type == 'text'
                ?
                <Text style={styles.text}>{source}</Text>
                :
                type == 'image' 
                ?
                <Image style={styles.image} source={source}/>
                :
                null
            }
        </View>
    )
}

export default Item;

