var selLocLatA;
       var selLocLngA = 0.0;
       var selLocLatB = 0.0;
       var selLocLngB = 0.0;
       var MidLat =0.0;
       var MidLng =0.0;

        $(document).ready(function () {
            // type_holder
            // <div><label><input type="checkbox" class="types" value="mosque" />Mosque</label></div>
            var types = ['amusement_park', 'aquarium', 'art_gallery',
                'bar', 'book_store', 'bowling_alley',
                'bus_station', 'cafe', 'casino','church', 'department_store',
                'gym', 'hindu_temple', 'library', 'lodging',
                'mosque', 'movie_theater', 'museum', 'night_club',
                'park', 'restaurant', 'shopping_mall', 'spa', 'stadium', 'synagogue', 'taxi_stand', 'train_station',
                'university','zoo'
            ];
            var html = '';
            $.each(types, function (index, value) {
                var name = value.replace(/_/g, " ");
                html += '<div><label><input type="checkbox" class="types" value="' + value + '" />' +
                    capitalizeFirstLetter(name) + '</label></div>';
            });
            $('#type_holder').html(html);
        });

        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
        var map;
        var infowindow;
        var autocomplete;

        /////
        var autocomplete2;
        /////

        var countryRestrict = {
            'country': 'in'
        };
        var selectedTypes = [];


        function initialize() {
            autocomplete = new google.maps.places.Autocomplete((document.getElementById('addressA')), {
                types: ['(regions)'],
                // componentRestrictions: countryRestrict
            });
            autocomplete2 = new google.maps.places.Autocomplete((document.getElementById('addressB')), {
                types: ['(regions)'],
                // componentRestrictions: countryRestrict
            });
            var samsroad = new google.maps.LatLng(53.3360, -2.2081);
            map = new google.maps.Map(document.getElementById('map'), {
                center: samsroad,
                zoom: 4
            });
        }
        ///////////////////////////////////////////////////////////////////////////////////

        function renderMap() {
            // Get the user defined values
            var addressA = document.getElementById('addressA').value;
            //console.log("getting address A");

            /////
            var addressB = document.getElementById('addressB').value;
            //console.log("getting address B");
            /////

            var radius = parseInt(document.getElementById('radius').value) * 1000;
            // get the selected type
            selectedTypes = [];
            //console.log("getting address c");

            $('.types').each(function () {
                if ($(this).is(':checked')) {
                    selectedTypes.push($(this).val());
                }
            });

            var geocoder = new google.maps.Geocoder();

            geocoder.geocode({
                'address': addressA
            }, function (results, status) {
                if (status === 'OK') {
                    //console.log(results[0].geometry.location.lat() + ' - ' + results[0].geometry.location.lng());

                    /////
                    selLocLatA = results[0].geometry.location.lat();
                    selLocLngA = results[0].geometry.location.lng();
                }
                /////
                else {
                    alert('Geocode was not successful for the following reason: ' + status);
                }
                /////

            });
            ///// end of geocoder function for Address A

            geocoder.geocode({
                'address': addressB
            }, function (results, status) {
                if (status === 'OK') {
                    console.log(results[0].geometry.location.lat() + ' - ' + results[0].geometry.location.lng());

                    /////
                    selLocLatB = results[0].geometry.location.lat();
                    selLocLngB = results[0].geometry.location.lng();
                }
                /////
                else {
                    alert('Geocode was not successful for the following reason: ' + status);
                }
                /////

            });
            ///// end of geocoder function for Address B

            MidLat = (selLocLatA + selLocLatB) / 2
            MidLng = (selLocLngA + selLocLngB) / 2

        //var halfway = new google.maps.LatLng(53.3360, -2.2081);
        var halfway = new google.maps.LatLng(MidLat, MidLng);
            map = new google.maps.Map(document.getElementById('map'), {
                center: halfway,
                zoom: 9
            });

            var request = {
                location: halfway,
                radius: radius,
                types: selectedTypes
            };

            infowindow = new google.maps.InfoWindow();
            var service = new google.maps.places.PlacesService(map);
            service.nearbySearch(request, callback);
        }

        // end of function **--renderMap--**
        //////////////////////////////////////////////////////////////////////////////


        function callback(results, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                for (var i = 0; i < results.length; i++) {
                    createMarker(results[i], results[i].icon);
                }
            }
        }

        function createMarker(place, icon) {
            var placeLoc = place.geometry.location;
            var marker = new google.maps.Marker({
                map: map,
                position: place.geometry.location,
                icon: {
                    url: icon,
                    scaledSize: new google.maps.Size(20, 20) // pixels
                },
                animation: google.maps.Animation.DROP
            });
            google.maps.event.addListener(marker, 'click', function () {
                infowindow.setContent(place.name + '<br>' + place.vicinity);
                infowindow.open(map, this);
            });
        }
