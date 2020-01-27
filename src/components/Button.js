import React, { Component } from 'react';
import { View, TouchableOpacity, Text, Platform, StyleSheet, Image } from 'react-native';

import { color, windowWidth, navbarHeight, fontSize } from "../source/styles/theme"
import LinearGradient from 'react-native-linear-gradient';

export default class Button extends Component {
    constructor(props) {
        super(props);
    }

    onAction() {
        
        if (this.props.callback) {
            this.props.callback();
        }
    }

    render() {
        
        const { title } = this.props;

        return (
            <LinearGradient start={{x: 0, y: 0}} end={{x: 2, y: 0}} colors={[color.btn_bg_gradient, color.btn_bg_gradient1]} style={[styles.linearGradient, styles.view_size]}>
                <Text style={styles.label}>{title}</Text>
            </LinearGradient>
        );
    }
}

const styles = StyleSheet.create({
    view_size: {
        height: 45,
        width: windowWidth - 50
    },
    linearGradient: {
        borderRadius: 22, 
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 25
    },
    label: {
        fontSize: fontSize.large, 
        color: 'white',
        textAlign: 'center',
    },
});