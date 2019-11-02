
var map;  // Refactor to either be initialized or passed as an argument where needed
const COUNTRY_RESTRICT = {
  'country': 'in'
};  // global CONSTANT

$(document).ready(function() {
  // type_holder
  // <div><label><input type="checkbox" class="types" value="mosque"
  // />Mosque</label></div>
  var types = [
    'amusement_park',
    'aquarium',
    'art_gallery',
    'bar',
    'book_store',
    'bowling_alley',
    'bus_station',
    'cafe',
    'casino',
    'church',
    'department_store',
    'gym',
    'hindu_temple',
    'library',
    'lodging',
    'mosque',
    'movie_theater',
    'museum',
    'night_club',
    'park',
    'restaurant',
    'shopping_mall',
    'spa',
    'stadium',
    'synagogue',
    'taxi_stand',
    'train_station',
    'university',
    'zoo'
  ];
  var html = '';
  $.each(types, function(index, value) {
    var name = value.replace(/_/g, ' ');
    var name_first_letter_capitalized =
        name.charAt(0).toUpperCase() + name.substr(1);
    html += `
        <div>
          <label>
          <input type="checkbox" class="types" value="${value}"/>
          ${name_first_letter_capitalized}
          </label>
        </div>
    `;
  });
  $('#type_holder').html(html);
});


function initialize() {
  var autocomplete = new google.maps.places.Autocomplete(
      (document.getElementById('addressA')), {
        types: ['(regions)'],
        // componentRestrictions: COUNTRY_RESTRICT
      });
  var autocomplete2 = new google.maps.places.Autocomplete(
      (document.getElementById('addressB')), {
        types: ['(regions)'],
        // componentRestrictions: COUNTRY_RESTRICT
      });
  var samsroad = new google.maps.LatLng(53.3360, -2.2081);
  map = new google.maps.Map(
      document.getElementById('map'), {center: samsroad, zoom: 4});
}
///////////////////////////////////////////////////////////////////////////////////

function renderMap() {
  // Get the user defined values
  var addressA = document.getElementById('addressA').value;
  // console.log("getting address A");
  // console.log(addressA);

  /////
  var addressB = document.getElementById('addressB').value;
  // console.log("getting address B");
  // console.log(addressB);
  /////

  var radius = parseInt(document.getElementById('radius').value) * 1000;
  // get the selected type
  var selectedTypes = [];
  // console.log("getting address c");

  $('.types').each(function() {
    if ($(this).is(':checked')) {
      selectedTypes.push($(this).val());
    }
  });


  var geocoder = new google.maps.Geocoder();

  geocoder.geocode({'address': addressA}, function(results, status) {
    if (status === 'OK') {
      // console.log(results[0].geometry.location.lat() + ' - ' +
      // results[0].geometry.location.lng());

      /////
      var selLocLatA = results[0].geometry.location.lat();
      var selLocLngA = results[0].geometry.location.lng();

      geocoder.geocode({'address': addressB}, function(results, status) {
        if (status === 'OK') {
          console.log(
              results[0].geometry.location.lat() + ' - ' +
              results[0].geometry.location.lng());

          /////
          var selLocLatB = results[0].geometry.location.lat();
          var selLocLngB = results[0].geometry.location.lng();

          var MidLat = (selLocLatA + selLocLatB) / 2;
          console.log('MidLat: ' + MidLat);
          var MidLng = (selLocLngA + selLocLngB) / 2;

          // var halfway = new google.maps.LatLng(53.3360, -2.2081);
          var halfway = new google.maps.LatLng(MidLat, MidLng);
          map = new google.maps.Map(
              document.getElementById('map'), {center: halfway, zoom: 9});

          var request = {
            location: halfway,
            radius: radius,
            types: selectedTypes
          };

          var service = new google.maps.places.PlacesService(map);
          service.nearbySearch(
              request,
              function(results, status) {
                if (status == google.maps.places.PlacesServiceStatus.OK) {
                  for (var i = 0; i < results.length; i++) {
                    createMarker(results[i], results[i].icon);
                  }
                }
              }

          );
        }
        /////
        else {
          alert(
              'Geocode was not successful for the following reason: ' + status);
        }
        /////
      });
    }
    /////
    else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
    /////
  });
  ///// end of geocoder function for Address A


  ///// end of geocoder function for Address B
}

// end of function **--renderMap--**
//////////////////////////////////////////////////////////////////////////////


function createMarker(place, icon) {
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location,
    icon: {
      url: icon,
      scaledSize: new google.maps.Size(20, 20)  // pixels
    },
    animation: google.maps.Animation.DROP
  });
  var infowindow = new google.maps.InfoWindow();
  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent(place.name + '<br>' + place.vicinity);
    infowindow.open(map, this);
  });
}
