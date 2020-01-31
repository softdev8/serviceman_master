import React, {Component} from 'react';
import {View, Text, Image, TouchableOpacity, FlatList, NetInfo, AsyncStorage, Modal} from 'react-native';

import { styles, color, windowWidth, fontSize } from "../../styles/theme"

import NavigationBar from "../../../components/NavigationBar";
import MyPostItem from "../../../components/MyPostItem";

import { NavigationEvents } from 'react-navigation';
import Loading from 'react-native-whc-loading'

import { App } from "../../global"

export default class MyPost extends Component {

    constructor(props) {
        super(props);

        this.state = {
            postList: [],
            modalVisible: false,
            offset: 0,
            count: 0
        }
    }

    static navigationOptions = {
        header: null
    }

    async getMyPostList(isFirst) {

        var user_id = await AsyncStorage.getItem("user_id");
        console.log("user_id: " + user_id);

        if (user_id === null || user_id === "") {
            App.landing_page = "MyPost"
            this.props.navigation.navigate('Login')

        } else {

            if (isFirst) {
                this.setState({
                    postList: [],
                    offset: 0
                })
            }

            this.refs.loading.show();  

            console.log(App.api_link);

            await fetch(`${App.api_link}my-posts`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: user_id.toString(),
                    offset: this.state.offset
                })
                }).then((response) => response.json())
                .then((responseJson) => {
                    
                    this.refs.loading.close();

                    console.log("MyPost-List:", responseJson);

                    if (responseJson.status == "success") {

                        this.setState({
                            postList: this.state.offset === 0 ? responseJson.data : [...this.state.postList, ...responseJson.data],
                            count: responseJson.data.length
                        })
                    }
                })
                .catch((error) => {
                    console.error(error);

                    this.refs.loading.close();
            });
        }
    }

    pushScreen = (item, index) => {
        this.props.navigation.navigate('PostDetails', {post_id: item.post_id, status: 1})
    }

    handleLoadMore = () => {
        if (this.state.count == 10) {
            this.setState({
                offset: this.state.offset + 1
            }, () => {
                this.getMyPostList(false);
            });    
        }        
    };

    render() {

        return (
            <View style={styles.container}>
                <NavigationEvents
                     onWillFocus={payload => this.getMyPostList(true)} />

                <NavigationBar title={"My Posts"} img={require("../../../resource/ic_menu.png")} width={26} height={22} navigation={this.props.navigation} index={0} />
                
                <FlatList
                    data={this.state.postList}
                    keyExtractor={(item, index) => item.index}
                    renderItem={({item, index}) => 
                        <TouchableOpacity onPress={() => this.pushScreen(item, index)}>
                            <MyPostItem item={item} post={1}/>
                        </TouchableOpacity>
                    }
                    onEndReached={this.handleLoadMore}
                    onEndReachedThreshold={0}
                />

                <Loading ref="loading"/>
            </View>
        )
    }
}

