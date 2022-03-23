import React, {useRef, useEffect} from 'react';
import {FlatList, View, TouchableOpacity, Button} from 'react-native'
import Animated, { useAnimatedRef } from 'react-native-reanimated';

const App = () => {

  const ref = useRef(null)

  const showRef = () => {
    console.log(ref)
  }

  return(
      <View style={{flex: 1, backgroundColor: 'red', justifyContent: 'center', alignItems: 'center'}}>
        <Button title='click on me' onPress={() => showRef()}/>
        <TouchableOpacity style={{width: 100, height: 100, backgroundColor: 'green'}} onPress={() => showRef()}>

        </TouchableOpacity>
        <FlatList
          ref={ref}
          data={Array(10).fill(0)}
          renderItem={({item, index}) => <View/>}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
  )
}

export default App;
