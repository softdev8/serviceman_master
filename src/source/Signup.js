import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, TextInput, Platform, ScrollView, Linking, AsyncStorage} from 'react-native';

import { styles, color, windowWidth, fontSize, navbarHeight } from "./styles/theme"
import Button from "../components/Button"

import { NavigationEvents } from 'react-navigation';
import ImagePicker from 'react-native-image-picker'
import Loading from 'react-native-whc-loading'

import {App} from "./global"
import Bid from './merchant/search/Bid';
import Note from './customer/create/Note';

export default class Signup extends Component {

    constructor(props) {
        super(props);

        this.state = {
            name: '',
            email: '',
            mobile: '',
            password: '',
            confirm_pw: '',
            filePath: null,
            filename: ''
        }
    }

    init() {
        this.setState({
            name: '',
            email: '',
            mobile: '',
            password: '',
            confirm_pw: '',
            filePath: null,
            filename: ''
        })
    }

    actionLogin = () => {
        this.props.navigation.navigate('Login')
    }

    actionSignup = () => {

        const {name, email, mobile, password, confirm_pw, filePath} = this.state

        if (name.length == 0) {
            alert("Please enter name");
        } else if (email.length == 0) {
            alert("Please enter email");
        } else if (!this.validate(email)) {
            alert("Please enter email correctly.");
        } else if (mobile.length == 0) {
            alert("Please enter mobile");
        } else if (password.length == 0) {
            alert("Please enter password");
        } else if (confirm_pw.length == 0) {
            alert("Please enter confirm password");
        } else if (password !== confirm_pw) {
            alert("Don't match password");
        } else {
            if (filePath === null) {
                this.signup("")
            } else {
                this.uploadImage()
            }
        }
    }

