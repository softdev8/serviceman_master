import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

import { styles, color, windowWidth, fontSize } from "../../styles/theme"

import NavigationBar from "../../../components/NavigationBar";

export default class BidSuccess extends Component {

    constructor(props) {
        super(props);
    }

    actionSearch = () => {
        this.props.navigation.navigate('Search')
    }

    render() {

        return (
            <View style={styles.container}>
                <NavigationBar title={"Bid Success"} img={require("../../../resource/ic_back.png")} width={20} height={16} index={1} navigation={this.props.navigation} />

                <View style={{width: windowWidth - 50, height: 165, backgroundColor: color.cell_bg, borderRadius: 10, borderColor: color.alert_boder, borderWidth: 1.2, marginTop: 50}}>
                    <Text style={{fontSize: 15, marginTop: 25, marginLeft: 25, textAlign: 'center', color: color.top_up}}>Great! Your bid has been placed successfully.</Text>
                    <Text style={{fontSize: 15, marginTop: 15, textAlign: 'center', color: color.top_up}}>Continue to search more job?</Text>
                    <TouchableOpacity onPress={() => this.actionSearch()}>
                        <Text style={{fontSize: 15, marginTop: 25, textAlign: 'center', color: color.complete_btn_bg}}>OK</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }


}
