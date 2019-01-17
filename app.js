let locations = {"type":"FeatureCollection","features":[{"geometry":{"type":"Point","coordinates":[-1.951041,50.739687]},"type":"Feature","properties":{"name":"BEBC Bournemouth English Book Centre","hours":"8:30am-5pm","phone":"+441202712934","email":"elt@bebc.co.uk","website":"https://www.bebc.co.uk"}},{"geometry":{"type":"Point","coordinates":[0.129187,52.197106]},"type":"Feature","properties":{"name":"Cambridge International Book Centre","hours":"10am-5:30pm","phone":"+441223365400","email":"cibc@eflbooks.co.uk","website":"https://www.eflbooks.co.uk/"}},{"geometry":{"type":"Point","coordinates":[-0.13464,50.821756]},"type":"Feature","properties":{"name":"The English Language Bookshop","hours":"n/a","phone":"+441273604864","email":"sales@elb-brighton.com","website":"http://www.elb-brighton.com/"}},{"geometry":{"type":"Point","coordinates":[-0.129998,51.51466]},"type":"Feature","properties":{"name":"Foyles","hours":"7am-9pm","phone":"+442074375660","email":"efl@foyles.co.uk","website":"https://www.foyles.co.uk/"}},{"geometry":{"type":"Point","coordinates":[0.11894,52.205696]},"type":"Feature","properties":{"name":"Cambridge University Press Bookshop","hours":"9am-5:30pm","phone":"+441223330292","email":"bookshop@cambridge.org","website":"https://www.cambridge.org/about-us/visit-bookshop"}},{"geometry":{"type":"Point","coordinates":[-3.435973,55.378051]},"type":"Feature","properties":{"name":"Amazon UK","hours":"24/7","phone":"+448002797234","email":"resolution-uk@amazon.co.uk","website":"https://www.amazon.co.uk/"}},{"geometry":{"type":"Point","coordinates":[-1.256695,51.75423]},"type":"Feature","properties":{"name":"Blackwell Bookshop (Oxford)","hours":"9am-6:30pm","phone":"+441865792792","email":"oxford@blackwell.co.uk","website":"https://blackwells.co.uk/bookshop/home"}},{"geometry":{"type":"Point","coordinates":[-0.129092,51.51411]},"type":"Feature","properties":{"name":"Blackwell Bookshop (London)","hours":"9am-6:30pm","phone":"+442072925100","email":"orders.london@blackwell.co.uk","website":"https://blackwells.co.uk/bookshop/home"}},{"geometry":{"type":"Point","coordinates":[-3.186161,55.947729]},"type":"Feature","properties":{"name":"Blackwell Bookshop (Edinburgh)","hours":"9am-6:30pm","phone":"+441316228222","email":"edinburgh@blackwell.co.uk","website":"https://blackwells.co.uk/bookshop/home"}},{"geometry":{"type":"Point","coordinates":[-0.13208,51.522467]},"type":"Feature","properties":{"name":"Waterstones (London)","hours":"8:30am-9pm","phone":"+448432908351","email":"support@waterstones.com","website":"https://www.waterstones.com/"}},{"geometry":{"type":"Point","coordinates":[-0.137329,51.508662]},"type":"Feature","properties":{"name":"Waterstones (London)","hours":"8:30am-9pm","phone":"+448432908549","email":"support@waterstones.com","website":"https://www.waterstones.com/"}},{"geometry":{"type":"Point","coordinates":[-2.247172,53.481798]},"type":"Feature","properties":{"name":"Waterstones (Manchester)","hours":"10:30am-6pm","phone":"+448432908485","email":"support@waterstones.com","website":"https://www.waterstones.com/"}},{"geometry":{"type":"Point","coordinates":[-3.435973,55.378051]},"type":"Feature","properties":{"name":"Wordery.com","hours":"24/7","phone":null,"email":"help@wordery.com","website":"https://wordery.com/"}}]};
let center = {lat: null, lng: null} // Updated when the maps api is loaded.

/*
  Can be used later when country is selected from the dropdown to update the maps contents/location/zoom
  without having to hard reload the page.
*/
let map = null;

