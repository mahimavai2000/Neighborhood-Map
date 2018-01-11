//Locations array to define all locations
var locations= [
{
	title: 'Statue of Liberty',
	img: '',
	location: {lat:40.689247, lng: -74.044502}	
},
{
	title: 'Empire State Buildeing',
	img: '',
	location: {lat:	40.748563, lng: -73.985746}
},
{
	title: 'Central Park',
	img: '',
	location: {lat:40.785091, lng: -73.968285}
},
{
	title: 'Brooklyn Bridge',
	img: '',
	location: {lat:40.706086, lng: -73.996864}
},
{
	title: 'Times Square',
	img: '',
	location: {lat:40.760262, lng: -73.993287}	
},
{
	title: 'One World Trade Center',
	img: '',
	location: {lat:40.713008, lng: -74.013169}
},
{
	title: 'Rockefeller Center',
	img: '',
	location: {lat:40.758740, lng: -73.978674}
},
{
	title: 'American Museum of Natural History',
	img: '',
	location: {lat:40.782045, lng: -73.971711}
},
{
	title: 'Bronx Zoo',
	img: '',
	location: {lat:40.850288, lng: -73.878611}
},
{
	title: 'Brooklyn Botanic Garden',
	img: '',
	location: {lat:40.667622, lng: -73.963191}
}
];
var map,marker,infoWindow;
var markers=[];

//Initiate the Map
function initMap(){
	//constructor to create a new map JS object.
       map= new google.maps.Map(document.getElementById('map'), {
        center: {lat:40.712775, lng: -74.005973},
        zoom: 12,
        //styles: styles        
       });

    //create InfoWindow instance
    var largeInfoWindow= new google.maps.InfoWindow();

    //create marker color change
    var markerDefaultIcon=makeMarkerIcon('0091ff');
    var highlightedIcon=makeMarkerIcon('FFFF24');

    //Create an Array to get all locations
    for(var i = 0;i < locations.length; i++) {
    	// Get the position from the location array.
        var position = locations[i].location;
        var title = locations[i].title;
        // Create a marker per location, and put into markers array.
        var marker = new google.maps.Marker({
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            icon: markerDefaultIcon,
            id: i
          });
        // Push the marker to our array of markers.
        markers.push(marker);

        //create LatLng bounds instance
        var bounds = new google.maps.LatLngBounds();

        // Extend the boundaries of the map for each marker and display the marker
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(map);
          bounds.extend(markers[i].position);
        }

        // Create an onclick event to open an infowindow at each marker.
        marker.addListener('click', function() {
            populateInfoWindow(this, largeInfoWindow);
          });

        //Create a listener for marker on mouseover highlighted icon.
          marker.addListener('mouseover', function(){
            this.setIcon(highlightedIcon);
          });

        //Create a listener for marker on mouseout default icon.
          marker.addListener('mouseout', function(){
            this.setIcon(markerDefaultIcon);
          });
    }
}

//Populate InfoWindow with title and Panorma image
function populateInfoWindow(marker,infoWindow) {

    // Check to make sure the infowindow is not already opened on this marker.
    if (infoWindow.marker != marker) {
    	infoWindow.marker = marker;            

    // Make sure the marker property is cleared if the infowindow is closed.
       	infoWindow.addListener('closeclick',function(){
     		infoWindow.setMarker = null;
        });

       	//Create Streetview service instance
        var streetViewService=new google.maps.StreetViewService();
        var radius=50;

        //Function for getting the streetview
        function getStreetView(data,status){

        	//If status is ok,get a panorama street view location,heading
            if (status===google.maps.StreetViewStatus.OK) {
              var nearStreetViewLocation=data.location.latLng;
              var heading=google.maps.geometry.spherical.computeHeading(nearStreetViewLocation, marker.position);
              infoWindow.setContent('<div>' + marker.title + '</div><div id="pano"></div>');
                var panoramaOptions = {
                  position: nearStreetViewLocation,
                  pov: {
                    heading: heading,
                    pitch: 30
                  }
                };

                //create Streetview panorama instance to display the Panorama
                var panorama=new google.maps.StreetViewPanorama(
                document.getElementById('pano'), panoramaOptions);
            } else {
              //If panormam was not found display No street view found message
              infoWindow.setContent('<div>' + marker.title + '</div>' +
                '<div>No Street View Found</div>');
            }
        }
        streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
        //Open the infoWindow
        infoWindow.open(map, marker);
    }
}

//Function to set color for Marker icon
function makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
        'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
        '|40|_|%E2%80%A2',
        new google.maps.Size(34, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34),
        new google.maps.Size(21,34));
        return markerImage;
};


