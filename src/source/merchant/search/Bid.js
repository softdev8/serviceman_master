import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, TextInput, AsyncStorage, Alert, TouchableHighlight, ScrollView} from 'react-native';

import { styles, color, windowWidth, fontSize } from "../../styles/theme"

import NavigationBar from "../../../components/NavigationBar";
import Button from "../../../components/Button"
import ModalDropdown from "../../../components/ModalDropdown";

import { NavigationEvents } from 'react-navigation';
import Loading from 'react-native-whc-loading'

import { App } from "../../global"

export default class Bid extends Component {

    constructor(props) {
        super(props);

        this.state = {
            amount: '',
            user_id: '',
            fee: ["Labour fee", "Consult fee", "Material fee", "Labour & material fee", "Free consult", "Free meetup"],
            selectedFee: "Labour fee",
            notes: ""
        }
    }

    async getInit() {
        var user_id = await AsyncStorage.getItem("user_id");
        console.log("User_id: ", user_id);

        this.setState({
            user_id: user_id
        })
    }

    static login(navigation, post_id, amount, fee, notes) {
        App.landing_page = "JobSetting"
        App.sub_langing_page = "Search"
        
        App.post_id = post_id
        App.amount = amount
        App.fee = fee
        App.notes = notes

        navigation.navigate('Login')
    }

    static jobSetting(navigation, post_id, amount, fee, notes) {
        App.sub_langing_page = "Search"

        App.post_id = post_id
        App.amount = amount
        App.fee = fee
        App.notes = notes

        navigation.navigate("JobSetting")   
    }

    static async actionPost(navigation, post_id, user_id, amount, fee, notes) {

        if(isNaN(amount.replace(",", '')))
        {
            Alert.alert("Sorry! Invalid bid amount.");
        }
        else
        {
            if (user_id === null || user_id === "") {

                Alert.alert(
                    'Login',
                    'Sorry! please login to submit bid.',
                    [
                    {text: 'Yes', onPress: () => Bid.login(navigation, post_id, amount.replace(",", ''), fee, notes) },
                    ],
                    { cancelable: false }
                ) 
            } else {

                var jobsetting_services = await AsyncStorage.getItem("services");
                console.log("jobsetting_services: " + jobsetting_services);

                if (jobsetting_services == "" || jobsetting_services == null) {    //not job setting
                    
                    Alert.alert(
                        'Job Setting',
                        'Sorry! please set up your job setting to submit bid.',
                        [
                        {text: 'Yes', onPress: () => Bid.jobSetting(navigation, post_id, amount.replace(",", ''), fee, notes) },
                        ],
                        { cancelable: false }
                    ) 

                } else {
                    
                    await fetch(`${App.api_link}post-bid`, {
                        method: 'POST',
                        headers: {                              
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            post_id: post_id,
                            user_id: user_id,
                            amount: amount.replace(",", ''),
                            fee: fee,
                            notes: notes                                                                                                  
                        })
                        }).then((response) => response.json())
                        .then((responseJson) => {
                            
                            console.log("Post Bid: ", responseJson);

                            if (responseJson.status == "success") {
                                navigation.navigate('BidSuccess')                    
                            } else {
                                alert(responseJson.message);
                            }
                        })
                        .catch((error) => {
                            console.error(error);
                    });
                }
            }
        }
    }

    _dropdown_2_renderButtonText(rowData) {
        console.log("index", this.state.fee.indexOf(rowData));
        console.log("selectedFee: ", this.state.fee[this.state.fee.indexOf(rowData)]);

        this.setState({
            selectedFee: this.state.fee[this.state.fee.indexOf(rowData)]
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

    render() {

        const {navigation} = this.props
        let post_id = navigation.state.params.post_id
        let price = navigation.state.params.price

        return (
            <View style={{flex: 1, backgroundColor: color.white}}>
                <NavigationEvents
                     onDidFocus={payload => this.getInit()} />

                <NavigationBar title={"Bid Now"} img={require("../../../resource/ic_back.png")} width={20} height={16} index={1} navigation={this.props.navigation} />

                <ScrollView>
                    <View style={{width: 170, height: 75, backgroundColor: color.cell_bg, borderRadius: 7, marginTop: 20, alignItems: 'center', justifyContent: 'center', alignSelf: 'center'}}>
                        <Text style={{fontSize: 15}}>Customer Budget</Text>
                        <Text style={{fontSize: 25, color: color.navigation_bg, fontWeight: 'bold', marginTop: 5}}>{(price > 0) ? `$${price}` : "-"}</Text>
                    </View>

                    <Text style={{fontSize: 15, marginTop: 25, marginLeft: 25}}>Your Bid Amount</Text>
                    
                    <View style={[styles.input_view, styles.view_size, {marginTop: 15, marginLeft: 25}]}>
                        <TextInput style={styles.text_input}
                            underlineColorAndroid = "transparent"
                            placeholderTextColor = {color.input_hold_color}
                            placeholder = {price}
                            autoCapitalize = "none"
                            keyboardType="numeric"
                            onChangeText = {(amount) => this.setState({ amount: amount })}
                            value={this.state.amount} />
                    </View>

                    <View style={[styles.input_view, styles.view_size, {marginTop: 15, alignSelf: 'center'}]}>
                        <ModalDropdown ref="dropdown_2"
                            defaultValue={"Labour fee"}
                            style={style.dropdown_2}
                            textStyle={[style.dropdown_2_text]}
                            dropdownStyle={[style.dropdown_2_dropdown, {height: (40 * this.state.fee.length) + 3}]}
                            options={this.state.fee}
                            renderButtonText={(rowData) => this._dropdown_2_renderButtonText(rowData)}
                            renderRow={this._dropdown_2_renderRow.bind(this)} />
                    </View>

                    <View style={{flexDirection: 'row', marginLeft: 26, marginTop: 15}}>
                        <Text style={[{flex: 1}, style.label]}>Additional notes (optional)</Text>
                        <Text style={[style.label, {marginRight: 26}]}>{this.state.notes.length}/100</Text>
                    </View>

                    <Text style={[style.label, {color: color.disable_btn_bg, marginLeft: 26, marginRight: 26}]}>Please do not include your contact number, email or mobile number. Repeat violations may lead to permanent account suspension.</Text>

                    <View style={{marginLeft: 25, marginTop: 5, width: windowWidth - 50, height: 75, borderRadius: 22, backgroundColor: color.grey}}>
                        <TextInput style={[{flex: 1, fontSize: fontSize.small, marginLeft: 10, marginTop: 5, textAlignVertical: 'top'}]}
                            underlineColorAndroid = "transparent"
                            placeholder = "Type here"
                            placeholderTextColor = {color.input_hold_color}
                            autoCapitalize = "none"
                            multiline={true}
                            maxLength={100}
                            onChangeText = {(notes) => this.setState({ notes: notes })}
                            value={this.state.notes} />
                    </View>
                    
                    <TouchableOpacity onPress={() => Bid.actionPost(this.props.navigation, post_id, this.state.user_id, (this.state.amount == "") ? price : this.state.amount, this.state.selectedFee, this.state.notes)}>
                        <View style={{marginLeft: 25}}>
                            <Button title={"Submit"} />
                        </View>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        )
    }
}

const style = StyleSheet.create({
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
        width: windowWidth - 50,
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
    }
});