// Handles creating the map
function createMap() {
  console.log("[INFO]: Google Maps API loaded, creating map.");
  map = new google.maps.Map(document.getElementsByClassName('map')[0], {
    center: {lat: 54.00366, lng: -2.547855},
    zoom: 5
  });

  console.log("[INFO]: Requesting location access...");
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      map.setCenter(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
      map.setZoom(10);
      new google.maps.Geocoder().geocode({'latLng': new google.maps.LatLng(position.coords.latitude, position.coords.longitude)}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          $("#location").html(results[0].formatted_address);
        } else {
          $("#location").html(`${position.coords.latitude}, ${position.coords.longitude}`);
        }
      });
      center = {lat: position.coords.latitude, lng: position.coords.longitude}
      console.log(`[INFO]: Latitude: ${position.coords.latitude}, Longitude: ${position.coords.longitude}`);
      $("#country").change();
    }, function() {
      console.log("[ERROR]: Location access denied, not setting a center location.");
      $("#location").html("access denied");
    });
  } else {
    console.log("[ERROR]: Location not supported by this browser, not setting a center location.");
    $("#location").html("unsupported browser");
  }

  map.data.addGeoJson(locations);

  const info = new google.maps.InfoWindow();
  map.data.addListener('click', event => {
    console.log("[INFO]: Location clicked, showing information about it...");
    let name = event.feature.getProperty('name');
    let hours = event.feature.getProperty('hours');
    let phone = event.feature.getProperty('phone');
    let email = event.feature.getProperty('email');
    let website = event.feature.getProperty('website');
    let position = event.feature.getGeometry().get();

    // TODO: Theme this information box better...
    let content = `
      <div style="margin-bottom:20px;">
        <h2>${name}</h2>
        <p><b>Open:</b> ${hours}<br/><b>Phone:</b> <a href="tel:${phone}">${phone}</a><br><b>Email:</b> <a href="mailto:${email}">${email}</a><br><b>Website:</b> <a href="${website}">${website}</a></p>
        <p><img src="https://maps.googleapis.com/maps/api/streetview?size=350x120&location=${position.lat()},${position.lng()}&key=AIzaSyChnZO1kOssJaMVKEEMF-E30Z0hf5JsXKY"></p>
      </div>
      <div>
      <center>
      <form action="http://maps.google.com/maps" method="get" target="_blank">
         <input type="hidden" name="daddr" value="${position.lat()},${position.lng()}" />
         <input type="hidden" name="saddr" value="${center.lat}, ${center.lng}" />
         <input type="submit" value="Get Directions" />
      </form>
      </center>
      </div>`;

    console.log(`Name: ${name}
Hours: ${hours}
Phone: ${phone}
Email: ${email}
Website: ${website}
Position: ${position}`);

    info.setContent(content);
    info.setPosition(position);
    info.open(map);
  });
}

$(document).ready(function() {
  const filterName = $("#filter-name"); // e.g. All, United Kingdom, United States
  const filterList = $("#filter-list"); // List of all the stores ordered by distance.
  const countrySelector = $("#country"); // Country dropdown.

  countrySelector.on('change', function (e) {
    let html = ""
    switch ($(this).val()) {
      default:
      case "all":
        html = "";
        JSON.parse(JSON.stringify(locations)).features.forEach(function (entry) {
          html += `<img src="https://maps.googleapis.com/maps/api/streetview?size=260x100&location=${entry.geometry.coordinates[1]},${entry.geometry.coordinates[0]}&key=AIzaSyChnZO1kOssJaMVKEEMF-E30Z0hf5JsXKY"><br><strong>${entry.properties.name}</strong>
          <br><strong>Hours:</strong> ${entry.properties.hours}<br><strong>Phone:</strong> <a href="tel:${entry.properties.phone}">${entry.properties.phone}</a><br><strong>Email:</strong> <a href="mailto:${entry.properties.email}">${entry.properties.email}</a><br><a href="mailto:${entry.properties.website}">${entry.properties.website}</a>  <center>
          <br>
            <form action="http://maps.google.com/maps" method="get" target="_blank">
               <input type="hidden" name="daddr" value="${entry.geometry.coordinates[1]},${entry.geometry.coordinates[0]}" />
               <input type="hidden" name="saddr" value="${center.lat}, ${center.lng}" />
               <button type="submit" class="btn btn-outline-success" value="">Get Directions</button>
            </form>
            </center><hr>`
        });
        filterList.html(html);
        filterName.html("All");
        break;

      case "uk":
        // TODO: display UK locations.
        filterName.html("United Kingdom");
        break;

      case "us":
        // TODO: display US locations.
        filterName.html("United States");
        break;

      // Add other locations.
    }
  });

  countrySelector.change(); // trigger the event so the list is updated on page load.
});
