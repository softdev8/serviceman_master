import React, { Component } from 'react';
import { View, TouchableOpacity, Text, Platform, StyleSheet, Image } from 'react-native';

import { color } from "../source/styles/theme"
import Button from "./Button";

export default class NoInternet extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        
        return (
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <Image style={{width: 161, height: 109}} source={ require("../resource/ic_no_internet.png") }/>
                <Text style={{height: 25, color: color.title_color, marginTop: 25, textAlign: 'center', fontSize: 20, fontWeight: 'bold'}}>No Network Connection</Text>

                <TouchableOpacity onPress={() => this.actionAllowLocation(selectedFilter.toString())} style={{position: 'absolute', bottom: 30}}>
                    <Button title={"RELOAD THIS PAGE"}/> 
                </TouchableOpacity>
            </View>
        );
    }
}

