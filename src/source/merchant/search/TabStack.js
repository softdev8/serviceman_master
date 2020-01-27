import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View
} from 'react-native';
import {createStackNavigator, createAppContainer} from 'react-navigation'

import Search from "./Search";
import Bid from "./Bid";
import BidSuccess from "./BidSuccess";
import JobDetails from "../mybid/JobDetails";
import FullScreenImage from "../../FullScreenImage";
import CustomerProfile from "../mybid/CustomerProfile";

const Navigation = createStackNavigator({
    
    Search: { screen: Search,
        navigationOptions: {
            header: null
        }
    },
    Bid: { screen: Bid,
        navigationOptions: {
            header: null
        }
    },
    BidSuccess: { screen: BidSuccess,
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
    FullScreenImage: { screen: FullScreenImage,
        navigationOptions: {
            header: null
        }
    },
}, {
    initialRouteName: 'Search',
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