    async signup(filename) {

        const {name, email, mobile, password} = this.state

        let device_type = (Platform.OS == 'ios') ? "iphone" : "android"
        var device_id = await AsyncStorage.getItem("device_id");

        await fetch(`${App.api_link}signup`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                email: email,
                mobile: mobile,
                password: password,
                device_type: device_type,
                device_id: device_id,
                filename: filename
            })
            }).then((response) => response.json())
            .then((responseJson) => {
                
                this.refs.loading.close();

                console.log("Login:", responseJson);

                if (responseJson.status == "success") { 

                    App.isOpenMenu = true
                    
                    AsyncStorage.setItem('uid', responseJson.data.uid);
                    AsyncStorage.setItem('name', responseJson.data.name);
                    AsyncStorage.setItem('email', responseJson.data.email);
                    AsyncStorage.setItem('avatar', responseJson.data.image);
                    AsyncStorage.setItem('mobile', responseJson.data.mobile);
                    AsyncStorage.setItem('user_role_id', JSON.stringify(responseJson.data.user_role_id));
                    AsyncStorage.setItem('is_active', JSON.stringify(responseJson.data.is_active));
                    AsyncStorage.setItem('user_id', responseJson.data.id);

                    //Job settgins
                    AsyncStorage.setItem('job_location_post_code', responseJson.data.job_location_post_code.toString());
                    AsyncStorage.setItem('job_location_latitude', responseJson.data.job_location_latitude.toString());
                    AsyncStorage.setItem('job_location_longitude', responseJson.data.job_location_longitude.toString());
                    AsyncStorage.setItem('job_location_country', responseJson.data.job_location_country);
                    AsyncStorage.setItem('services', responseJson.data.services);
                    AsyncStorage.setItem('total_experience', responseJson.data.total_experience);
                    AsyncStorage.setItem('description', responseJson.data.description);

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
                            this.props.navigation.navigate(App.landing_page)
                        }
                    }
                } else {
                    alert(responseJson.message.message);
                }
            })
            .catch((error) => {
                console.error(error);

                this.refs.loading.close();
        });
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
            console.log("filePath: ", response);
            this.setState({
              filePath: source,
            });
          }
        });
    };

    async uploadImage() {

        this.refs.loading.show();  

        let body = new FormData();
        body.append('file', {uri: this.state.filePath.uri, name: 'photo.png',filename :'imageName.png',type: 'image/png'});
        body.append('Content-Type', 'image/png');

        await fetch(`${App.api_link}upload`, {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            body: body
            }).then((response) => response.json())
            .then((responseJson) => {
                
                console.log("File name:", responseJson);

                if (responseJson.status == "success") {
                    this.signup(responseJson.filename)
                } else {
                    alert(responseJson.message)
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

    validate = (text) => {
        console.log(text);
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
        if(reg.test(text) === false) {
            console.log("Email is Not Correct");
            return false;
        } else {
            console.log("Email is Correct");
            return true;
        }
    }

    updateInput(newString) {
        this.setState({ email: newString.trim() });
    }

    render() {

        return (
            <View style={styles.container}>
                <NavigationEvents
                     onDidFocus={payload => this.init()} />
                
                <View style={[{width: windowWidth, height: navbarHeight, backgroundColor: color.navigation_bg, alignItems: 'center', justifyContent: 'center'}, (Platform.OS == 'ios') ? {paddingTop: 25} : null]}>
                    <Text style={[{color: color.white, fontSize: fontSize.large}]}>Sign Up</Text>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')} style={[{position: 'absolute', left: 15, alignSelf: 'center'}, (Platform.OS == 'ios') ? {top: 38} : null]} >
                        <Image source={require("../resource/ic_back.png")} style={[{width: 20, height: 16}]}/>
                    </TouchableOpacity>
                </View>
                
                <ScrollView showsVerticalScrollIndicator={false}>
                    <TouchableOpacity onPress={() => this.chooseFile()} style={{alignSelf: 'center'}} >
                        {(this.state.filePath !== null) ?
                            <Image source={ {uri: this.state.filePath.uri} } style={{width: 100, height: 100, marginTop: 25, borderRadius: 50}}/> :
                            <Image source={ require("../resource/avatar.png") } style={{width: 100, height: 100, marginTop: 25}}/> 
                        }
                    </TouchableOpacity>

                    <View style={[styles.input_view, styles.view_size, {marginTop: 20}]}>
                        <TextInput style={styles.text_input}
                            underlineColorAndroid = "transparent"
                            placeholder = "Name"
                            placeholderTextColor = {color.input_hold_color}
                            autoCapitalize = "none"
                            onChangeText = {(name) => this.setState({ name: name })}
                            value={this.state.name} />
                    </View>

                    <View style={[styles.input_view, styles.view_size, {marginTop: 15}]}>
                        <TextInput style={styles.text_input}
                            underlineColorAndroid = "transparent"
                            placeholder = "Email"
                            placeholderTextColor = {color.input_hold_color}
                            autoCapitalize = "none"
                            onChangeText = {this.updateInput.bind(this)}
                            value={this.state.email} />
                    </View>

                    <View style={[styles.input_view, styles.view_size, {marginTop: 15}]}>
                        <TextInput style={styles.text_input}
                            underlineColorAndroid = "transparent"
                            placeholder = "Mobile"
                            placeholderTextColor = {color.input_hold_color}
                            autoCapitalize = "none"
                            keyboardType="phone-pad"
                            onChangeText = {(mobile) => this.setState({ mobile: mobile })}
                            value={this.state.mobile} />
                    </View>

                    <View style={[styles.input_view, styles.view_size, {marginTop: 15}]}>
                        <TextInput style={styles.text_input}
                            underlineColorAndroid = "transparent"
                            placeholder = "Password"
                            placeholderTextColor = {color.input_hold_color}
                            autoCapitalize = "none"
                            secureTextEntry={true}
                            onChangeText = {(password) => this.setState({ password: password })}
                            value={this.state.password} />
                    </View>

                    <View style={[styles.input_view, styles.view_size, {marginTop: 15}]}>
                        <TextInput style={styles.text_input}
                            underlineColorAndroid = "transparent"
                            placeholder = "Confirm Password"
                            placeholderTextColor = {color.input_hold_color}
                            autoCapitalize = "none"
                            secureTextEntry={true}
                            onChangeText = {(confirm_pw) => this.setState({ confirm_pw: confirm_pw })}
                            value={this.state.confirm_pw} />
                    </View>
                    
                    <TouchableOpacity onPress={() => this.openLink()}>
                        <Text style={{width: 250, color: color.top_up, marginTop: 15, textAlign: 'center', alignSelf: 'center'}}>
                            <Text style={{}}>By clicking save you agree to </Text>
                            <Text style={{textDecorationLine: 'underline', textDecorationColor: color.complete_btn_bg, color: color.complete_btn_bg}}>our terms and conditions</Text>
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => this.actionSignup()}>
                        <Button title={"Sign Up"}/>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => this.actionLogin()}>
                        <Text style={{width: 100, height: 30, color: color.navigation_bg, marginTop: 40, marginBottom: 30, fontWeight: 'bold', fontSize: 21, textAlign: 'center', alignSelf: 'center'}}>Login</Text>
                    </TouchableOpacity>
                </ScrollView>

                <Loading ref="loading"/> 
            </View>
        )
    }
}

