import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View
} from 'react-native';
import {createStackNavigator, createAppContainer} from 'react-navigation'

import Notification from "./Notification";
import MerchantProfile from "./customer/bidders/MerchantProfile";
import PostDetails from "./customer/mypost/PostDetails";
import JobDetails from "./merchant/mybid/JobDetails";
import Credits from "./merchant/credits/Credits";
import FullScreenImage from "./FullScreenImage";

const Navigation = createStackNavigator({
    
    Notification: { screen: Notification},
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
    JobDetails: { screen: JobDetails,
        navigationOptions: {
            header: null
        }
    },
    Credits: { screen: Credits,        
        navigationOptions: {
            header: null
        }
    },
    FullScreenImage: { screen: FullScreenImage,
        navigationOptions: {
            header: null
        }
    },

}, {
    initialRouteName: 'Notification',
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

