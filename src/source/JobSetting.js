import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, TextInput, ScrollView, TouchableHighlight, AsyncStorage, Alert} from 'react-native';

import { styles, color, windowWidth, fontSize } from "./styles/theme"

import NavigationBar from "../components/NavigationBar";
import Button from "../components/Button"
import ModalDropdown from "../components/ModalDropdown";

import Loading from 'react-native-whc-loading'

import ImagePicker from 'react-native-image-picker'
import { Email } from 'react-native-openanything';

import MultiSelectView from 'react-native-multiselect-view';
import { App } from "./global"
import { NavigationEvents } from 'react-navigation';

import Bid from './merchant/search/Bid';

var selectedFilter = []
var interest = [
    'Home Cleaner', 'Professional Cleaner', 'Air-Con', 'Car service', 'Pet Service', 'Home Chef', 'Movers', 'Telemarketer / Flyer', 'Handyman', 'Electrician', 'Plumber', 'Mother / Elderly Care', 'Sports Coach', 'Education & Tuition', 'Wedding & Beauty'
];

export default class JobSetting extends Component {

    constructor(props) {
        super(props);

        this.state = {
            experience: ["<1 year", "1~3 years", "4+ years", "7+ years", "10+ years"],
            filePath: [],
            notes: '',
            code: '',
            selectService: '',
            total_experience: "<1 year",
            address: '',
            isReload: true
        }
    }

    watchID: ?number = null

    actionSave = async () => {

        let user_id = await AsyncStorage.getItem("user_id");
        console.log("user_id: " + user_id);

        if (user_id === null || user_id === "") {
            this.props.navigation.navigate('Login')

        } else {
        
            const {filePath, selectService, address, code} = this.state

            var arr_service = selectService.split(',')

            if (address.length == "") {
                alert("Please enter street name");
            } else if (code.length == "") {
                alert("Please enter postal code");
            }  else if (selectService === '') {
                alert("Please select services");
            } else if (arr_service.length > 3) {
                alert("Sorry! You can only choose up to 3 job services.");
            } else {

                if (filePath.length > 0) {
                    this.multipleFileUpload()
                } else {
                    this.saveJobSettgins("")
                }
            }
        }
    }

