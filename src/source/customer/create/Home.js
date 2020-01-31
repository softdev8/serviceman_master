import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, AsyncStorage, NetInfo, Modal} from 'react-native';

import { styles, color, windowWidth } from "../../styles/theme"

import NavigationBar from "../../../components/NavigationBar";
import GridView from 'react-native-super-grid';
import HomeItem from "../../../components/HomeItem";
import NoInternet from "../../../components/NoInternet";

import { NavigationEvents } from 'react-navigation';
import Loading from 'react-native-whc-loading'
import Button from "../../../components/Button";

import { App } from "../../global"

export default class Home extends Component {

    constructor(props) {
        super(props);

        this.state = {
            items: [],
            modalVisible: false
        }
    }

    static navigationOptions = {
        header: null
    }

    componentDidMount() {
        NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectionChange);

        NetInfo.isConnected.fetch().done(
            (isConnected) => { this.setState({ status: isConnected }); }
        );        
    }     
    
    componentWillUnmount() {
        NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectionChange);
    }

    handleConnectionChange = (isConnected) => {
        this.setState({ status: isConnected });
        console.log('IS CONNECTED:', this.state.status);
    
        if (this.state.status) {
            this.setState({modalVisible : false})
            // this.getServiceList()
        } else {
            this.setState({modalVisible : true})
        }
    }

    async getServiceList() {

        this.refs.loading.show();  

        await fetch(`${App.api_link}service-list`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
            }).then((response) => response.json())
            .then((responseJson) => {
                
                this.refs.loading.close();

                console.log("Service-List:", responseJson);

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

    pushScreen = (serviceId) => {

        AsyncStorage.setItem('serviceId', serviceId);

        this.props.navigation.navigate('SubService')
    }

    render() {

        return (
            <View style={styles.container}>
                <NavigationEvents
                     onWillFocus={payload => this.getServiceList()} />

                <NavigationBar title={"ServiceMan"} img={require("../../../resource/ic_menu.png")} width={26} height={22} navigation={this.props.navigation} index={0} />
                
                <View style={{alignItems: 'center'}}>
                    <Text style={{width: 160, height: 25, color: color.title_color, marginTop: 25, textAlign: 'center', fontSize: 20, fontWeight: 'bold'}}>I am looking for...</Text>

                    {(this.state.items.length !== 0) ?
                        <View style={style.gridWrap}>
                            <GridView
                                showsVerticalScrollIndicator={false}
                                itemDimension={windowWidth / 3 - 20}
                                items={this.state.items}
                                renderItem={({item, index})  => (
                                    <TouchableOpacity onPress={() => this.pushScreen(item.id)}>
                                        <HomeItem title={item.name} thumb_img={item.image} />
                                    </TouchableOpacity>
                                )}/>
                        </View> : null }
                </View>

                <Modal animationType='fade' transparent={true} visible={this.state.modalVisible} >
                    <View style={{ flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center'}}>
                        <Image style={{width: 161, height: 109, marginTop: -75}} source={ require("../../../resource/ic_no_internet.png") }/>
                        <Text style={{height: 25, color: color.title_color, marginTop: 25, textAlign: 'center', fontSize: 20, fontWeight: 'bold'}}>No Network Connection</Text>
                    </View>
                </Modal>

                <Loading ref="loading"/>
            </View>
        )
    }


}
const style = StyleSheet.create({
    gridWrap: {
        marginTop: 20,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 170
    },
});