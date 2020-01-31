import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, Platform, Alert, AsyncStorage} from 'react-native';

import {NavigationActions} from 'react-navigation'

import { styles, color, windowWidth, fontSize } from "./styles/theme"
import { App } from "./global"

export default class Menu extends Component {

    constructor(props) {
        super(props);

        this.state = {
            name: '',
            avatar: ''
        }
    }

    componentDidMount() {

        AsyncStorage.getItem("name").then((value) => {
            console.log("name", value);
            this.setState({
                name: value
            })
        }).done();

        AsyncStorage.getItem("avatar").then((value) => {
            console.log("avatar", value);
            this.setState({
                avatar: value
            })
        }).done();  
    }

    componentWillUpdate() {

        if (App.isOpenMenu) {
            AsyncStorage.getItem("name").then((value) => {
                console.log("name", value);
                this.setState({
                    name: value
                })
            }).done();

            AsyncStorage.getItem("avatar").then((value) => {
                console.log("avatar", value);
                this.setState({
                    avatar: value
                })
            }).done();    

            App.isOpenMenu = false
        }        
    }

    actionSwitch = (status) => {
        
        if (status == 2) {
            App.isCustomer = 3;
            AsyncStorage.setItem('user_role_id', '3');
            this.goMerchantSearch()
        } else {
            App.isCustomer = 2;
            AsyncStorage.setItem('user_role_id', '2');
            this.goCustomerHome()  
        }        
    }

    actionSearch = () => {
        this.props.navigation.closeDrawer();
        this.goMerchantSearch()
    }

    openProfile = () => {
        this.props.navigation.closeDrawer();
        this.props.navigation.navigate('MyProfile', {facebook: App.isFacebook})    
    }

    openSettings = () => {
        this.props.navigation.closeDrawer();
        App.sub_langing_page = ""
        this.props.navigation.navigate('JobSetting')    
    }

    openHelp = () => {
        this.props.navigation.closeDrawer();
        this.props.navigation.navigate('Help')    
    }

    actionClose = () => {
        this.props.navigation.closeDrawer();
        this.props.navigation.navigate('CloseAccount')    
    }

