import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View
} from 'react-native';
import {createStackNavigator, createAppContainer} from 'react-navigation'

import Bidders from "./Bidders";
import MerchantProfile from "./MerchantProfile";
import PostDetails from "../mypost/PostDetails";
import GiveRating from "../../GiveRating";
import FullScreenImage from "../../FullScreenImage";

const Navigation = createStackNavigator({
    
    Bidders: { screen: Bidders },
    MerchantProfile: { screen: MerchantProfile,
        navigationOptions: {
            header: null
        }
    },
    PostDetails: { screen: PostDetails,
        navigationOptions: {
            header: null
        }
    },
    GiveRating: { screen: GiveRating,
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
    initialRouteName: 'Bidders',
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

