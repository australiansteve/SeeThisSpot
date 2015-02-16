// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see a blank space instead of the map, this
// is probably because you have denied permission for location sharing.

var map;
var circle;
var centerMarker;
var outerMarker;
var distanceWidget;
var GeoMarker;
var pos;

// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the user table on initial page load
    initialize('44.637957', '-63.596490', 500, 14);

});

(function ($) {
      $.each(['show', 'hide'], function (i, ev) {
        var el = $.fn[ev];
        $.fn[ev] = function () {
          this.trigger(ev);
          return el.apply(this, arguments);
        };
      });
    })(jQuery);

function initialize(lat, lng, radius, zoom) {

  	var mapOptions = {
		zoom: zoom,
		center: new google.maps.LatLng(lat, lng),
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		panControl: false,
		zoomControl: true,
		zoomControlOptions: {
			style: google.maps.ZoomControlStyle.Default
		}
	};
  	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

	// Try HTML5 geolocation
	if(navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			
			if (lat!="current" && lng != "current") {
				pos = new google.maps.LatLng(lat, lng);
			}
			else {
				pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
			}
			console.log("Setting center: " + pos);
			map.setCenter(pos);

			google.maps.event.addListenerOnce(map, 'idle', function() {

				distanceWidget = new DistanceWidget(map, (document.searchForm.searchradius.value/1000));
				GeoMarker = new GeolocationMarker(map);
				GeoMarker.setMinimumAccuracy(100);

			});

		}, function() {
			console.log("geo fail");
			handleNoGeolocation(true);
		}, {timeout:5000});
		console.log("get position done");
	} else {
		// Browser doesn't support Geolocation
		console.log("no geo");
		handleNoGeolocation(false);
	}
}

function handleNoGeolocation(errorFlag) {
	if (errorFlag) {
		var content = 'Error: The Geolocation service failed. Please try refreshing the page';
	} else {
		var content = 'Error: Your browser doesn\'t support geolocation.';
	}

	var options = {
		map: map,
		position: new google.maps.LatLng(60, 105),
		content: content
	};

	var infowindow = new google.maps.InfoWindow(options);
	map.setCenter(options.position);
}

function refreshMap() {
	$('#map-canvas').hide();

	window.setTimeout(function(){
		$('#map-canvas').show();
	}, 250);

	window.setTimeout(function(){
		google.maps.event.trigger(map, 'resize');
	}, 500);
	
}
/**
 * The following all comes from
 * https://developers.google.com/maps/articles/mvcfun?csw=1
 *
 */

/**
 * A distance widget that will display a circle that can be resized and will
 * provide the radius in km.
 *
 * @param {google.maps.Map} map The map on which to attach the distance widget.
 *
 * @constructor
 */
function DistanceWidget(map, distance) {
	this.set('map', map);
	this.set('position', map.getCenter());

	centerMarker = new google.maps.Marker({
		draggable: true,
		title: 'Move me!',
		icon: 'http://maps.gstatic.com/intl/en_ALL/mapfiles/drag_cross_67_16.png'
	});


	google.maps.event.addListener(centerMarker, 'dragend', function() {
    	map.setCenter( centerMarker.getPosition() );

	});

	// Bind the marker map property to the DistanceWidget map property
	centerMarker.bindTo('map', this);

	// Bind the marker position property to the DistanceWidget position
	// property
	centerMarker.bindTo('position', this);

	// Create a new radius widget
	var radiusWidget = new RadiusWidget(distance);

	// Bind the radiusWidget map to the DistanceWidget map
	radiusWidget.bindTo('map', this);

	// Bind the radiusWidget center to the DistanceWidget position
	radiusWidget.bindTo('center', this, 'position');

	// Bind to the radiusWidgets' distance property
	this.bindTo('distance', radiusWidget);

	// Bind to the radiusWidgets' bounds property
	this.bindTo('bounds', radiusWidget);

}
DistanceWidget.prototype = new google.maps.MVCObject();



/**
 * A radius widget that add a circle to a map and centers on a marker.
 *
 * @constructor
 */