    async multipleFileUpload() {
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

        body.append("type", "job_setting")

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
                    this.saveJobSettgins(responseJson.data)
                } else {
                    alert(responseJson.message)
                }

            })
            .catch((error) => {
                console.error(error);

                this.refs.loading.close();
        });
    }

    async saveJobSettgins(previous_work_images) {

        let myLatitude=0.0, myLongitude=0.0, country="", postal_code=""

        const {address, code, notes, selectService, total_experience} = this.state

        let user_id = await AsyncStorage.getItem("user_id");
        let original_country = await AsyncStorage.getItem("job_location_country");

        console.log("original_country: " + original_country);

        var loadingObj = this.refs
        loadingObj.loading.show();

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
                
                loadingObj.loading.close();

                console.log("Address:", responseJson);

                var new_address = ""

                if (responseJson.results.length !== 0) {

                    for (let index = 0; index < responseJson.results[0].address_components.length; index++) {
                        if (responseJson.results[0].address_components[index].types[0] == "postal_code") {
                            console.log("Postal code: " + responseJson.results[0].address_components[index].long_name);
                            postal_code = responseJson.results[0].address_components[index].long_name
                        }
    
                        if (responseJson.results[0].address_components[index].types[0] == "country") {
                            console.log("Country: " + responseJson.results[0].address_components[index].long_name);
                            country = responseJson.results[0].address_components[index].long_name
                        }
                    }
    
                    console.log("Country:", country);
    
                    if (original_country == "" || original_country == null || original_country == country) {
    
                        myLatitude = responseJson.results[0].geometry.location.lat
                        myLongitude = responseJson.results[0].geometry.location.lng
    
                        fetch(`${App.api_link}job-setting`, {
                            method: 'POST',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                user_id: user_id,
                                job_location_post_code: postal_code,
                                job_location_latitude: myLatitude,
                                job_location_longitude: myLongitude,
                                job_location_country: country,
                                services: selectService,
                                total_experience: total_experience,
                                description: notes,
                                previous_work_images: previous_work_images,
                                address: address
                            })
                            }).then((response) => response.json())
                            .then((responseJson) => {
    
                                App.isResaved = true    //When save, reload of MultiSelectView 
                                
                                console.log("Job Settings:", responseJson);
    
                                if (responseJson.status == "success") {
    
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
    
                                    if (App.sub_langing_page == "") {
                                        
                                        Alert.alert(
                                            'Success',
                                            'Your setting is saved!',
                                            [
                                                {text: 'Yes', onPress: () => console.log('Cancel Pressed'), style: 'cancel'}
                                            ],
                                            { cancelable: false }
                                        ) 
                                    } else {
                                        App.sub_langing_page = ""
                                        Bid.actionPost(this.props.navigation, App.post_id, user_id, App.amount, App.fee, App.notes)
                                    }
                                } 
                            })
                            .catch((error) => {
                                console.error(error);
    
                                this.refs.loading.close();
                        });
                    } else {
                        alert("Sorry! Invalid address in your origin country.");
                    }
                } else {
                    alert("Sorry! Invalid address in your origin country.");
                }
                
            })
            .catch((error) => {
                console.error(error);
        });
    }

    _dropdown_2_renderButtonText(rowData) {
        console.log("index", this.state.experience.indexOf(rowData));
        console.log("Total Experience: ", this.state.experience[this.state.experience.indexOf(rowData)]);

        this.setState({
            total_experience: this.state.experience[this.state.experience.indexOf(rowData)]
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

    onSelectionStatusChange(status, index) {
        console.log(status, index);

        this.setState({
            isReload: false
        })

        if (status) {
            selectedFilter.push(index + 1)
        } else {
            var item_index = selectedFilter.indexOf(index + 1)
            console.log("item_index:" + item_index);

            if (item_index !== -1) {
                selectedFilter.splice(item_index, 1)
            }
        }

        this.setState({
            selectService: selectedFilter.toString()
        })

        console.log("selectService:", selectedFilter.toString());
    }

    async getProperty() {
        selectedFilter = []

        let old_postal_code = await AsyncStorage.getItem("job_location_post_code");
        let old_desc = await AsyncStorage.getItem("description");
        let old_address = await AsyncStorage.getItem("address");
        let old_country = await AsyncStorage.getItem("job_location_country");
        let old_services = await AsyncStorage.getItem("services");
        let old_previous_work_images = await AsyncStorage.getItem("previous_work_images");
        let old_total_experience = await AsyncStorage.getItem("total_experience");
        console.log("old_country:" + old_country);
        console.log("old_services:" + old_services);
        console.log("old_previous_work_images:" + old_previous_work_images);
        
        this.setState({
            notes: old_desc,
            code: old_postal_code,
            selectService: old_services,
            total_experience: old_total_experience,
            address: old_address,
            filePath: (old_previous_work_images != "" && old_previous_work_images != null) ? JSON.parse(old_previous_work_images) : [],
            isReload: true,
            country: old_country
        }) 
        
        if (old_services != "" && old_services != null) {
            
            var new_value = []
            let arr_selected = old_services.split(',')
			for (let index = 0; index < arr_selected.length; index++) {
				new_value.push(Number(arr_selected[index]))				
            }
            
            selectedFilter = new_value

            console.log("selectedFilter:" + selectedFilter);
        }       
    }

    actionAlert = () => {
        Alert.alert(
            'Become our favourite merchant',
            'Customers are likely to accept your bid when you are our favourite merchant.',
            [
              {text: 'Ok', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
            ],
            { cancelable: false }
        ) 
    }

    actionEmail = async () => {

        let customer_id = await AsyncStorage.getItem("user_id")
        let username = await AsyncStorage.getItem("name")
        let mobile = await AsyncStorage.getItem("mobile")

        Email("contact@servicemanapp.com", "Apply to become favourite merchant - " + username, "You can become our favourite merchant by providing us your past customer reviews in facebook, amazon, or any other websites or apps.\n\nUser ID: " + customer_id + "\nUser Name: " + username + "\nWhatsapp Number: " + mobile + "\n\n", "contact@servicemanapp.com", "contact@servicemanapp.com");
    }

    render() {

        return (
            <View style={{flex: 1, backgroundColor: color.white}}>
                <NavigationEvents
                    onDidFocus={payload => this.getProperty()} />

                <NavigationBar title={"My Job Settings"} img={require("../resource/ic_menu.png")} width={26} height={22} navigation={this.props.navigation} index={0} />
                
                <ScrollView>

                    <View style={[style.bg_view, {paddingBottom: 15}]}>
                        <Text style={[style.label]}>My preferred job location</Text> 

                        <View style={[style.input_view, {marginTop: 10}]}>
                            <TextInput style={[styles.text_input, {fontSize: fontSize.regular}]}
                                underlineColorAndroid = "transparent"
                                placeholder = "Enter building name, street name"
                                placeholderTextColor = {color.input_hold_color}
                                autoCapitalize = "none"
                                onChangeText = {(address) => this.setState({ address: address })}
                                value={this.state.address} />
                        </View>

                        <View style={[style.input_view, {marginTop: 15}]}>
                            <TextInput style={[styles.text_input, {fontSize: fontSize.regular}]}
                                underlineColorAndroid = "transparent"
                                placeholder = "Enter postal code, country"
                                placeholderTextColor = {color.input_hold_color}
                                autoCapitalize = "none"
                                onChangeText = {(code) => this.setState({ code: code })}
                                value={this.state.code} />
                        </View>

                        {(this.state.country !== "" && this.state.country != null) ?
                            <View style={[style.input_view, {marginTop: 15}]}>
                                <TextInput style={[styles.text_input, {fontSize: fontSize.regular}]}
                                    underlineColorAndroid = "transparent"
                                    placeholderTextColor = {color.input_hold_color}
                                    autoCapitalize = "none"
                                    editable={false}
                                    value={this.state.country} />
                            </View> : null }
                    </View>    

                    <View style={[style.bg_view]}>
                        <Text style={[style.label]}>
                            <Text>I provide services</Text> 
                            <Text style={{fontSize: 13}}> (choose 3 max)</Text> 
                        </Text>

                        <MultiSelectView
                            page="job_setting"
                            ref='list2'
                            data={interest}
                            selected={this.state.selectService}
                            reload={this.state.isReload}
                            onSelectionStatusChange={this.onSelectionStatusChange.bind(this)}
                            activeContainerStyle={style.activeCom}
                            inactiveContainerStyle={style.inactiveCom}
                            activeTextStyle={style.activeText}
                            inactiveTextStyle={style.inactiveText} />
                    </View>

                    <View style={[style.bg_view, {height: 45, flexDirection: 'row', alignItems: 'center'}]}>
                        <Text style={{fontSize: 15, marginLeft: 15}}>Become our favourite merchant</Text>
                        <TouchableOpacity onPress={() => this.actionAlert()}>
                            <Image source={ require('../resource/ic_verify.png') } style={{width: 15, height: 15, marginLeft: 5}}/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.actionEmail()} style={{height: 25, backgroundColor: color.navigation_bg, borderRadius: 15, alignItems: 'center', justifyContent: 'center', marginLeft: 10}}>
                            <Text style={{color: color.white, fontSize: 11, width: 65, textAlign: 'center', textAlignVertical: 'center'}}>Apply Now</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={[style.bg_view]}>
                        <Text style={[style.label]}>My services</Text> 
                        <Text style={[style.sub_label]}>Total experience</Text> 
                        <View style={[style.input_view, {borderRadius: 22, backgroundColor: 'white'}]}>
                            <ModalDropdown ref="dropdown_2"
                                defaultValue={(this.state.total_experience !== null) ? this.state.total_experience : "<1 year"}
                                style={style.dropdown_2}
                                textStyle={[style.dropdown_2_text]}
                                dropdownStyle={[style.dropdown_2_dropdown, {height: (40 * this.state.experience.length) + 3}]}
                                options={this.state.experience}
                                renderButtonText={(rowData) => this._dropdown_2_renderButtonText(rowData)}
                                renderRow={this._dropdown_2_renderRow.bind(this)} />
                        </View>

                        <Text style={[style.sub_label]}>Description</Text> 
                        <Text style={{fontSize: 12, color: 'grey', marginLeft: 25, marginTop: 5}}>(Please do not include your contact number, email or mobile number. Repeat violations may lead to permanent account suspension.)</Text> 
                        <View style={[style.input_view, {height: 100, marginBottom: 10}]}>
                            <TextInput style={[{flex: 1, fontSize: fontSize.small, marginLeft: 10, marginTop: 5, textAlignVertical: 'top'}]}
                                underlineColorAndroid = "transparent"
                                placeholder = "Type here"
                                placeholderTextColor = {color.input_hold_color}
                                autoCapitalize = "none"
                                multiline={true}
                                onChangeText = {(notes) => this.setState({ notes: notes })}
                                value={this.state.notes} />
                        </View>
                    </View>

                    <View style={{flexDirection: 'column', marginTop: 10, width: windowWidth - 30, borderRadius: 5, marginLeft: 15}}>
                        <Text style={style.label}>Photos of your previous work</Text>              

                        <View style={[style.sub_view, {marginBottom: 20}]}>
                            <View style={{flexDirection: 'row', marginTop: 15}}>
                                <TouchableOpacity onPress={() => this.chooseFile()}>
                                    {(this.state.filePath.length > 0) ?
                                        <Image source={ {uri: this.state.filePath[0].uri} } style={style.photo_view}/> :
                                        <Image source={ require('../resource/avatar.png') } style={style.photo_view}/> }
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.chooseFile()}>
                                    {(this.state.filePath.length > 1) ?
                                        <Image source={ {uri: this.state.filePath[1].uri} } style={[style.photo_view, {marginLeft: 10}]}/> :
                                        <Image source={ require('../resource/avatar.png') } style={[style.photo_view, {marginLeft: 10}]}/> }
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.chooseFile()}>
                                    {(this.state.filePath.length > 2) ?    
                                        <Image source={ {uri: this.state.filePath[2].uri} } style={[style.photo_view, {marginLeft: 10}]}/> :
                                        <Image source={ require('../resource/avatar.png') } style={[style.photo_view, {marginLeft: 10}]}/> }
                                </TouchableOpacity>
                            </View>
                        </View> 
                    </View>

                    <TouchableOpacity onPress={() => this.actionSave()}>
                        <View style={{marginLeft: 25, marginBottom: 25}}>
                            <Button title={"Save"}/> 
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
        marginTop: 10, 
        fontSize: 15, 
        color: color.top_up, 
        marginLeft: 15
    },
    sub_label: {
        marginTop: 10, 
        fontSize: 13, 
        color: color.top_up, 
        marginLeft: 25, 
        opacity: .7
    },
    input_view: {
        height: 45, 
        width: windowWidth - 60, 
        marginTop: 10, 
        borderRadius: 22, 
        backgroundColor: 'white', 
        marginLeft: 15
    },
    bg_view: {
        width: windowWidth - 30, 
        backgroundColor: color.grey, 
        alignSelf: 'center', 
        marginTop: 10, 
        borderRadius: 5,
    },
    sub_view: {
        width: windowWidth - 50,
        marginLeft: 25
    },
    dropdown_2: {
        width: windowWidth - 60,
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
        width: windowWidth - 60,
        marginTop: 6,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: color.white,
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
    photo_view: {
        width: 75, 
        height: 75, 
        borderRadius: 37.5
    }
});