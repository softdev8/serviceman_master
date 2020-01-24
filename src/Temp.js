async getSearchServiceList(reload, filter) {

    console.log("Filter: " + filter);

    this.setState({
        filter: filter
    })

    var services = await AsyncStorage.getItem("services");

    if (reload) {
        if (services !== null && services !== "") {
            App.isResaved = true

            interest1 = ['All']
        
            var arrService = services.split(",")
            for (let index = 0; index < arrService.length; index++) {
                interest1.push(interest[arrService[index]]);
            }
            
            this.setState({ isJobSetting : true })
        } else {
            this.setState({ isJobSetting : false })
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
                this.getGPSlocation()
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
        this.getGPSlocation()
    }
}

async getGPSlocation() {

    const {filter} = this.state

    var services = await AsyncStorage.getItem("services");
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

            this.setState({
                searchList: responseJson.data
            })
        }
    })
    .catch((error) => {
        console.error(error);
        console.log("test");

        this.refs.loading.close();
    });
}

async onSelectionStatusChange(status, index) {
    console.log(status, index);

    App.isResaved = false
    const {isJobSetting} = this.state

    var services = await AsyncStorage.getItem("services");
    console.log("SelectFitler: " + selectedFilter);

    if (index !== 0) {  //Not All
        if (status) {
            if (!isJobSetting) {
                selectedFilter.push(index)
            } else {
                selectedFilter.push(interest.indexOf(interest1[index]))
            }
        } else {
            var item_index = selectedFilter.indexOf(index)
            if (item_index !== -1) {
                selectedFilter.splice(item_index, 1)
            }
        }

        this.setState({
            filter: selectedFilter.toString()
        }, () => {
            this.getServiceRequestList()
        })
        
    } else {    //selected All

        if (!isJobSetting) {
            this.setState({
                filter: ""
            }, () => {
                this.getServiceRequestList()
            })
        } else {
            this.setState({
                filter: services.toString()
            }, () => {
                this.getServiceRequestList()
            })
        }            
    }
}

pushScreen = (item, index) => {
    this.props.navigation.navigate('JobDetails', {item: item})
}

async actionAllowLocation(filter) {
    this.setState({
        modalVisible: false
    })

    this.getSearchServiceList(true, filter)
}