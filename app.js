var map = L.map('map').setView([23.788212, 90.399971], 13);

    var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {maxNativeZoom: 19, 
    maxZoom: 20 });

    var barikoi = L.tileLayer('https://travel.map.barikoi.com/styles/barikoi/{z}/{x}/{y}.png?key=NDMwMjo0WFFXS1FNM1Qw');

    /*L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'}).addTo(map);
    */
    
    var CyclOSM = L.tileLayer('https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png', {
	maxZoom: 20}).addTo(map);

    var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash;'
    });

    var baseMaps = {
        "CycleOsm":CyclOSM,
        "Barikoi Map":barikoi,
        "OpenStreetMap": osm,
        
        "satelite": Esri_WorldImagery,
      
    //"crime": crimes
    
    };

    var layerControl = L.control.layers(baseMaps).addTo(map);

    // var circle = L.geofence.circle([23.788212, 90.399971], 500, {
    //     fillColor: '#ff0000',
    //     fillOpacity: 0.2,
    //     stroke: false
    // }).addTo(map);

    // circle.on('enter', function () {
    //     alert('You have entered the geofenced area');
    // });

    // circle.on('exit', function () {
    //     alert('You have exited the geofenced area');
    // });

    

   
    var ignitor = 0;

    var desMarker;
    var currentLocationMarker;

    var circle;




    var current_lat, current_lng;
    var e_lat, e_lng;

    var initialMarker;

    navigator.geolocation.getCurrentPosition((position)=>{
       initialMarker = L.marker([position.coords.latitude, position.coords.longitude]).addTo(map);
       map.setView([position.coords.latitude, position.coords.longitude]);
    }, (err)=>{
        console.log("hello");
    });



    function getLocation() {
  // Check if geolocation is supported
        if (navigator.geolocation) {
            // Request permission to access user's location
            navigator.permissions.query({name:'geolocation'}).then(function(result) {
            if (result.state === 'granted') {
                // If permission is granted, continuously watch user's position
                console.log("granted");
                navigator.geolocation.watchPosition(success, error);
            } else if (result.state === 'prompt') {
                // If permission is not granted or denied, prompt user to grant permission
                navigator.geolocation.getCurrentPosition(success, error);
            } else if (result.state === 'denied') {
                // If permission is denied, show an error message to the user
                console.log('Geolocation permission denied');
            }
            });
        } else {
            // If geolocation is not supported, show an error message to the user
            console.log('Geolocation is not supported by this browser');
        }
    }

    /*
    function success(position) {
        // Update user's position on the map
    }

    function error(error) {
        // Show an error message to the user
    }*/

    // Call getLocation() function to request permission and watch user's position
    //getLocation();


    // function getLocation() {
    //     navigator.geolocation.getCurrentPosition(success, error);
    // }



    function success(pos){
        //let lat, lng;
        current_lat = pos.coords.latitude;
        console.log("current latitude: " + current_lat);
        
        current_lng = pos.coords.longitude;
        console.log("current longtitude: "+current_lng);

        const accuracy = pos.coords.accuracy;
        //console.log(accuracy);

        console.log("ignitor: "+ignitor);

        if(initialMarker){
            map.removeLayer(initialMarker);
        }

        if(currentLocationMarker){
            console.log("marker are there");
            map.removeLayer(currentLocationMarker);
        }

        //L.map('map').setView([23.788212, 90.399971], 13)
       
        currentLocationMarker = L.marker([current_lat, current_lng]).addTo(map);

        if(circle){
            circle.remove();
        }

        circle = L.circle([current_lat, current_lng], {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.1,
            radius: 150
        }).addTo(map);

        //var popup = L.popup();
        

        if(ignitor == 1){
            var dis = distance(current_lat, e_lat, current_lng, e_lng);
            console.log("current distance:"+ dis);

            //popup.setLatLng([current_lat, currnt_lng]).setContent("distance between you and destination"+dis).openOn(map);

            if(dis<1){
                var alertSound = new Audio('chainsaw-04.mp3');
                alertSound.play();
            }
           
        }
            
        

        /*
        if(marker){
            map.removeLayer(marker);
            // map.removeLayer(circle);
        }
        marker = L.marker([lat, lng]).addTo(map);*/
        //circle = L.circle([lat, lng], {radius : accuracy}).addTo(map);

        //map.fitBounds(circle.getBounds())


    }

    function error(err){
        if(err.code === 1){
            alert("please allow location access");
        }
        else{
            alert("can't get location");
        }


    }

    map.on('click', onMapClick);

    var desIcon = L.icon({
    iconUrl: 'icons/desicon2.png',
    //shadowUrl: 'leaf-shadow.png',

    iconSize:     [18, 50], // size of the icon
    shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    });

    function onMapClick(e) {
        
        e_lat = e.latlng.lat;
        e_lng = e.latlng.lng;

        if(desMarker){
            map.removeLayer(desMarker);
            // map.removeLayer(circle);
        }
        //alert("You clicked the map at " + e.latlng);
        desMarker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);

        ignitor = 1;

        


    }

    function distance(lat1,
                     lat2, lon1, lon2)
    {
   
        // The math module contains a function
        // named toRadians which converts from
        // degrees to radians.
        lon1 =  lon1 * Math.PI / 180;
        lon2 = lon2 * Math.PI / 180;
        lat1 = lat1 * Math.PI / 180;
        lat2 = lat2 * Math.PI / 180;
   
        // Haversine formula
        let dlon = lon2 - lon1;
        let dlat = lat2 - lat1;
        let a = Math.pow(Math.sin(dlat / 2), 2)
                 + Math.cos(lat1) * Math.cos(lat2)
                 * Math.pow(Math.sin(dlon / 2),2);
               
        let c = 2 * Math.asin(Math.sqrt(a));
   
        // Radius of earth in kilometers. Use 3956
        // for miles
        let r = 6371;
   
        // calculate the result
        return(c * r);
    }

    console.log("------------------------");


    setInterval(getLocation, 34000);

    

   

    // var popup = L.popup();

    // function onMapClick2(e) {
    //     popup
    //         .setLatLng(e.latlng)
    //         .setContent("You clicked the map at " + e.latlng.toString())
    //         .openOn(map);
    // }

    // map.on('click', onMapClick2);