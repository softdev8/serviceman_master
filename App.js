import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    Dimensions,
    AsyncStorage,
    Platform
} from 'react-native';
import {createBottomTabNavigator, createStackNavigator, createDrawerNavigator, createAppContainer, NavigationActions} from 'react-navigation'

import { color } from "./src/source/styles/theme"

import SlideMenu from './src/source/Menu'

import Login from "./src/source/Login";
import Signup from "./src/source/Signup";
import Help from "./src/source/Help";
import MyProfile from "./src/source/MyProfile";
import JobSetting from "./src/source/JobSetting";
import CloseAccount from "./src/source/CloseAccount";
import ForgotPassword from "./src/source/ForgotPassword";
import Guide from "./src/source/Guide";

import Home from "./src/source/customer/create/TabStack";
import MyPost from "./src/source/customer/mypost/TabStack";
import Bidders from "./src/source/customer/bidders/TabStack";

import Rating from "./src/source/customer/rating/TabStack";
import Notification from "./src/source/TabStack";

import Search from "./src/source/merchant/search/TabStack";
import MyBid from "./src/source/merchant/mybid/TabStack";
import Credits from "./src/source/merchant/credits/TabStack";

import FCM, {NotificationType,FCMEvent,RemoteNotificationResult,WillPresentNotificationResult} from "react-native-fcm";

const Customer = createBottomTabNavigator({
    
    Home: {
        screen: Home,
        navigationOptions: {
          tabBarLabel: 'CREATE'
        },
    },
    MyPost: {
        screen: MyPost,
        navigationOptions: {
          tabBarLabel: 'MY POSTS'
        }
    },
    Bidders: {
        screen: Bidders,
        navigationOptions: {
          tabBarLabel: 'BIDDERS'
        }
    },
    Rating: {
        screen: Rating,
        navigationOptions: {
          tabBarLabel: 'RATING'
        }
    },
    Notification: {
        screen: Notification,
        navigationOptions: {
          tabBarLabel: 'ALERT'
        }
    }
}, {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarOnPress: ({ navigation, defaultHandler }) => {
        console.log('onPress123:', navigation.state.routeName);

        navigation.dispatch(NavigationActions.navigate({ routeName: navigation.state.routeName }));
        
        defaultHandler()
      },
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        
        // console.log("routeName123: " + routeName);

        if (routeName == "Home") {
          if (focused) {
            return <Image source={require('./src/resource/ic_active_create_tb.png')} style={{ height: 22, width: 22 }} />    
          } else {
            return <Image source={require('./src/resource/ic_create_tb.png')} style={{ height: 22, width: 22 }} />
          }        
        } else if (routeName == "MyPost") {
          if (focused) {
            return <Image source={require('./src/resource/ic_active_post_tb.png')} style={{ height: 22, width: 22 }} />  
          } else {
            return <Image source={require('./src/resource/ic_post_tb.png')} style={{ height: 22, width: 22 }} />
          }        
        } else if (routeName == "Bidders") {
          if (focused) {
            return <Image source={require('./src/resource/ic_active_bidder_tb.png')} style={{ height: 22, width: 22 }} />  
          } else {
            return <Image source={require('./src/resource/ic_bidder_tb.png')} style={{ height: 22, width: 22 }} />
          }        
        } else if (routeName == "Rating") {
          if (focused) {
            return <Image source={require('./src/resource/ic_active_rate_tb.png')} style={{ height: 22, width: 22 }} />    
          } else {
            return <Image source={require('./src/resource/ic_rating_tb.png')} style={{ height: 22, width: 22 }} />
          }        
        } else if (routeName == "Notification") {
          if (focused) {
            return <Image source={require('./src/resource/ic_active_notification_tb.png')} style={{ height: 22, width: 22 }} />  
          } else {
            return <Image source={require('./src/resource/ic_notification_tb.png')} style={{ height: 22, width: 22 }} />
            // (
            //   <View style={{flexDirection: 'row',alignItems: 'center',justifyContent: 'center',}}>
            //     <Image source={require('./src/resource/ic_notification_tb.png')} style={{ height: 22, width: 22 }} />
            //     {/* <View style={{ position: 'absolute', right: -8, top: -3, backgroundColor: 'red', borderRadius: 9, width: 18, height: 18, justifyContent: 'center', alignItems: 'center' }}>
            //       <Text style={{ color: 'white' }}>5</Text>
            //     </View> */}
            //   </View> 
            // );
          }        
        } 
      },
    }),    
    tabBarOptions: {
        activeTintColor: color.navigation_bg,
        inactiveTintColor: 'gray',
        height:60,
        style: {
            backgroundColor: 'white',
            borderTopWidth: 0,
            shadowOffset: { width: 5, height: 3 },
            shadowColor: 'black',
            shadowOpacity: 0.5,
            elevation: 5
        }
    }
});

