import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View
} from 'react-native';
import {createStackNavigator, createAppContainer} from 'react-navigation'

import MyPost from "./MyPost";
import PostDetails from "./PostDetails";
import FullScreenImage from "../../FullScreenImage";

const Navigation = createStackNavigator({
    
    MyPost: { screen: MyPost },
    PostDetails: { screen: PostDetails,
        navigationOptions: {
            header: null
        }
    },
    FullScreenImage: { screen: FullScreenImage,
        navigationOptions: {
            header: null
        }
    }
}, {
    initialRouteName: 'MyPost',
    /* The header config from FirstScreen is now here */
    navigationOptions: {

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

// navigationOptions: {
//             header: null,
//             gesturesEnabled: false,
//             tabBarVisible: false,
//         }