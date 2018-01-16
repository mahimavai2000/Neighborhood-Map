//Locations array to define all locations
var locations= [
{
	title: 'Statue of Liberty',
	img: 'img/LibertyStatue.jpg',
  note: 'Iconic National Monument opened in 1886, offering guided tours, a museum & city views.',
	location: {lat:40.689247, lng: -74.044502}	
},
{
	title: 'Empire State Building',
	img: 'img/ESB.jpg',
  note: 'Iconic, art deco office tower from 1931 with exhibits & observatories on the 86th & 102nd floors.',
	location: {lat:	40.748563, lng: -73.985746}
},
{
	title: 'Central Park',
	img: 'img/CentralPark.jpg',
  note: 'Sprawling park with pedestrian paths & ballfields, plus a zoo, carousel, boat rentals & a reservoir.',
	location: {lat:40.785091, lng: -73.968285}
},
{
	title: 'Brooklyn Bridge',
	img: 'img/BrooklynBridge.jpg',
  note: 'Beloved, circa-1883 landmark connecting Manhattan & Brooklyn via a unique stone-&-steel design.',
	location: {lat:40.706086, lng: -73.996864}
},
{
	title: 'Times Square',
	img: 'img/TimeSquare.jpg',
  note: 'Bustling destination in the heart of the Theater District known for bright lights, shopping & shows.',
	location: {lat:40.760262, lng: -73.993287}	
},
{
	title: 'One World Trade Center',
	img: 'img/Oneworld.jpg',
  note: 'A casual cafe, a bar with small plates & American fine dining with views from the 101st floor.',
	location: {lat:40.713008, lng: -74.013169}
},
{
	title: 'Rockefeller Center',
	img: 'img/RF.jpg',
  note: 'Famous complex thats home to TV studios, plus a seasonal ice rink & giant Christmas tree.',
	location: {lat:40.758740, lng: -73.978674}
},
{
	title: 'American Museum of Natural History',
	img: 'img/NaturalHistory.jpg',
  note: 'From dinosaurs to outer space and everything in between, this huge museum showcases natural wonders.',
	location: {lat:40.782045, lng: -73.971711}
},
{
	title: 'Grand Central Terminal',
	img: 'img/GrandCentral.jpg',
  note: 'Iconic train station known for its grand facade & main concourse, also offering shops & dining.',
	location: {lat:40.752570, lng: -73.977627}
},
{
	title: 'Brooklyn Botanic Garden',
	img: 'img/BotanicGarden.jpg',
  note: 'A kid-friendly annual Cherry Blossom Festival, a Japanese garden & more, spread across 52 acres.',
	location: {lat:40.667622, lng: -73.963191}
}
];
//Create Location function to hold location details
var Location= function(data){
  this.title=ko.observable(data.title);
  this.img=ko.observable(data.img);
};
var map,marker,infoWindow;
//Knockout View Model
//Create Knockout ViewModel to list out the locations
function ViewModel() {
  var self=this;
  this.searchOption = ko.observable("");
  this.searchListOption = ko.observable("");
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

    
    //this.markerDefaultIcon=this.makeMarkerIcon('0091ff');
    //this.highlightedIcon=this.makeMarkerIcon('FFFF24');   

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
            icon: this.markerDefaultIcon,
            id: i
          });
        // Push the marker to our array of markers.
        this.markers.push(this.marker);
        // Add marker to location
        this.locationList()[i].marker = this.marker;


        //create LatLng bounds instance
        this.bounds = new google.maps.LatLngBounds();

        // Extend the boundaries of the map for each marker and display the marker
        for (var j = 0; j <this.markers.length; j++) {
          this.markers[j].setMap(map);
          this.bounds.extend(this.markers[j].position);
          map.fitBounds(this.bounds);
        }

        // Create an onclick event to open an infowindow at each marker.
        this.marker.addListener('click', self.populateMarker);

        //Create a listener for marker on mouseover highlighted icon.
        this.marker.addListener('mouseover', self.setmarkerHighlightedIcon);

        //Create a listener for marker on mouseout default icon.
        this.marker.addListener('mouseout', self.setmarkerDefaultIcon);
    }
    
};
 //create marker color change
 //Marker icon change on mouseover
this.setmarkerHighlightedIcon= function() {
  this.setIcon(self.makeMarkerIcon('FFFF24'));
}
//Marker icon change on mouseover
this.setmarkerDefaultIcon= function() {
  this.setIcon(self.makeMarkerIcon('0091ff'));
}
//Function to set color for Marker icon
this.makeMarkerIcon= function(markerColor) {
    this.markerImage = new google.maps.MarkerImage(
        'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
        '|40|_|%E2%80%A2',
        new google.maps.Size(34, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34),
        new google.maps.Size(21,34));
        return this.markerImage;
};
//show marker when click from List
this.showMarker = function(location) {
    google.maps.event.trigger(location.marker, 'click');
}


//Populate marker
this.populateMarker = function() {
        self.populateInfoWindow(this, self.largeInfoWindow);
        this.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout((function() {
            this.setAnimation(null);
        }).bind(this), 1400);
      };
//Populate InfoWindow with title and Panorma image
this.populateInfoWindow=function(marker,infoWindow) {
  //create wiki API
  var articleUrl;
  //Insert Location in wiki URL
  var wikiURL = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + marker.title + '&limit=1&namespace=0&origin=*&format=json&callback=?';
  //Error message if Wikipedia is failed to load
  var wikiTimeout = setTimeout(function () {
        alert("Wikipedia is failed to Load");
    }, 8000);
  //Get response from Wiki API through Ajax
   $.ajax({
        url: wikiURL,
        dataType: "jsonp"
    }).done(function(response) {
        clearTimeout(wikiTimeout);
        articleUrl = response[3][0];

        // Check to make sure the infowindow is not already opened on this marker.
    if (infoWindow.marker != marker) {
      infoWindow.setContent('');
      infoWindow.marker = marker; 
                

    // Make sure the marker property is cleared if the infowindow is closed.
        infoWindow.addListener('closeclick',function(){
        infoWindow.marker = null;
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
              infoWindow.setContent('<div>' + marker.title + '</div><div id="pano"></div><div><a href ="' + articleUrl + '">' + articleUrl + '</a><hr></div>');
              
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
    });


}

this.initMap();



// It also serves to make the filter work
    this.ListFilter = ko.computed(function() {
      
        var locationResult = [];
        // Iterate over all the locations in the current location list
        for (var j = 0; j < this.locationList().length; j++) {
          console.log(this.locationList().length);
            var listLocation = this.locationList()[j];
            // Check if the location title matches our search query
            if (listLocation.title().toLowerCase().includes(this.searchOption()
                    .toLowerCase())) {
              // if so, push to our location result array
                locationResult.push(listLocation);
                // set the marker to visible
                this.locationList()[j].marker.setVisible(true);
            } else {
              // otherwise, hide the marker
                this.locationList()[j].marker.setVisible(false);
            }
        }
        // return the new array of locations
        return locationResult;
    }, this);


}


function startApp() {
    ko.applyBindings(new ViewModel());
}