const Merchant = createBottomTabNavigator({
    
  Search: {
      screen: Search,
      navigationOptions: {
        tabBarLabel: 'SEARCH'
      }
  },
  MyBid: {
      screen: MyBid,
      navigationOptions: {
        tabBarLabel: 'MY BIDS'
      }
  },
  Credits: {
      screen: Credits,
      navigationOptions: {
        tabBarLabel: 'CREDITS'
      }
  },
  Rating: {
      screen: Rating,
      navigationOptions: {
        tabBarLabel: 'RATING'
      }
  },
  Notification: {
      screen: Notification,
      navigationOptions: {
        tabBarLabel: 'ALERT'
      }
  }
}, {
  defaultNavigationOptions: ({ navigation }) => ({
    tabBarOnPress: ({ navigation, defaultHandler }) => {
      console.log('onPress:', navigation.state.routeName);

      navigation.dispatch(NavigationActions.navigate({ routeName: navigation.state.routeName }));
      
      defaultHandler()
    },
    tabBarIcon: ({ focused, horizontal, tintColor }) => {
      const { routeName } = navigation.state;
      
      // console.log("routeName: " + routeName);

      if (routeName == "Search") {
        if (focused) {
          return <Image source={require('./src/resource/ic_active_search_tb.png')} style={{ height: 22, width: 22 }} />    
        } else {
          return <Image source={require('./src/resource/ic_search_tb.png')} style={{ height: 22, width: 22 }} />  
        }        
      } else if (routeName == "MyBid") {
        if (focused) {
          return <Image source={require('./src/resource/ic_active_my_bid_tb.png')} style={{ height: 22, width: 22 }} />  
        } else {
          return <Image source={require('./src/resource/ic_my_bid_tb.png')} style={{ height: 22, width: 22 }} />
        }        
      } else if (routeName == "Credits") {
        if (focused) {
          return <Image source={require('./src/resource/ic_active_credits_tb.png')} style={{ height: 22, width: 22 }} />  
        } else {
          return <Image source={require('./src/resource/ic_credits_tb.png')} style={{ height: 22, width: 22 }} />
        }        
      } else if (routeName == "Rating") {
        if (focused) {
          return <Image source={require('./src/resource/ic_active_rate_tb.png')} style={{ height: 22, width: 22 }} />    
        } else {
          return <Image source={require('./src/resource/ic_rating_tb.png')} style={{ height: 22, width: 22 }} />
        }        
      } else if (routeName == "Notification") {
        if (focused) {
          return <Image source={require('./src/resource/ic_active_notification_tb.png')} style={{ height: 22, width: 22 }} />  
        } else {
          return <Image source={require('./src/resource/ic_notification_tb.png')} style={{ height: 22, width: 22 }} />
        }        
      } 
    },
  }),    
  tabBarOptions: {
      activeTintColor: color.navigation_bg,
      inactiveTintColor: 'gray',
      height:60,
      style: {
          backgroundColor: 'white',
          borderTopWidth: 0,
          shadowOffset: { width: 5, height: 3 },
          shadowColor: 'black',
          shadowOpacity: 0.5,
          elevation: 5
      }
  }
});

