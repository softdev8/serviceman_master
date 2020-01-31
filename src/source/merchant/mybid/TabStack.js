import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View
} from 'react-native';
import {createStackNavigator, createAppContainer} from 'react-navigation'

import MyBid from "./MyBid";
import JobDetails from "./JobDetails";
import CustomerProfile from "./CustomerProfile";
import GiveRating from "../../GiveRating";
import FullScreenImage from "../../FullScreenImage";

const Navigation = createStackNavigator({
    
    MyBid: { screen: MyBid,
        navigationOptions: {
            header: null
        }
    },
    JobDetails: { screen: JobDetails,
        navigationOptions: {
            header: null
        }
    },
    CustomerProfile: { screen: CustomerProfile,
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
    initialRouteName: 'MyBid',
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