function RadiusWidget(distance) {
	circle = new google.maps.Circle({
		strokeWeight: 0
	});

	// Set the distance property value, default to 50km.
	this.set('distance', distance);

	// Bind the RadiusWidget bounds property to the circle bounds property.
	this.bindTo('bounds', circle);

	// Bind the circle center to the RadiusWidget center property
	circle.bindTo('center', this);

	// Bind the circle map to the RadiusWidget map
	circle.bindTo('map', this);

	// Bind the circle radius property to the RadiusWidget radius property
	circle.bindTo('radius', this);

	this.addSizer_();

}
RadiusWidget.prototype = new google.maps.MVCObject();


/**
 * Update the radius when the distance has changed.
 */
RadiusWidget.prototype.distance_changed = function() {
  	this.set('radius', this.get('distance') * 1000);
};

/**
 * Add the sizer marker to the map.
 *
 * @private
 */
RadiusWidget.prototype.addSizer_ = function() {
	outerMarker = new google.maps.Marker({
		draggable: true,
		title: 'Drag me!',
		icon: 'http://maps.google.com/mapfiles/dsliderbar.png'
	});

	outerMarker.bindTo('map', this);
	outerMarker.bindTo('position', this, 'sizer_position');

	var me = this;
	google.maps.event.addListener(outerMarker, 'drag', function() {
		// Set the circle distance (radius)
		me.setDistance();
	});

	google.maps.event.addListener(outerMarker, 'dragend', function() {
		me.updateTextInput();

	});

};


/**
 * Update the center of the circle and position the sizer back on the line.
 *
 * Position is bound to the DistanceWidget so this is expected to change when
 * the position of the distance widget is changed.
 */
RadiusWidget.prototype.center_changed = function() {
  var bounds = this.get('bounds');

  // Bounds might not always be set so check that it exists first.
  if (bounds) {
    var lng = bounds.getNorthEast().lng();

    // Put the sizer at center, right on the circle.
    var position = new google.maps.LatLng(this.get('center').lat(), lng);
    this.set('sizer_position', position);

  }
};


/**
 * Calculates the distance between two latlng locations in km.
 * @see http://www.movable-type.co.uk/scripts/latlong.html
 *
 * @param {google.maps.LatLng} p1 The first lat lng point.
 * @param {google.maps.LatLng} p2 The second lat lng point.
 * @return {number} The distance between the two points in km.
 * @private
*/
RadiusWidget.prototype.distanceBetweenPoints_ = function(p1, p2) {
  if (!p1 || !p2) {
    return 0;
  }

  var R = 6371; // Radius of the Earth in km
  var dLat = (p2.lat() - p1.lat()) * Math.PI / 180;
  var dLon = (p2.lng() - p1.lng()) * Math.PI / 180;
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(p1.lat() * Math.PI / 180) * Math.cos(p2.lat() * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d;
};


/**
 * Set the distance of the circle based on the position of the sizer.
 */
RadiusWidget.prototype.setDistance = function() {
  // As the sizer is being dragged, its position changes.  Because the
  // RadiusWidget's sizer_position is bound to the sizer's position, it will
  // change as well.
  var pos = this.get('sizer_position');
  var center = this.get('center');
  var distance = this.distanceBetweenPoints_(center, pos);
  if (distance > 5) {
  	distance = 5;
  }

  // Set the distance property for any objects that are bound to it
  this.set('distance', distance);

};


/**
 * Updates the text input with the value defined by the two markers.
 */
RadiusWidget.prototype.updateTextInput = function() {
	// As the sizer is being dragged, its position changes.  Because the
	// RadiusWidget's sizer_position is bound to the sizer's position, it will
	// change as well.
	var pos = this.get('sizer_position');
	var center = this.get('center');
	var distance = this.distanceBetweenPoints_(center, pos);

	var distanceMeters = this.get('distance')*1000;
	if (distanceMeters > 5000) {
	  	distanceMeters = 5000;
	}

	console.log("Distance:" + distance + ", meters: " + Math.round(distanceMeters));

	$('#searchradius').attr('value', Math.round(distanceMeters));
	$('#searchradius').val(Math.round(distanceMeters));

};


/**
 * Update the radius when the distance has changed.
 */
DistanceWidget.prototype.clear_markers = function() {
	console.log("setMap(null)");
  	this.marker.setMap(null);
};

