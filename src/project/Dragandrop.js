import React, {useEffect} from 'react';
import { Text, View } from 'react-native';
import { measure, useAnimatedRef, useDerivedValue } from 'react-native-reanimated';
import { width } from '../test/Utils';

const DATA = [
    {
      id: 1,
      source: 'America',
      type: "text",
    },
    {
      id: 2,
      source: 'Europe',
      type: "text",
    },
    {
      id: 3,
      source: require('./../assets/images/1.png'),
      type: "image",
    },
    {
      id: 4,
      source: 'Cat',
      type: "text",
    },
    {
      id: 5,
      source: "Unbelievable",
      type: "text",
    },
    {
      id: 6,
      source: 'gorgeous',
      type: "text",
    },
    {
      id: 7,
      source: require('./../assets/images/1.png'),
      type: "image",
    },
    {
      id: 8,
      source: require('./../assets/images/1.png'),
      type: "image",
    },
    {
      id: 9,
      source: "Required",
      type: "text",
    },
  ]

const Dragandrop = () => {

  const animatedRef = useAnimatedRef(null)
  // const layout = useDerivedValue(() => {
  //   console.log("Layout : " , result)
  // })

  useEffect(() => {
    const result = measure(animatedRef)
    console.log("Layout : " , result)
  }, [])

    console.log("Hello, world!")

    return(
        <View
            style={{
                flex: 1,
                backgroundColor: '#fff',
                justifyContent: 'center',
            }}
        >
            <View
                style={{
                    height: 300,
                    width: 200,
                    backgroundColor: 'red',
                    alignSelf: 'center'
                }}
            ></View>
            <View
              style={{
                padding: 10,
                width: 100,
                backgroundColor: 'yellow',
                justifyContent: 'center',
                alignItems: 'center'
              }}
              ref={animatedRef}
            >
              <Text>{DATA[0].source}</Text>
            </View>
        </View>
    )
}

export default Dragandrop;