const HomeStack = createDrawerNavigator({
  Customer: { 
    screen: Customer,
    navigationOptions: {
      header: null
  }},
  Merchant: { 
    screen: Merchant,
    navigationOptions: {
      header: null
  }},
  Login: { screen: Login,
    navigationOptions: ({navigation}) => ({
        gesturesEnabled: false,
        drawerLockMode: 'locked-open'
    }) 
  },
  Signup: { screen: Signup,
    navigationOptions: ({navigation}) => ({
        gesturesEnabled: false,
        drawerLockMode: 'locked-open'
    }) 
  },
  Help: { screen: Help,
    navigationOptions: {
      header: null
  }},
  MyProfile: { screen: MyProfile,
    navigationOptions: {
      header: null
  }},
  JobSetting: { screen: JobSetting,
    navigationOptions: {
      header: null
  }},
  CloseAccount: { screen: CloseAccount,
    navigationOptions: {
      header: null
  }},
  ForgotPassword: { screen: ForgotPassword,
    navigationOptions: ({navigation}) => ({
        gesturesEnabled: false,
        drawerLockMode: 'locked-open'
    }) 
  },
  Guide: { screen: Guide,
    navigationOptions: ({navigation}) => ({
        gesturesEnabled: false,
        drawerLockMode: 'locked-open'
    }) 
  }  
}, {
  contentComponent: SlideMenu,
  drawerWidth: Dimensions.get('window').width - 90,    
});


const App = createAppContainer(HomeStack);

export default class AppNavigation extends Component {

  componentDidMount() {
    FCM.requestPermissions({ badge: false, sound: true, alert: true })     
          
    FCM.getFCMToken().then(token => {
        // alert(token)
        console.log("TOKEN (getFCMToken)", token);

        try {
        // let deveiceToken = JSON.stringify(token)

            if(token != null){
                // alert(token)
                AsyncStorage.setItem('device_id', token);
            }
        } catch (error) {

        }
    });

    // This method get all notification from server side.
    FCM.getInitialNotification().then(notif => {
        
    //  Alert.alert(JSON.stringify(notif));	
        console.log("INITIAL NOTIFICATION", JSON.stringify(notif))
    });

    this.refreshTokenListener = FCM.on(FCMEvent.RefreshToken, (token) => {
      
        try {
            if(token != null){
                AsyncStorage.setItem('device_id',token)
                // alert(token)
            }
        } catch (error) {
        
        }
      
    });

    // This method give received notifications to mobile to display.
    this.notificationUnsubscribe = FCM.on(FCMEvent.Notification, async (notif) => {

    });

    // this method call when FCM token is update(FCM token update any time so will get updated token from this method)
    this.refreshUnsubscribe =  FCM.on(FCMEvent.RefreshToken, token => {
        console.log("TOKEN (refreshUnsubscribe)", token);
    });

    FCM.on(FCMEvent.Notification, notif => {
        console.log("Notification", notif);

        if (Platform.OS === 'ios' && notif._notificationType === NotificationType.WillPresent && !notif.local_notification) {

            return;
        }

        if (notif.opened_from_tray) {
            
            // notif.finish(WillPresentNotificationResult.All);
        }

        if (Platform.OS === 'ios') {
            //optional
            //iOS requires developers to call completionHandler to end notification process. If you do not call it your background remote notifications could be throttled, to read more about it see the above documentation link.
            //This library handles it for you automatically with default behavior (for remote notification, finish with NoData; for WillPresent, finish depend on "show_in_foreground"). However if you want to return different result, follow the following code to override
            //notif._notificationType is available for iOS platfrom
            switch (notif._notificationType) {
                case NotificationType.Remote:
                    notif.finish(RemoteNotificationResult.NewData) //other types available: RemoteNotificationResult.NewData, RemoteNotificationResult.ResultFailed
                    break;
                case NotificationType.NotificationResponse:
                    notif.finish();
                    break;
                case NotificationType.WillPresent:
                    notif.finish(WillPresentNotificationResult.All) //other types available: WillPresentNotificationResult.None
                    // this type of notificaiton will be called only when you are in foreground.
                    // if it is a remote notification, don't do any app logic here. Another notification callback will be triggered with type NotificationType.Remote
                    break;
            }
        }
    });
  }

  render() {

    return (
      <App />      
    );
  }
}

