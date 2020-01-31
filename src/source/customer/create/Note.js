import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, TextInput, ScrollView, TouchableHighlight, PermissionsAndroid, Platform, AsyncStorage, Alert} from 'react-native';

import { styles, color, windowWidth, fontSize } from "../../styles/theme"

import NavigationBar from "../../../components/NavigationBar";
import Button from "../../../components/Button"
import ModalDropdown from "../../../components/ModalDropdown";

import { NavigationEvents } from 'react-navigation';
import Loading from 'react-native-whc-loading'

import ImagePicker from 'react-native-image-picker'

import { App } from "../../global"

var images = ""

export default class Note extends Component {

    constructor(props) {
        super(props);

        this.state = {
            selectProperty: [],
            filePath: [],
            price: '',
            notes: '',
            serviceId: -1,
            subServiceId: -1,
            preferred_date: "",
            preferred_time: "",
            is_urgent: 0,
            address: '',
            property_id: -1,
            code: ""
        }
    }

    watchID: ?number = null

    actionPost = async () => {

        const {address, code, property_id, filePath, price, notes} = this.state

        if (address.length == "") {
            alert("Please enter street name");
        } else if (code.length == "") {
            alert("Please enter postal code");
        } else if (property_id === -1) {
            alert("Please select property");
        } else {

            let user_id = await AsyncStorage.getItem("user_id");
            console.log("user_id: " + user_id);

            if (filePath.length > 0) {
                this.multipleFileUpload(user_id)
            } else {
                if (user_id === null || user_id === "") {
                    
                    App.landing_page = "Note"

                    App.images = ""
                    App.price = price
                    App.notes = notes
                    App.property_id = property_id
                    App.address = address
                    App.code = code
                    
                    this.props.navigation.navigate('Login')
    
                } else {
                    Note.createService(this.props.navigation, "", price, notes, property_id, address, code, this.refs.loading)
                }
            }
        }
    }

