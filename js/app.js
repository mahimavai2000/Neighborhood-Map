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
	title: 'Grand Central Terminal',
	img: '',
	location: {lat:40.752570, lng: -73.977627}
},
{
	title: 'Brooklyn Botanic Garden',
	img: '',
	location: {lat:40.667622, lng: -73.963191}
}
];

var map,marker,infoWindow;
//Knockout View Model
//Create Knockout ViewModel to list out the locations
function ViewModel() {
  var self=this;
  
  this.markers=[];

  //create KO observable array to hold locations array data
  this.locationList= ko.observableArray([]);

  //Add locations details into KO observable array
  locations.forEach(function(locationDetails){
    self.locationList.push( new Location(locationDetails));
  });

//Initiate the Map
this.initMap = function() {
  //constructor to create a new map JS object.
        var mapCanvas = document.getElementById('map');
        var mapOptions= {
          center: new google.maps.LatLng(40.712775, -74.005973),
          zoom: 15
          //styles: styles        
       };
  map = new google.maps.Map(mapCanvas, mapOptions);
    //create InfoWindow instance
    this.largeInfoWindow= new google.maps.InfoWindow();

     //create marker color change
    this.markerDefaultIcon=self.makeMarkerIcon('0091ff');
    this.highlightedIcon=self.makeMarkerIcon('FFFF24');   

    //Create an Array to get all locations
    for(var i = 0;i < locations.length; i++) {
      // Get the position from the location array.
        this.position = locations[i].location;
        this.title = locations[i].title;
        // Create a marker per location, and put into markers array.
        this.marker = new google.maps.Marker({
            position: this.position,
            title: this.title,
            animation: google.maps.Animation.DROP,
            //icon: markerDefaultIcon,
            id: i
          });
        // Push the marker to our array of markers.
        this.markers.push(this.marker);

        //create LatLng bounds instance
        this.bounds = new google.maps.LatLngBounds();

        // Extend the boundaries of the map for each marker and display the marker
        for (var j = 0; j <this.markers.length; j++) {
          this.markers[j].setMap(map);
          this.bounds.extend(this.markers[j].position);
          map.fitBounds(this.bounds);
        }

        // Create an onclick event to open an infowindow at each marker.
        this.marker.addListener('click', function() {
            self.populateInfoWindow(this, this.largeInfoWindow);
          });

        //Create a listener for marker on mouseover highlighted icon.
        this.marker.addListener('mouseover', function(){
            self.setIcon(this.highlightedIcon);
          });

        //Create a listener for marker on mouseout default icon.
        this.marker.addListener('mouseout', function(){
            self.setIcon(this.markerDefaultIcon);
          });
    }
};
this.initMap();
//Populate InfoWindow with title and Panorma image
this.populateInfoWindow=function(marker,infoWindow) {

    // Check to make sure the infowindow is not already opened on this marker.
    if (infoWindow.marker != marker) {
      //infowindow.setContent('');
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
this.makeMarkerIcon=function(markerColor) {
    this.markerImage = new google.maps.MarkerImage(
        'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
        '|40|_|%E2%80%A2',
        new google.maps.Size(34, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34),
        new google.maps.Size(21,34));
        return this.markerImage;
};
}

//Create Location function to hold location details
var Location= function(data){
  this.title=ko.observable(data.title);
  this.img=ko.observable(data.img);
};
function startApp() {
    ko.applyBindings(new ViewModel());
}
