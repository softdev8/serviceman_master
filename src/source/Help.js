import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Linking, AsyncStorage} from 'react-native';

import { styles, color, windowWidth } from "./styles/theme"

import NavigationBar from "../components/NavigationBar";
import { Email } from 'react-native-openanything';
import {App} from "./global"

export default class Help extends Component {

    constructor(props) {
        super(props);
    }

    actionGuide = (index) => {
        this.props.navigation.navigate('Guide', {index: index})
    }

    actionTerms = () => {
        Linking.canOpenURL(App.terms_link).then(supported => {
            if (supported) {
              Linking.openURL(App.terms_link);
            } else {
              console.log("Don't know how to open URI: " + App.terms_link);
            }
        });
    }

    actionContact = async () => {

        let customer_id = await AsyncStorage.getItem("user_id")
        let username = await AsyncStorage.getItem("name")

        let supportId = App.supportID

        Email("contact@servicemanapp.com", "Contact Customer Support " + supportId, "User Id: " + customer_id + "\nUser Name: " + username + "\n\n", "contact@servicemanapp.com", "contact@servicemanapp.com");

        App.supportID = supportId + 1
    }

    render() {

        return (
            <View style={styles.container}>
                <NavigationBar title={"Help & Support"} img={require("../resource/ic_menu.png")} width={26} height={22} navigation={this.props.navigation} index={0} />
                
                <TouchableOpacity onPress={() => this.actionGuide(0)}>
                    <View style={[styles.view_size, {backgroundColor: color.accept_btn_bg, borderRadius: 22, justifyContent: 'center', marginTop: 25}]}>
                        <Text style={styles.btn_label}>Customer User Guide</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => this.actionGuide(1)}>
                    <View style={[styles.view_size, {backgroundColor: color.complete_btn_bg, borderRadius: 22, justifyContent: 'center', marginTop: 15}]}>
                        <Text style={styles.btn_label}>Merchant User Guide</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => this.actionTerms()}>
                    <View style={[styles.view_size, {backgroundColor: color.open_btn_bg, borderRadius: 22, justifyContent: 'center', marginTop: 15}]}>
                        <Text style={styles.btn_label}>Terms & Conditions</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => this.actionContact()}>
                    <View style={[styles.view_size, {backgroundColor: color.contact_us_btn_bg, borderRadius: 22, justifyContent: 'center', marginTop: 15}]}>
                        <Text style={styles.btn_label}>Contact Us</Text>
                    </View>
                </TouchableOpacity>
                
            </View>
        )
    }


}
const style = StyleSheet.create({
    
});