    static async createService(navigation, images, price, notes, property_id, address, code, loading) {
        
        loading.show()

        let serviceId = await AsyncStorage.getItem("serviceId")
        let subServiceId = await AsyncStorage.getItem("subServiceId")
        let preferred_date = await AsyncStorage.getItem("preferred_date")
        let preferred_time = await AsyncStorage.getItem("preferred_time")
        let is_urgent = await AsyncStorage.getItem("is_urgent")
        let questions = await AsyncStorage.getItem("questions")
        let user_id = await AsyncStorage.getItem("user_id");

        let myLatitude=0.0, myLongitude=0.0, real_address=""

        let link = `${App.google_place_api}&address=${address},${code}`
        console.log(link);

        await fetch(link, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
            }).then((response) => response.json())
            .then((responseJson) => {

                loading.close()
                
                console.log("Address:", responseJson);

                real_address = responseJson.results[0].formatted_address;

                myLatitude = responseJson.results[0].geometry.location.lat
                myLongitude = responseJson.results[0].geometry.location.lng
                
                fetch(`${App.api_link}create-service-request`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        service_id: serviceId,
                        sub_service_id: subServiceId,
                        preferred_date: preferred_date,
                        preferred_time: preferred_time,
                        property_id: property_id,
                        is_urgent: is_urgent,
                        user_id: user_id,
                        price: price,
                        notes: notes,
                        images: images,
                        questions: questions,
                        address: real_address,
                        latitude: myLatitude,
                        longitude: myLongitude
                    })
                    }).then((response) => response.json())
                    .then((responseJson) => {
                        
                        console.log("Property List:", responseJson);
        
                        if (responseJson.status == "success") {
                            Alert.alert(
                                'Success',
                                'Your post is now live!',
                                [
                                    {text: 'Yes', onPress: () => navigation.navigate('MyPost') }
                                ],
                                { cancelable: false }
                            ) 
                        } 
                    })
                    .catch((error) => {
                        console.error(error);
        
                });

            })
            .catch((error) => {
                console.error(error);

                loading.close()
        });
    }

    async multipleFileUpload(user_id) {
        
        const {price, notes, property_id, address, code} = this.state

        this.refs.loading.show();  

        let body = new FormData();

        this.state.filePath.forEach((item, i) => {
            body.append("files", {
              uri: item.uri,
              type: "image/jpeg",
              name: 'photo.png',
              filename :'imageName.png'
            });
        });

        body.append("type", "service_request")

        await fetch(`${App.api_link}multiple-upload-images`, {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            body: body
            }).then((response) => response.json())
            .then((responseJson) => {
                
                this.refs.loading.close();
                console.log("File name:", responseJson);

                if (responseJson.status == "success") {
                    
                    if (user_id === null || user_id === "") {
                        
                        App.landing_page = "Note"

                        App.images = responseJson.data
                        App.price = price
                        App.notes = notes
                        App.property_id = property_id
                        App.address = address
                        App.code = code
                        
                        this.props.navigation.navigate('Login')
                    } else {
                        Note.createService(this.props.navigation, responseJson.data, price, notes, property_id, address, code, this.refs.loading)
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

    _dropdown_2_renderButtonText(rowData) {
        console.log("index", this.state.selectProperty.indexOf(rowData));

        this.setState({
            property_id: this.state.selectProperty.indexOf(rowData) + 1
        })

        return rowData;
    }

    _dropdown_2_renderRow(rowData, rowID, highlighted) {
        return (
          <TouchableHighlight underlayColor='cornflowerblue'>
            <View style={[style.dropdown_2_row]}>
              
              <Text style={[style.dropdown_2_row_text, highlighted && {color: 'black'}]}>
                {`${rowData}`}
              </Text>
            </View>
          </TouchableHighlight>
        );
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

            var arrFilePath = this.state.filePath
            arrFilePath.push(source)
            this.setState({
              filePath: arrFilePath,
            });

            console.log("filePath: ", this.state.filePath.length.toString())
            console.log("filePath: ", JSON.stringify(this.state.filePath))
          }
        });
    };

    async getProperty() {

        this.setState({
            selectProperty: []
        })

        await fetch(`${App.api_link}property-list`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
            }).then((response) => response.json())
            .then((responseJson) => {
                
                console.log("Property List:", responseJson);

                if (responseJson.status == "success") {

                    var dropdownList = this.state.selectProperty;

                    for (let index = 0; index < responseJson.data.length; index++) {
                        dropdownList.push(responseJson.data[index].name)
                    }

                    this.setState({
                        selectProperty: dropdownList
                    })                    
                } 
            })
            .catch((error) => {
                console.error(error);
        });
    }

    render() {

        return (
            <View style={{flex: 1, backgroundColor: color.white}}>
                <NavigationEvents
                    onDidFocus={payload => this.getProperty()} />

                <NavigationBar title={"Notes"} img={require("../../../resource/ic_back.png")} width={20} height={16} index={1} navigation={this.props.navigation} />
                
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{flexDirection: "row", width: windowWidth, alignItems: 'center', marginTop: 15}}>
                        <Image source={ require("../../../resource/ic_map.png") } style={{width: 13, height: 19, marginLeft: 25}}/>
                        <Text style={{marginLeft: 10, fontSize: 20}}>Meetup Location</Text>
                    </View>

                    <View style={[styles.input_view, styles.view_size, {marginLeft: 25, marginTop: 10}]}>
                        <TextInput style={[styles.text_input, {fontSize: fontSize.regular}]}
                            underlineColorAndroid = "transparent"
                            placeholder = "Enter building name, street name"
                            placeholderTextColor = {color.input_hold_color}
                            autoCapitalize = "none"
                            onChangeText = {(address) => this.setState({ address: address })}
                            value={this.state.address} />
                    </View>

                    <View style={[styles.input_view, styles.view_size, {marginLeft: 25, marginTop: 10}]}>
                        <TextInput style={[styles.text_input, {fontSize: fontSize.regular}]}
                            underlineColorAndroid = "transparent"
                            placeholder = "Enter postal code, country"
                            placeholderTextColor = {color.input_hold_color}
                            autoCapitalize = "none"
                            onChangeText = {(code) => this.setState({ code: code })}
                            value={this.state.code} />
                    </View>

                    <View style={[styles.input_view, styles.view_size, {marginTop: 15, alignSelf: 'center'}]}>

                        <ModalDropdown ref="dropdown_2"
                           style={style.dropdown_2}
                           textStyle={[style.dropdown_2_text]}
                           dropdownStyle={[style.dropdown_2_dropdown, {height: (40 * this.state.selectProperty.length) + 3}]}
                           options={this.state.selectProperty}
                           renderButtonText={(rowData) => this._dropdown_2_renderButtonText(rowData)}
                           renderRow={this._dropdown_2_renderRow.bind(this)} />
                    </View>

                    <Text style={style.label}>My budget price (optional)</Text>
                    <View style={[styles.input_view, styles.view_size, {marginLeft: 25, marginTop: 10}]}>
                        <TextInput style={[styles.text_input, {fontSize: fontSize.regular}]}
                            underlineColorAndroid = "transparent"
                            placeholder = "0"
                            placeholderTextColor = {color.input_hold_color}
                            autoCapitalize = "none"
                            keyboardType="numeric"
                            onChangeText = {(price) => this.setState({ price: price })}
                            value={this.state.price} />
                    </View>
                    <Text style={{marginLeft: 25, marginTop: 5, fontSize: 11, color: color.top_up}}>Please pay cash directly to merchant after job is completed</Text>

                    <View style={{flexDirection: 'row'}}>
                        <Text style={[{flex: 1}, style.label]}>Additional notes (optional)</Text>
                        <Text style={[style.label, {marginRight: 25}]}>{this.state.notes.length}/250</Text>
                    </View>
                    
                    <View style={{marginLeft: 25, marginTop: 20, width: windowWidth - 50, height: 80, borderRadius: 22, backgroundColor: color.grey}}>
                        <TextInput style={[{flex: 1, fontSize: fontSize.small, marginLeft: 10, marginTop: 5, textAlignVertical: 'top'}]}
                            underlineColorAndroid = "transparent"
                            placeholder = "Type here"
                            placeholderTextColor = {color.input_hold_color}
                            autoCapitalize = "none"
                            multiline={true}
                            maxLength={250}
                            onChangeText = {(notes) => this.setState({ notes: notes })}
                            value={this.state.notes} />
                    </View>

                    <View style={{flexDirection: 'column', backgroundColor: color.cell_bg, marginTop: 15}}>
                        <Text style={style.label}>More merchants will reply to you if you have photos</Text>              

                        <View style={[style.sub_view, {marginBottom: 20}]}>
                            <View style={{flexDirection: 'row', marginTop: 15}}>
                            <TouchableOpacity onPress={() => this.chooseFile()}>
                                {(this.state.filePath.length > 0) ?
                                    <Image source={ {uri: this.state.filePath[0].uri} } style={{width: 75, height: 75, borderRadius: 37.5}}/> :
                                    <Image source={ require('../../../resource/avatar.png') } style={{width: 75, height: 75}}/> }
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.chooseFile()}>
                                {(this.state.filePath.length > 1) ?
                                    <Image source={ {uri: this.state.filePath[1].uri} } style={{width: 75, height: 75, borderRadius: 37.5, marginLeft: 10}}/> :
                                    <Image source={ require('../../../resource/avatar.png') } style={{width: 75, height: 75, marginLeft: 10}}/> }
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.chooseFile()}>
                                {(this.state.filePath.length > 2) ?    
                                    <Image source={ {uri: this.state.filePath[2].uri} } style={{width: 75, height: 75, borderRadius: 37.5, marginLeft: 10}}/> :
                                    <Image source={ require('../../../resource/avatar.png') } style={{width: 75, height: 75, marginLeft: 10}}/> }
                            </TouchableOpacity>
                                {/* <View style={{width: 75, height: 75, marginLeft: 15, backgroundColor: color.white, borderRadius: 37.5, alignItems: 'center', justifyContent: 'center'}}>
                                    <Text style={{fontSize: 40, color: color.navigation_bg}}>+</Text>
                                </View>                         */}
                            </View>
                        </View> 
                    </View>

                    <TouchableOpacity onPress={() => this.actionPost()}>
                        <View style={{marginLeft: 25, marginBottom: 25}}>
                            <Button title={"Confirm Post"}/> 
                        </View>
                    </TouchableOpacity>
                </ScrollView>

                <Loading ref="loading"/> 
            </View>
        )
    }
}

const style = StyleSheet.create({
    label: {
        marginLeft: 25, 
        marginTop: 20, 
        fontSize: 13, 
        color: color.top_up
    },
    sub_view: {
        width: windowWidth - 50,
        marginLeft: 25
    },
    dropdown_2: {
        width: windowWidth - 50,
        height: 45,
        justifyContent: 'center'
    },
    dropdown_2_text: {
        marginVertical: 10,
        fontSize: 14,
        color: 'black',
        textAlignVertical: 'center'
    },
    dropdown_2_dropdown: {
        width: windowWidth - 50,
        marginTop: 6,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: color.grey,
        backgroundColor: color.grey
    },
    dropdown_2_row: {
        flexDirection: 'row',
        height: 40,
        alignItems: 'center',
    },
    dropdown_2_row_text: {
        marginHorizontal: 8,
        fontSize: 13,
        color: 'black',
        textAlignVertical: 'center'
    },
    dropdown_2_separator: {
        height: 1,
    },
});