import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View
} from 'react-native';
import {createStackNavigator, createAppContainer} from 'react-navigation'

import Home from "./Home";
import SubService from "./SubService";
import DateTime from "./DateTime";
import Questions from "./Questions";
import Note from "./Note";

const Navigation = createStackNavigator({
    
    Home: { screen: Home },
    SubService: { screen: SubService, 
        navigationOptions: {
        header: null
    }}, 
    DateTime: { screen: DateTime, 
        navigationOptions: {
        header: null
    }},
    Questions: { screen: Questions,
        navigationOptions: {
            header: null
    }},
    Note: { screen: Note,
        navigationOptions: {
            header: null
    }}

}, {
    initialRouteName: 'Home',
    /* The header config from FirstScreen is now here */
    navigationOptions: {
        header: null,
        headerStyle: {
            backgroundColor: '#fbf1dc',
        },
        headerTintColor: '#000000',
        headerTitleStyle: {
            fontWeight: 'bold',
        },
    },
});

const TabStack = createAppContainer(Navigation);

export default TabStack;

