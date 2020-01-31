import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Image, TextInput, Platform, AsyncStorage, ScrollView, Alert} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

import { styles, color, windowWidth, fontSize } from "./styles/theme"
import Button from "../components/Button"

import { NavigationEvents } from 'react-navigation';
import { LoginManager, AccessToken } from 'react-native-fbsdk'
import Loading from 'react-native-whc-loading'

import { App } from "./global"
import Bid from './merchant/search/Bid';
import Note from './customer/create/Note';

import {NavigationActions} from 'react-navigation'

export default class Login extends Component {

    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: ''
        }
    }

    actionLogin = () => {

        const {email, password} = this.state

        if (email.length == 0) {
            Alert.alert("Please enter email");
        } else if (!this.validate(email)) {
            Alert.alert("Please enter email correctly.");
        } else if (password.length == 0) {
            Alert.alert("Please enter password");
        } else {
            this.login(email, password)
        }
    }

    validate = (text) => {
        console.log(text);
        // let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
        // reg = /^[ ]*([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})[ ]*$/;
        let reg = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i
        if(new RegExp(reg).test(text) === false) {
            console.log("Email is Not Correct");
            return false;
        } else {
            console.log("Email is Correct");
            return true;
        }
    }

    async login(email, password) {

        let device_type = (Platform.OS == 'ios') ? "iphone" : "android"

        // this.refs.loading.show();  

        var device_id = await AsyncStorage.getItem("device_id");

        await fetch(`${App.api_link}login`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email.toLowerCase(),
                password: password,
                device_type: device_type,
                device_id: device_id
            })
            }).then((response) => response.json())
            .then((responseJson) => {
                
                // this.refs.loading.close();

                console.log("Login:", responseJson);

                if (responseJson.status == "success") {

                    App.isOpenMenu = true

                    AsyncStorage.setItem('uid', responseJson.data.uid);
                    AsyncStorage.setItem('name', responseJson.data.name);
                    AsyncStorage.setItem('email', responseJson.data.email);
                    AsyncStorage.setItem('avatar', responseJson.data.image);
                    AsyncStorage.setItem('mobile', responseJson.data.mobile);
                    AsyncStorage.setItem('user_role_id', responseJson.data.user_role_id.toString());
                    AsyncStorage.setItem('is_active', responseJson.data.is_active.toString());
                    AsyncStorage.setItem('user_id', responseJson.data.id);
                    AsyncStorage.setItem('total_unread_notification', responseJson.data.total_unread_notification.toString());

                    //Job settgins
                    AsyncStorage.setItem('job_location_post_code', responseJson.data.job_location_post_code.toString());
                    AsyncStorage.setItem('job_location_latitude', responseJson.data.job_location_latitude.toString());
                    AsyncStorage.setItem('job_location_longitude', responseJson.data.job_location_longitude.toString());
                    AsyncStorage.setItem('job_location_country', responseJson.data.job_location_country);
                    AsyncStorage.setItem('services', responseJson.data.services);
                    AsyncStorage.setItem('total_experience', responseJson.data.total_experience);
                    AsyncStorage.setItem('description', responseJson.data.description);
                    AsyncStorage.setItem('address', responseJson.data.address);
                    AsyncStorage.setItem('previous_work_images', JSON.stringify(responseJson.data.previous_work_images));

                    if (App.landing_page == "") {
                        if (App.isCustomer == 2) {
                            this.props.navigation.navigate('Home')    
                        } else {
                            this.props.navigation.navigate('Search')    
                        }        
                    } else {
                        if (App.landing_page == "JobSetting") {
                            if (responseJson.data.services == "") { //no existing jobsetting
                                this.props.navigation.navigate(App.landing_page)    
                            } else {
                                Bid.actionPost(this.props.navigation, App.post_id, responseJson.data.id, App.amount, App.fee, App.notes)
                            }
                        } else if (App.landing_page == "Note") {
                            Note.createService(this.props.navigation, App.images, App.price, App.notes, App.property_id, App.address, App.code, this.refs.loading)
                        } else {
                            console.log("App.isCustomer:" + App.isCustomer)
                            console.log("App.landing_page:" + App.landing_page)

                            if (App.isCustomer == 3 && (App.landing_page == "Credits" || App.landing_page == "Rating" || App.landing_page == "Notification")) {
                                console.log("sdfsdfsdfsdfsdfsdf")
                                const navigateAction = NavigationActions.navigate({
                                    routeName: 'Merchant',  //Parent route
                                    params: {},
                                  
                                    // navigate can have a nested navigate action that will be run inside the child router
                                    action: NavigationActions.navigate({ routeName: App.landing_page})    //Chile route
                                })
                                this.props.navigation.dispatch(navigateAction)    
                            } else {
                                this.props.navigation.navigate(App.landing_page)
                            }                            
                        }
                    }

                } else {
                    if (responseJson.message.code) {
                        alert(responseJson.message.message);     
                    } else {
                        alert(responseJson.message);                    
                    }
                }
            })
            .catch((error) => {
                console.error(error);

                this.refs.loading.close();
        });
    }

    actionSignup = () => {
        this.props.navigation.navigate('Signup')
    }

    actionFacebook = () => {
        this.handleFacebookLogin()
    }

    actionGoHome = () => {
        if (App.isCustomer == 2) {
            this.props.navigation.navigate('Home')
        } else {
            this.props.navigation.navigate('Search')
        }        
    }

    async handleFacebookLogin () {

        var device_id = await AsyncStorage.getItem("device_id");
        var navigation = this.props.navigation

        LoginManager.logInWithReadPermissions(['public_profile', 'email']).then(
          function (result) {
            if (result.isCancelled) {
                console.log('Login cancelled')
            } else {
                console.log('Login success with permissions: ' + result.grantedPermissions.toString())

                AccessToken.getCurrentAccessToken().then((data)=>{
                    console.log(data);

                    let name = '', token = '', uid = '', picture = '', email = ''

                    fetch(`https://graph.facebook.com/me?access_token=${data.accessToken.toString()}`)
                        .then((response) => response.json())
                        .then((res) => {
                            console.log("name:", res.name);
                            name = res.name

                            uid = data.userID

                            picture = `http://graph.facebook.com/${data.userID}/picture?type=large`
                            console.log("picture:", `http://graph.facebook.com/${data.userID}/picture?type=large`);
        
                            fetch(`https://graph.facebook.com/me?fields=email&access_token=${data.accessToken.toString()}`)
                                .then((response) => response.json())
                                .then((res) => {
                                    console.log("email:", res.email);
                                    email = res.email

                                    navigation.navigate("MyProfile", {facebook: true, name: name, email: email, picture: picture, facebookId: uid})
                                })
                        })
                })
            }
          },
          function (error) {
            console.log('Login fail with error: ' + error)
          }
        )
    }

    actionForgotPassword = () => {
        this.props.navigation.navigate('ForgotPassword')
    }

    updateInput(newString) {
        this.setState({ email: newString.trim() });
    }

    render() {

        return (
            <View style={styles.container}>
                <NavigationEvents
                     onDidFocus={payload => this.setState({email: '', password: ''})} />

                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={[{width: windowWidth, backgroundColor: color.grey, alignItems: 'center'}, (Platform.OS == "android") ? {height: 108, paddingTop: 4} : {height: 140, paddingTop: 35}]}>
                        <Image source={ require("../resource/logo.png") } style={{width: 100, height: 100}}/>
                    </View>

                    <TouchableOpacity onPress={() => this.actionFacebook()} >
                        <View style={[styles.input_view, styles.view_size, {marginTop: 50, backgroundColor: color.fb_btn_bg, justifyContent: 'center', alignSelf: 'center'}]}>
                            <Image source={ require("../resource/ic_fb.png") } style={{width: 25, height: 25}}/>
                            <Text style={{color: color.white, fontSize: fontSize.regular, marginLeft: 15}}>Login with Facebook</Text>                            
                        </View>
                    </TouchableOpacity>

                    <View style={[styles.input_view, styles.view_size, {marginTop: 25, alignSelf: 'center'}]}>
                        <TextInput style={styles.text_input}
                            underlineColorAndroid = "transparent"
                            placeholder = "Email"
                            placeholderTextColor = {color.input_hold_color}
                            autoCapitalize = "none"
                            onChangeText = {this.updateInput.bind(this)}
                            value={this.state.email} />
                    </View>

                    <View style={[styles.input_view, styles.view_size, {marginTop: 20, alignSelf: 'center'}]}>
                        <TextInput style={styles.text_input}
                            underlineColorAndroid = "transparent"
                            placeholder = "Password"
                            placeholderTextColor = {color.input_hold_color}
                            secureTextEntry={true}
                            autoCapitalize = "none"
                            onChangeText = {(password) => this.setState({ password: password })}
                            value={this.state.password} />
                    </View>

                    <TouchableOpacity onPress={() => this.actionLogin()} style={{alignSelf: 'center'}}>
                        <Button title={"Login"}/>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => this.actionForgotPassword()}>
                        <Text style={{width: 125, height: 25, color: color.top_up, marginTop: 15, textAlign: 'center', alignSelf: 'center'}}>Reset password?</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity onPress={() => this.actionSignup()}>
                        <Text style={{width: 100, height: 30, color: color.navigation_bg, marginTop: 30, fontWeight: 'bold', fontSize: 21, textAlign: 'center', alignSelf: 'center'}}>Sign Up</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => this.actionGoHome()}>
                        <Text style={{height: 30, color: color.complete_btn_bg, textDecorationLine: 'underline', textDecorationColor: color.complete_btn_bg, marginTop: 30, marginBottom: 30, fontSize: 15, textAlign: 'center', alignSelf: 'center'}}>Go Back Home Screen</Text>
                    </TouchableOpacity>
                </ScrollView>

                <Loading ref="loading"/>   
            </View>
        )
    }
}
