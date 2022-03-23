import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import Animated, { useAnimatedRef, useAnimatedScrollHandler, useSharedValue, useAnimatedReaction, scrollTo } from 'react-native-reanimated';
import Item from './Item';
import ItemList from './ItemList';

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

const ANSWERS = ["Дед Мазай" , "Каждое лето у дедушки гостит", "В деревне охотятся ", "Кузя носит с собой на охоту", "Второй охотник носит с собой на охоту", "Дед мороз"]

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollview: {
    backgroundColor: 'white',
    padding: 16,
  },
  scrollContainer: {
 
  }
})

const Dragndrop = () => {

    const scrollRef = useAnimatedRef()
    const scrollY = useSharedValue(0)

    useAnimatedReaction(
      () => scrollY.value,
      (scrolling) => {
        scrollTo(scrollRef, 0, scrolling, false)
      }
    );

    const sortByType = (data) => {
      let texts = []
      let images = []
      data.forEach(element => {
        if(element.type == 'text') texts.push(element)
        else images.push(element)
      });
      return texts.concat(images)
    }

    const scrollHandler = useAnimatedScrollHandler((event) => {
      scrollY.value = event.contentOffset.y
    })

    return(
        <View style={styles.container}>
            <Animated.ScrollView
              ref={scrollRef}
              style={[styles.scrollview]}
              contentContainerStyle={styles.scrollContainer}
              showsVerticalScrollIndicator={false}
              onScroll={scrollHandler}
              scrollEventThrottle={16}
            >
              <ItemList
                answers={ANSWERS}
              >
                {sortByType(DATA).map((element, index) => {
                  return <Item key={index.toString()} source={element.source} type={element.type} scrollY={scrollY}/>
                })}
              </ItemList>
              <ItemList
                answers={ANSWERS}
              >
                {sortByType(DATA).map((element, index) => {
                  return <Item key={index.toString()} source={element.source} type={element.type} scrollY={scrollY}/>
                })}
              </ItemList>

            </Animated.ScrollView>
        </View>
    )
}

export default Dragndrop;
