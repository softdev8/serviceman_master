import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, TextInput, Linking, AsyncStorage, Platform, ScrollView} from 'react-native';

import { styles, color, windowWidth, fontSize } from "./styles/theme"

import NavigationBar from "../components/NavigationBar";
import Button from "../components/Button"

import { NavigationEvents } from 'react-navigation';
import Loading from 'react-native-whc-loading'

import ImagePicker from 'react-native-image-picker'
import {App} from "./global"
import Bid from './merchant/search/Bid';
import Note from './customer/create/Note';

export default class MyProfile extends Component {

    constructor(props) {
        super(props);

        this.state = {
            filePath: null,
            name: '',
            email: '',
            mobile: '',
            password: '',
            avatar: ''
        }
    }

    async getProfile() {

        var user_id = await AsyncStorage.getItem("user_id");
        console.log("user_id: " + user_id);

        if (user_id === null || user_id === "") {
            this.props.navigation.navigate('Login')

        } else {
            var name = await AsyncStorage.getItem("name");
            var email = await AsyncStorage.getItem("email");
            var avatar = await AsyncStorage.getItem("avatar");
            console.log("avatar: " + avatar);
            var mobile = await AsyncStorage.getItem("mobile");

            this.setState({
                name: name,
                email: email,
                avatar: avatar,
                mobile: mobile
            })
        }
    }

