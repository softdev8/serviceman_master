import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList, Platform, AsyncStorage, PermissionsAndroid, Modal, Image} from 'react-native';

import { styles, color, windowWidth, fontSize } from "../../styles/theme"

import NavigationBar from "../../../components/NavigationBar";
import MyPostItem from "../../../components/MyPostItem";
import Button from "../../../components/Button";

import MultiSelectView from 'react-native-multiselect-view';

import { NavigationEvents } from 'react-navigation';
import Loading from 'react-native-whc-loading'

import { App } from "../../global"

var selectedFilter = []
var interest = [
    'All', 'Home Cleaner', 'Professional...', 'Air-Con', 'Car', 'Pet Service', 'Home Chef', 'Movers', 'Telemarketer /...', 'Handyman', 'Electrician', 'Plumber', 'Mother / Elder...', 'Sports Coach', 'Education & Tu...', 'Wedding & Beau...'
];
var interest1 = [];

export default class Search extends Component {

    constructor(props) {
        super(props);

        this.state = {
            searchList: [],
            modalVisible: false,
            isJobSetting: false,
            services: '',
            lat: null,
            long: null,
            offset: 0,
            filter: '',
            count: 0
        }
    }

    async getSearchServiceList(reload, filter) {

        console.log("Filter: " + filter);
        this.setState({
            offset: 0,
            searchList: []
        })

        var services = await AsyncStorage.getItem("services");

        if (reload) {
            selectedFilter = []
            App.isResaved = true

            if (services !== null && services !== "") {

                interest1 = ['All']
            
                var arrService = services.split(",")
                for (let index = 0; index < arrService.length; index++) {
                    interest1.push(interest[arrService[index]]);
                }
                
                this.setState({ 
                    isJobSetting : true,
                    filter: services,
                })
            } else {
                this.setState({ 
                    isJobSetting : false,
                    filter: "" 
                })
            }    
        } else {
            App.isResaved = false
        }       
        
        if (Platform.OS === "android") {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        'title': 'ServiceMan App',
                        'message': 'ServiceMan App access to your location '
                    }
                )
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    this.getGPSlocation(services, filter)
                } else {
                    console.log("location permission denied")
                    this.setState({
                        modalVisible: true
                    })
                }
            } catch (err) {
                alert(JSON.stringify(err))
            }
        } else {
            this.getGPSlocation(services, filter)
        }
    }

    async getGPSlocation(services) {

        if (services !== null && services !== "") {

            var lat = await AsyncStorage.getItem("job_location_latitude");
            var long = await AsyncStorage.getItem("job_location_longitude");

            this.setState({
                lat: lat,
                long: long
            }, () => {
                this.getServiceRequestList()
            });

        } else {
            this.watchID = navigator.geolocation.getCurrentPosition((position) => {
                var lat = parseFloat(position.coords.latitude)
                var long = parseFloat(position.coords.longitude)
            
                console.log("Current Location:"+lat + " " + long);
                
                this.setState({
                    lat: lat,
                    long: long
                }, () => {
                    this.getServiceRequestList()
                });
            }, 
            (error) => alert(JSON.stringify(error)),
            { enableHighAccuracy: false, timeout: 20000, maximumAge: 10000})
        }
    }

    getServiceRequestList() {

        const {filter, lat, long, offset} = this.state
        this.refs.loading.show(); 

        console.log(filter + "-" + lat + long + "-" + offset);
        
        let details = {
            'services': filter,
            'latitude': lat,
            'longitude': long,
            'offset': offset
        };
    
        let formBody = [];
        for (let property in details) {
            let encodedKey = encodeURIComponent(property);
            let encodedValue = encodeURIComponent(details[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");

        fetch(`${App.api_link}search-service-requests`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formBody
            }).then((response) => response.json())
            .then((responseJson) => {
                
                this.refs.loading.close();

                console.log("Search_Service_Requests:", responseJson);

                if (responseJson.status == "success") {
                    
                    if (responseJson.data) {
                        this.setState({
                            searchList: offset === 0 ? responseJson.data : [...this.state.searchList, ...responseJson.data],
                            count: responseJson.data.length
                        })
                    }
                }
            })
            .catch((error) => {
                console.error(error);

                this.refs.loading.close();
        });
    }

    async onSelectionStatusChange(status, index) {
        console.log(status, index);

        App.isResaved = false
        const {isJobSetting} = this.state

        var services = await AsyncStorage.getItem("services");
        // console.log("SelectFitler: " + selectedFilter);

        if (index !== 0) {  //Not All
            if (status) {
                if (!isJobSetting) {
                    selectedFilter.push(index)
                } else {
                    selectedFilter.push(interest.indexOf(interest1[index]))
                }
            } else {
                var item_index = selectedFilter.indexOf(index)
                
                if (item_index === -1) {
                    selectedFilter.splice(item_index, 1)
                }
            }

            console.log("SelectFitler: " + selectedFilter);

            this.setState({
                offset: 0,
                searchList: [],
                filter: (selectedFilter.toString() == "") ? "-1" : selectedFilter.toString()
            }, () => {
                this.getServiceRequestList()
            })
            
        } else {    //selected All

            selectedFilter = []
            
            if (!isJobSetting) {
                this.setState({
                    offset: 0,
                    filter: ""
                }, () => {
                    this.getServiceRequestList()
                })
            } else {
                this.setState({
                    offset: 0,
                    filter: services.toString()
                }, () => {
                    this.getServiceRequestList()
                })
            }    
        }
    }

    pushScreen = async (item, index) => {
        var user_id = await AsyncStorage.getItem("user_id");
        console.log("user_id:" + user_id);
        this.props.navigation.navigate('JobDetails', {item: item, login_userId: user_id, page: "Search"})
    }

    async actionAllowLocation() {
        this.setState({
            modalVisible: false
        }, () => {
            this.getSearchServiceList(false, this.state.filter)
        })        
    }

    handleLoadMore = () => {
        if (this.state.count == 10) {
            this.setState({
                offset: this.state.offset + 1
            }, () => {
                this.getServiceRequestList();
            });
        }
    };

    render() {

        const {isJobSetting} = this.state

        console.log("IsJobSettings: " + isJobSetting);

        return (
            <View style={{flex: 1, backgroundColor: 'white'}}>
                <NavigationEvents
                     onWillFocus={payload => this.getSearchServiceList(true, "")} />

                <NavigationBar title={"Search Jobs"} img={require("../../../resource/ic_menu.png")} width={26} height={22} navigation={this.props.navigation} index={0} />
                
                <View style={[{backgroundColor: color.merchant_profile_bg}]}>
                    <MultiSelectView
                        page={"search"}
                        ref='list1'
                        reload={App.isResaved}
                        selected={""}
                        data={(!isJobSetting) ? interest : interest1}
                        onSelectionStatusChange={this.onSelectionStatusChange.bind(this)}
                        activeContainerStyle={style.activeCom}
                        inactiveContainerStyle={style.inactiveCom}
                        activeTextStyle={style.activeText}
                        inactiveTextStyle={style.inactiveText} />
                </View> 
                
                <FlatList
                    // showsVerticalScrollIndicator={false}
                    data={this.state.searchList}
                    keyExtractor={(item, index) => item.index}
                    renderItem={({item, index}) => 
                        <TouchableOpacity onPress={() => this.pushScreen(item, index)}>
                            <MyPostItem item={item} post={0}/>
                        </TouchableOpacity>
                    }
                    onEndReached={this.handleLoadMore}
                    onEndReachedThreshold={0}
                />
                
                <Modal animationType='fade' transparent={true} modalDidClose={this.modalDidClose} visible={this.state.modalVisible} onRequestClose={() => this.setModalVisible(false)} >
                    <View style={{ flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center'}}>
                        <Image source={ require('../../../resource/ic_no_internet.png') } style={{width: 125, height: 85}} />
                        <Text style={{marginTop: 10, width: 150, textAlign: 'center'}}>Allow ServiceMan to access your location?</Text>

                        <TouchableOpacity onPress={() => this.actionAllowLocation(selectedFilter.toString())} style={{position: 'absolute', bottom: 30}}>
                            <Button title={"Re Try"}/> 
                        </TouchableOpacity>
                    </View>                    
                </Modal>
                
                <Loading ref="loading"/>
            </View>
        )
    }


}
const style = StyleSheet.create({
    activeCom: {
        backgroundColor: color.navigation_bg,
    },
    inactiveCom: {
        backgroundColor: 'white',
    },
    activeText: {
        color: color.white,
    },
    inactiveText: {
        color: color.top_up,
    },
});