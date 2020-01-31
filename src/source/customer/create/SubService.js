import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, AsyncStorage} from 'react-native';

import { styles, color, windowWidth } from "../../styles/theme"

import NavigationBar from "../../../components/NavigationBar";

import { NavigationEvents } from 'react-navigation';
import Loading from 'react-native-whc-loading'

import { App } from "../../global"

export default class SubService extends Component {

    constructor(props) {
        super(props);

        this.state = {
            items: [],
        }
    }

    renderItem(item, index) {
        return (
            <TouchableOpacity onPress={() => this.pushScreen(item.id)}>
                <View style={{flexDirection: 'row', backgroundColor: color.cell_bg, height: 40, alignItems: 'center', marginBottom: 10}}>
                    <Text style={{flex: 1, color: color.title_color, fontSize: 14, marginLeft: 15}}>{item.name}</Text>                            
                    <Image source={ require("../../../resource/ic_arrow_right.png") } style={{width: 10, height: 17, marginRight: 15}}/>
                </View>
            </TouchableOpacity>
        );
    }

    async getSubServiceList() {

        var serviceId = await AsyncStorage.getItem("serviceId");

        console.log("ServiceId: ", serviceId);

        this.refs.loading.show();  

        await fetch(`${App.api_link}sub-services`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: serviceId
            })
            }).then((response) => response.json())
            .then((responseJson) => {
                
                this.refs.loading.close();

                console.log("Sub Service-List:", responseJson);

                if (responseJson.status == "success") {

                    this.setState({
                        items: responseJson.data
                    })
                }
            })
            .catch((error) => {
                console.error(error);

                this.refs.loading.close();
        });
    }

    pushScreen = (sub_serviceId) => {
        AsyncStorage.setItem('subServiceId', sub_serviceId);

        this.props.navigation.navigate('DateTime')
    }

    render() {

        let listPages = this.state.items.map((item, index) => {
            return this.renderItem(item, index);
        });            

        return (
            <View style={styles.container}>
                <NavigationEvents
                     onWillFocus={payload => this.getSubServiceList()} />

                <NavigationBar title={"ServiceMan"} img={require("../../../resource/ic_back.png")} width={20} height={16} index={1} navigation={this.props.navigation} />
                
                <Text style={{width: windowWidth, height: 25, color: color.title_color, marginTop: 25, textAlign: 'center', fontSize: 20, fontWeight: 'bold'}}>I want to book a service for...</Text>

                <View style={{width: windowWidth, marginTop: 30}}>
                    {listPages}
                </View>

                <Loading ref="loading"/>
            </View>
        )
    }


}