    actionLogout = () => {
        
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
              {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
              {text: 'Logout', onPress: () => this.logout() },
            ],
            { cancelable: false }
        ) 
    }

    logout() {
        this.props.navigation.closeDrawer();

        AsyncStorage.setItem('uid', '');
        AsyncStorage.setItem('name', '');
        AsyncStorage.setItem('email', '');
        AsyncStorage.setItem('avatar', '');
        AsyncStorage.setItem('mobile', '');
        AsyncStorage.setItem('user_role_id', '');
        AsyncStorage.setItem('is_active', '');
        AsyncStorage.setItem('user_id', '');

        AsyncStorage.setItem('job_location_post_code', "");
        AsyncStorage.setItem('job_location_latitude', "");
        AsyncStorage.setItem('job_location_longitude', "");
        AsyncStorage.setItem('job_location_country', "");
        AsyncStorage.setItem('services', "");
        AsyncStorage.setItem('total_experience', "");
        AsyncStorage.setItem('description', "");
        AsyncStorage.setItem('address', "");
        AsyncStorage.setItem('previous_work_images', "");

        App.isOpenMenu = true
        App.landing_page = ""
        App.isResaved = true
        App.isFacebook = false

        if (App.isCustomer == 2) {
            // this.props.navigation.dispatch(NavigationActions.navigate({ routeName: 'Home' }));
            // this.props.navigation.dispatch({ type: 'Navigation/BACK' })
            this.goCustomerHome()
        
        } else {
            // this.props.navigation.dispatch(NavigationActions.navigate({ routeName: 'Search' }));

            this.goMerchantSearch()
        }       
    }

    actionLogin = () => {
        this.props.navigation.navigate('Login')
    }

    actionCreate = () => {
        this.props.navigation.closeDrawer();
        this.goCustomerHome()
    }

    goCustomerHome() {
        const navigateAction = NavigationActions.navigate({
            routeName: 'Home',  //Parent route
            params: {},
          
            // navigate can have a nested navigate action that will be run inside the child router
            action: NavigationActions.navigate({ routeName: 'Home'})    //Chile route
        })
        this.props.navigation.dispatch(navigateAction)
    }

    goMerchantSearch() {
        const navigateAction = NavigationActions.navigate({
            routeName: 'Search',  //Parent route
            params: {},
          
            // navigate can have a nested navigate action that will be run inside the child router
            action: NavigationActions.navigate({ routeName: 'Search'})    //Chile route
        })
        this.props.navigation.dispatch(navigateAction)
    }

    render() {

        const {name, avatar} = this.state

        return (
            <View style={{flex: 1}}>
                <View style={{flex: 1, width: windowWidth - 90, backgroundColor: color.cell_bg}}>
                    <Image source={ require("../resource/logo.png") } style={[{width: 80, height: 80, alignSelf: 'center'}, (Platform.OS == 'android') ? {marginTop: 10} : {marginTop: 50}]}/>

                    <Text style={{color: color.title_color, fontSize: 22, textAlign: 'center'}}>SERVICE<Text style={{fontWeight: 'bold'}}>MAN</Text></Text>                            
                    <Text style={{color: color.navigation_bg, fontSize: 17, textAlign: 'center', marginTop: 5}}>{(App.isCustomer == 2) ? "CUSTOMER" : "MERCHANT"}</Text>

                    
                    {(name !== "" && name !== null) ?
                        <View style={[{flexDirection: 'row', height: 60, marginLeft: 20}, (Platform.OS == 'android') ? {marginTop: 15} : {marginTop: 30}]}>   
                            {(avatar != null) ?
                                <Image source={{uri: avatar}} style={{width: 60, height: 60, borderRadius: 30}}/> :
                                <Image source={require("../resource/default_avatar.png")} style={{width: 60, height: 60, borderRadius: 30}}/> }

                            <View style={{flexDirection: 'column', justifyContent: 'center', marginLeft: 15}}>
                                <Text style={{color: color.title_color, fontSize: 15, textAlign: 'center'}}>{name.toUpperCase()}</Text>
                                {/* <Text style={{color: color.navigation_bg, fontSize: 18, textAlign: 'center', marginTop: 5}}>Singapore</Text> */}
                            </View>
                        </View> : null }

                    {(name == "" || name == null) ?
                        <TouchableOpacity onPress={() => this.actionLogin()}>
                            <View style={style.menu_item}>
                                <Image source={ require("../resource/ic_login.png") } style={{width: 20, height: 20}}/>
                                <Text style={style.menu_item_label}>Login</Text>
                            </View>
                        </TouchableOpacity> : null }

                    {(App.isCustomer == 2 && (name !== "" && name !== null)) ? 
                        <TouchableOpacity onPress={() => this.actionCreate()}>
                            <View style={style.menu_item}>
                                <Image source={ require("../resource/ic_create_tb.png") } style={{width: 20, height: 20}}/>
                                <Text style={style.menu_item_label}>Create New Post</Text>
                            </View></TouchableOpacity> : null }

                    {(App.isCustomer == 3 && (name !== "" && name !== null)) ? 
                        <TouchableOpacity onPress={() => this.actionSearch()}>
                            <View style={style.menu_item}>
                                <Image source={ require("../resource/ic_search.png") } style={{width: 20, height: 20}}/>
                                <Text style={style.menu_item_label}>Search Jobs</Text>
                            </View></TouchableOpacity> : null }

                    {(name !== "" && name !== null) ?
                        <TouchableOpacity onPress={() => this.openProfile()}>
                            <View style={style.menu_item}>
                                <Image source={ require("../resource/ic_profile.png") } style={{width: 20, height: 22}}/>
                                <Text style={style.menu_item_label}>My Profile</Text>
                            </View>
                        </TouchableOpacity> : null }

                    {(App.isCustomer == 3 && (name !== "" && name !== null)) ? 
                        <TouchableOpacity onPress={() => this.openSettings()}>
                            <View style={style.menu_item}>
                                <Image source={ require("../resource/ic_settings.png") } style={{width: 20, height: 20}}/>
                                <Text style={style.menu_item_label}>My Job Settings</Text>
                            </View></TouchableOpacity> : null }
                        
                    {(name !== "" && name !== null) ?
                        <TouchableOpacity onPress={() => this.actionClose()}>
                            <View style={style.menu_item}>
                                <Image source={ require("../resource/ic_close.png") } style={{width: 20, height: 20}}/>
                                <Text style={style.menu_item_label}>Close Account</Text>
                            </View>
                        </TouchableOpacity> : null }

                    {(name !== "" && name !== null) ?
                        <TouchableOpacity onPress={() => this.openHelp()}>
                            <View style={style.menu_item}>
                                <Image source={ require("../resource/ic_help.png") } style={{width: 20, height: 20}}/>
                                <Text style={style.menu_item_label}>Help</Text>
                            </View>
                        </TouchableOpacity> : null }

                    {(name !== "" && name !== null) ?
                        <TouchableOpacity onPress={() => this.actionLogout()}>
                            <View style={style.menu_item}>
                                <Image source={ require("../resource/ic_logout.png") } style={{width: 20, height: 20}}/>
                                <Text style={style.menu_item_label}>Logout</Text>
                            </View>
                        </TouchableOpacity> : null }

                    <TouchableOpacity onPress={() => this.actionSwitch(App.isCustomer)}>
                        <View style={[{flexDirection: 'row', width: windowWidth - 130, height: 40, margin: 20, borderRadius: 20, alignItems: 'center', justifyContent: 'center'}, (App.isCustomer == 3) ? {backgroundColor: color.complete_btn_bg} : {backgroundColor: color.cancel_btn_bg}]}>
                            <Image source={ require("../resource/ic_switch.png") } style={{width: 28, height: 27}}/>
                            <Text style={[style.menu_item_label, {color: color.white}]}>{(App.isCustomer == 2) ?  "Switch to Merchant" : "Switch to Customer"}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const style = StyleSheet.create({
    menu_item: {
        flexDirection: 'row', 
        height: 40, 
        alignItems: 'center', 
        marginTop: 10, 
        marginLeft: 20
    },
    menu_item_label: {
        color: color.title_color, 
        fontSize: 17, 
        textAlign: 'center', 
        marginLeft: 15
    }
});