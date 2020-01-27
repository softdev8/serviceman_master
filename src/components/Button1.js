import React, { Component } from 'react';
import { View, TouchableOpacity, Text, Platform, StyleSheet, Image } from 'react-native';

import { color, windowWidth, navbarHeight, fontSize } from "../source/styles/theme"
import LinearGradient from 'react-native-linear-gradient';

export default class Button1 extends Component {
    constructor(props) {
        super(props);
    }

    onAction() {
        
        if (this.props.callback) {
            this.props.callback();
        }
    }

    render() {
        
        const { title, status } = this.props;

        return (
            <View>
                {(status == 1) ?
                    <LinearGradient start={{x: 0, y: 0}} end={{x: 2, y: 0}} colors={[color.btn_bg_gradient, color.btn_bg_gradient1]} style={[styles.linearGradient, styles.view_size, { marginLeft: 10}]}>
                        <Text style={{paddingLeft: 10, paddingRight: 10, fontSize: 14, color: color.white}}>{title}</Text>
                    </LinearGradient> :
                    <View style={[styles.linearGradient, styles.view_size, {backgroundColor: color.white, marginLeft: 10}]}>
                        <Text style={{paddingLeft: 10, paddingRight: 10, fontSize: 14, color: color.top_up}}>{title}</Text>
                    </View>}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    view_size: {
        height: 26
    },
    linearGradient: {
        borderRadius: 7, 
        alignItems: 'center',
        justifyContent: 'center'
    },
});