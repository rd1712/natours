/*eslint-disable */

export const displayMap = locations => {
  mapboxgl.accessToken =
    'pk.eyJ1Ijoicm9oaXQtZGVzaG11a2giLCJhIjoiY2wyb285ZnFsMWVoZzNpcWM3YWh3bThwNSJ9.eYTGJVH5lKtiBXfzHLqx3w';
  const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/rohit-deshmukh/cl2opqnue000f14oxh0oaxs05', // style URL
    // center: [-118, 34], // starting position [lng, lat]
    //zoom: 10 // starting zoom
    // interactive: false
    scrollZoom: false
  });

  const bounds = new mapboxgl.LngLatBounds();
  locations.forEach(loc => {
    const el = document.createElement('div');
    el.className = 'marker';
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom'
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    new mapboxgl.Popup({
      offset: 30
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}: </p>`)
      .addTo(map);

    bounds.extend(loc.coordinates);
  });
  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100
    }
  });
};
