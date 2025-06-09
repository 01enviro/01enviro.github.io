// Pomocná funkcia na prepočet resolution → zoom
function resolutionToZoom(res) {
  const TILE_SIZE = 256;
  const initialResolution = (2 * Math.PI * 6378137) / TILE_SIZE; // 156543.03392804097 pre EPSG:3857
  return Math.log2(initialResolution / res);
}

// OpenStreetMap vrstva
const osmLayer = new ol.layer.Tile({
  source: new ol.source.OSM(),
  visible: false,
  title: 'osm'
});

// ESRI Satellite vrstva
const esriLayer = new ol.layer.Tile({
  source: new ol.source.XYZ({
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attributions: '© Esri, Maxar, Earthstar Geographics',
  }),
  visible: true,
  title: 'esri'
});

// Projekty vrstva (zelené body + štítky pri blízkom priblížení)
const projektyLayer = new ol.layer.Vector({
  source: new ol.source.Vector({
    url: 'gis/projekty.geojson',
    format: new ol.format.GeoJSON()
  }),
  style: function (feature, resolution) {
    const zoom = resolutionToZoom(resolution);

    // Vrstva sa zobrazí len od zoom 11+
    if (zoom < 5) return null;

    const styles = [
      new ol.style.Style({
        image: new ol.style.Circle({
          radius: 6,
          fill: new ol.style.Fill({ color: 'green' }),
          stroke: new ol.style.Stroke({ color: '#fff', width: 1 })
        }),
        fill: new ol.style.Fill({
          color: 'rgba(0, 128, 0, 0.1)'
        }),
        stroke: new ol.style.Stroke({
          color: 'green',
          width: 2
        })
      })
    ];

    // Štítky len od zoom level 15+ (~1:8 000 a bližšie)
    if (zoom >= 14) {
      styles.push(
        new ol.style.Style({
          text: new ol.style.Text({
            text: feature.get('Nazov') || '',
            font: '12px Calibri,sans-serif',
            fill: new ol.style.Fill({ color: '#000' }),
            stroke: new ol.style.Stroke({ color: '#fff', width: 2 }),
            offsetY: -15
          })
        })
      );
    }

    return styles;
  },
  visible: true,
  title: 'projekty'
});

// Vrstva hranica obce (červený obrys + štítky od zoom 13 do 16)
const hranicaObceLayer = new ol.layer.Vector({
  source: new ol.source.Vector({
    url: 'gis/hranicaObce.geojson',
    format: new ol.format.GeoJSON()
  }),
  style: function (feature, resolution) {
    const zoom = resolutionToZoom(resolution);

    // Vrstva sa zobrazí len od zoom 11+
    if (zoom < 11) return null;

    const styles = [
      new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: 'rgba(255, 255, 255, 0.5)',
          width: 2
        }),
        fill: new ol.style.Fill({
          color: 'rgba(0, 0, 0, 0)' // priehľadná výplň
        })
      })
    ];

    // Štítky len medzi zoom 13 a 16 (~1:70 000 až ~1:8 000)
    if (zoom >= 11 && zoom <= 14) {
      styles.push(
        new ol.style.Style({
          text: new ol.style.Text({
            text: feature.get('NM4') || '',
            font: '14px Calibri,sans-serif',
            fill: new ol.style.Fill({ color: '#000' }),
            stroke: new ol.style.Stroke({ color: '#fff', width: 2 }),
            overflow: true
          })
        })
      );
    }

    return styles;
  },
  visible: true,
  title: 'hranicaObce'
});

// Vrstva hranica SR (červený obrys + štítky od zoom 13 do 16)
const hranicaSRLayer = new ol.layer.Vector({
  source: new ol.source.Vector({
    url: 'gis/hranicaSR.geojson',
    format: new ol.format.GeoJSON()
  }),
  style: function (feature, resolution) {
    const zoom = resolutionToZoom(resolution);

    // Vrstva sa zobrazí len od zoom 5+
    if (zoom < 3 && zoom <= 11) return null;

    const styles = [
      new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: 'rgba(255, 255, 255, 0.5)',
          width: 3
        }),
        fill: new ol.style.Fill({
          color: 'rgba(0, 0, 0, 0)' // priehľadná výplň
        })
      })
    ];

    // Štítky len medzi zoom 13 a 16 (~1:70 000 až ~1:8 000)
    if (zoom >= 15 && zoom <= 11) {
      styles.push(
        new ol.style.Style({
          text: new ol.style.Text({
            text: feature.get('NM4') || '',
            font: '14px Calibri,sans-serif',
            fill: new ol.style.Fill({ color: '#000' }),
            stroke: new ol.style.Stroke({ color: '#fff', width: 2 }),
            overflow: true
          })
        })
      );
    }

    return styles;
  },
  visible: true,
  title: 'hranicaSR'
});


// Inicializácia mapy
const map = new ol.Map({
  target: 'ol-map',
  layers: [osmLayer, esriLayer, hranicaSRLayer, hranicaObceLayer, projektyLayer],
  view: new ol.View({
    center: ol.proj.fromLonLat([19.7, 48.7]),
    zoom: 7.7
  })
});

// Ovládací prvok mierky
const scaleLineControl = new ol.control.ScaleLine({
  units: 'metric',
  bar: true,
  steps: 4,
  text: true,
  minWidth: 150
});
map.addControl(scaleLineControl);

// Prepínač medzi podkladmi
const selectEl = document.createElement('select');
selectEl.innerHTML = `
  <option value="esri">Satelitná (ESRI)</option>
  <option value="osm">OpenStreetMap</option>
`;
selectEl.style.padding = '4px';
selectEl.style.fontSize = '14px';

const selectControlDiv = document.createElement('div');
selectControlDiv.className = 'ol-unselectable ol-control';
selectControlDiv.style.top = '10px';
selectControlDiv.style.right = '10px';
selectControlDiv.style.position = 'absolute';
selectControlDiv.style.backgroundColor = 'white';
selectControlDiv.style.padding = '4px';
selectControlDiv.style.borderRadius = '4px';
selectControlDiv.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';
selectControlDiv.appendChild(selectEl);

const selectControl = new ol.control.Control({ element: selectControlDiv });
map.addControl(selectControl);

selectEl.addEventListener('change', function () {
  const selected = this.value;
  osmLayer.setVisible(selected === 'osm');
  esriLayer.setVisible(selected === 'esri');
});