    chooseFile = () => {
        var options = {
          title: 'Select Image',
          storageOptions: {
            skipBackup: true,
            path: 'images',
          },
        };
        ImagePicker.showImagePicker(options, response => {
          console.log('Response = ', response);
          if (response.didCancel) {
            console.log('User cancelled image picker');
            // alert('User cancelled image picker');
          } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
            alert('ImagePicker Error: ' + response.error);
          } else if (response.customButton) {
            console.log('User tapped custom button: ', response.customButton);
            // alert(response.customButton);
          } else {
            let source = response;

            this.setState({
              avatar: source.uri,
            });
          }
        });
    };

    actionSave = (facebook, fb_name, fb_email, fb_picture, fbId) => {

        if (facebook) {
            const {mobile, avatar} = this.state

            if (mobile.length == 0) {
                alert("Please enter mobile");
            } else {
                if (avatar != "") {
                    this.uploadImage(facebook, fb_name, fb_email, mobile, fbId)
                } else {
                    this.facebook_signup(fb_name, fb_email, mobile, fb_picture, fbId)
                }
            }
        } else {
            const {name, email, mobile, password, avatar} = this.state
            
            if (name.length == 0) {
                alert("Please enter name");
            } else if (email.length == 0) {
                alert("Please enter email");
            } else if (mobile.length == 0) {
                alert("Please enter mobile");
            } else {
                if (avatar == "") {
                    this.updateProfile("")
                } else {
                    this.uploadImage(facebook)
                }
            }
        }
    }

    async facebook_signup(name, email, mobile, filename, facebookId) {

        var navigation = this.props.navigation

        let device_type = (Platform.OS == 'ios') ? "iphone" : "android"
        var device_id = await AsyncStorage.getItem("device_id");

        this.refs.loading.show();  

        fetch(`${App.api_link}login-with-facebook`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                email: email,
                mobile: mobile,
                filename: filename,
                device_id: device_id,
                device_type: device_type,
                facebook_id: facebookId
            })
            }).then((response) => response.json())
            .then((responseJson) => {
                
                console.log("Facebook Login:", responseJson);
                this.refs.loading.close();

                if (responseJson.status == "success") {

                    App.isOpenMenu = true
                    App.isFacebook = true

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
                    AsyncStorage.setItem('previous_work_images', responseJson.data.previous_work_images);
                    
                    if (App.landing_page == "") {
                        if (App.isCustomer == 2) {
                            navigation.navigate('Home')    
                        } else {
                            navigation.navigate('Search')    
                        }        
                    } else {
                        if (App.landing_page == "JobSetting") {
                            if (responseJson.data.services == "") { //no existing jobsetting
                                navigation.navigate(App.landing_page)    
                            } else {
                                Bid.actionPost(navigation, App.post_id, responseJson.data.id, App.amount, App.fee, App.notes)
                            }
                        } else if (App.landing_page == "Note") {
                            Note.createService(this.props.navigation, App.images, App.price, App.notes, App.property_id, App.address, App.code, this.refs.loading)
                        } else {
                            navigation.navigate(App.landing_page)
                        }
                    }
                }
            })
            .catch((error) => {
                console.error(error);

                this.refs.loading.close();
        });
    }

    async uploadImage(facebook, fb_name, fb_email, mobile, fbId) {

        this.refs.loading.show();  

        let body = new FormData();
        body.append('file', {uri: this.state.avatar, name: 'photo.png',filename :'imageName.png',type: 'image/png'});
            body.append('Content-Type', 'image/png');

        await fetch(`${App.api_link}upload`, {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            body: body
            }).then((response) => response.json())
            .then((responseJson) => {
                
                console.log("response:", responseJson);

                if (responseJson.status == "success") {
                    if (facebook) {
                        this.facebook_signup(fb_name, fb_email, mobile, responseJson.filename, fbId)
                    } else {
                        this.updateProfile(responseJson.filename)
                    }
                } else {
                    alert(responseJson.message)
                }

            })
            .catch((error) => {
                console.error(error);
                
                this.refs.loading.close();
        });
    }

    async updateProfile(filename) {

        const {name, email, mobile, password} = this.state

        var user_id = await AsyncStorage.getItem("user_id");
        var user_role_id = await AsyncStorage.getItem("user_role_id");

        console.log("user_id: " + user_id)

        await fetch(`${App.api_link}my-profile`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: user_id,
                name: name,
                password: password,
                email: email,
                mobile: mobile,
                filename: filename
            })
            }).then((response) => response.json())
            .then((responseJson) => {
                
                this.refs.loading.close();

                console.log("My Profile:" + responseJson);

                if (responseJson.status == "success") {
                    
                    AsyncStorage.setItem('uid', responseJson.data.uid);
                    AsyncStorage.setItem('name', responseJson.data.name);
                    AsyncStorage.setItem('email', responseJson.data.email);
                    AsyncStorage.setItem('avatar', responseJson.data.avatar);
                    AsyncStorage.setItem('mobile', responseJson.data.mobile);
                    AsyncStorage.setItem('user_role_id', responseJson.data.user_role_id);
                    AsyncStorage.setItem('is_active', responseJson.data.is_active);

                    if (user_role_id == 2) {
                        this.props.navigation.navigate('Customer')    
                    } else {
                        this.props.navigation.navigate('Merchant')
                    }                    
                    
                } else {
                    
                }
            })
            .catch((error) => {
                console.error(error);

                this.refs.loading.close();
        });
    }

    openLink = () => {

        Linking.canOpenURL(App.terms_link).then(supported => {
            if (supported) {
              Linking.openURL(App.terms_link);
            } else {
              console.log("Don't know how to open URI: " + App.terms_link);
            }
        });
    }

    render() {

        let facebook = false, email = "", name = "", picker = "", facebookId = ""

        const {navigation} = this.props
        if (navigation) {
            facebook = navigation.state.params.facebook
            email = navigation.state.params.email
            name = navigation.state.params.name
            picture = navigation.state.params.picture
            facebookId = navigation.state.params.facebookId 
        }        

        console.log("facebook: " + facebook);

        return (
            <View style={styles.container}>
                {(!facebook) ?
                    <NavigationEvents
                        onDidFocus={payload => this.getProfile()} /> : null }
                    
                <NavigationBar title={"My Profile"} img={require("../resource/ic_menu.png")} width={26} height={22} navigation={this.props.navigation} index={0} />
                
                <ScrollView showsVerticalScrollIndicator={false}>
                    <TouchableOpacity onPress={() => this.chooseFile()} style={{alignItems: 'center'}}>
                    {(this.state.avatar || facebook) ?
                        <Image source={{uri: (this.state.avatar) ? this.state.avatar : picture}} style={{width: 80, height: 80, marginTop: 25, borderRadius: 40}}/> :
                        <Image source={require("../resource/default_avatar.png")} style={{width: 80, height: 80, marginTop: 25, borderRadius: 40}}/> }
                    </TouchableOpacity>

                    <View style={[styles.input_view, styles.view_size, {marginTop: 20, marginLeft: 15}]}>
                        <TextInput style={styles.text_input}
                            underlineColorAndroid = "transparent"
                            placeholder = "Name"
                            placeholderTextColor = {color.input_hold_color}
                            autoCapitalize = "none"
                            editable={!facebook}
                            onChangeText = {(name) => this.setState({ name: name})}
                            value={(facebook) ? name : this.state.name} />
                    </View>

                    <View style={[styles.input_view, styles.view_size, {marginTop: 20, marginLeft: 15}]}>
                        <TextInput style={styles.text_input}
                            underlineColorAndroid = "transparent"
                            placeholder = "Email"
                            placeholderTextColor = {color.input_hold_color}
                            autoCapitalize = "none"
                            editable={false}
                            onChangeText = {(email) => this.setState({ email: email.trim() })}
                            value={(facebook) ? email : this.state.email} />
                    </View>
                    
                    <Text style={{fontSize: 12, color: 'grey', marginLeft: 20, marginTop: 20}}>(Please include international country code eg. +65, +60, +81)</Text> 
                    <View style={[styles.input_view, styles.view_size, {marginTop: 5, marginLeft: 15}]}>
                        <TextInput style={styles.text_input}
                            underlineColorAndroid = "transparent"
                            placeholder = "Mobile Number"
                            placeholderTextColor = {color.input_hold_color}
                            autoCapitalize = "none"
                            keyboardType="phone-pad"
                            onChangeText = {(mobile) => this.setState({ mobile: mobile.trim() })}
                            value={this.state.mobile} />
                    </View>
                    
                    {(!facebook) ?
                        <View style={[styles.input_view, styles.view_size, {marginTop: 20, marginLeft: 15}]}>
                            <TextInput style={styles.text_input}
                                underlineColorAndroid = "transparent"
                                placeholder = "Password"
                                placeholderTextColor = {color.input_hold_color}
                                secureTextEntry={true}
                                autoCapitalize = "none"
                                onChangeText = {(password) => this.setState({ password: password })}
                                value={this.state.password} />
                        </View> : null }

                    <TouchableOpacity onPress={() => this.openLink()} style={{alignItems: 'center'}}>
                        <Text style={{width: 250, color: color.top_up, marginTop: 15, textAlign: 'center'}}>
                            <Text style={{}}>By clicking save you agree to </Text>
                            <Text style={{textDecorationLine: 'underline', textDecorationColor: color.complete_btn_bg, color: color.complete_btn_bg}}>our terms and conditions</Text>
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => this.actionSave(facebook, name, email, picture, facebookId)} style={{alignItems: 'center'}}>
                        <Button title={"Save"}/>
                    </TouchableOpacity>
                </ScrollView>
                <Loading ref="loading"/> 
            </View>
        )
    }


}
const style = StyleSheet.create({
    
});