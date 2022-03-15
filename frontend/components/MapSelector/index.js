import React, { useEffect } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import { formatRelative } from "date-fns";

import "@reach/combobox/styles.css";
import mapStyles from "./mapStyles2.js";
import Geocode from "react-geocode";
import styles from "./index.module.css";

Geocode.setApiKey(process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_MAPS_API_KEY);
Geocode.enableDebug();

const libraries = ["places"];
const mapContainerStyle = {
  height: "100%",
  width: "100%",
};
const options = {
  styles: mapStyles,
  disableDefaultUI: true,
  zoomControl: true,
};
const center = {
  lat: -12.064119,
  lng: -77.036169,
};

export default function MapSelector({ setAdressmap }) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });
  const [markers, setMarkers] = React.useState([]);
  const [selected, setSelected] = React.useState(null);

  //const [addressmap, setAdressmap] = React.useState("");

  const onMapClick = React.useCallback((e) => {
    onMarkerDragEnd(e);
    setMarkers(() => [
      {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
        time: new Date(),
      },
    ]);
  }, []);

  const onMarkerDragEnd = (event) => {
    let newLat = event.latLng.lat(),
      newLng = event.latLng.lng();
    Geocode.fromLatLng(newLat, newLng).then(
      (response) => {
        const address = response.results[0].formatted_address;
        setAdressmap(address);
      },
      (error) => {
        console.error(error);
      }
    );
  };

  const mapRef = React.useRef();
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  }, []);

  const panTo = React.useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(16);
  }, []);

  if (loadError) return "Error";
  if (!isLoaded) return "Loading...";

  return (
    <div>
      <div style={{ height: "300px" }}>
        <div className={styles.containerMap}>
          <div style={{ width: "100%" }}>
            <Search
              panTo={panTo}
              setMarkers={setMarkers}
              setAdressmap={setAdressmap}
            />
          </div>

          <GoogleMap
            id="map"
            mapContainerStyle={mapContainerStyle}
            zoom={16}
            center={center}
            options={options}
            onLoad={onMapLoad}
            onClick={onMapClick}
          >
            {markers.map((marker) => (
              <Marker
                key={`${marker.lat}-${marker.lng}`}
                position={{ lat: marker.lat, lng: marker.lng }}
                onClick={() => {
                  setSelected(marker);
                }}
                draggable={true}
                onDragEnd={(e) => {
                  onMapClick(e);
                  onMarkerDragEnd(e);
                }}
              />
            ))}

            {selected ? (
              <InfoWindow
                position={{ lat: selected.lat, lng: selected.lng }}
                onCloseClick={() => {
                  setSelected(null);
                }}
              >
                <div>
                  <h2>
                    <span role="img" aria-label="bear">
                      🐻
                    </span>{" "}
                    Alert
                  </h2>
                  <p>Spotted {formatRelative(selected.time, new Date())}</p>
                </div>
              </InfoWindow>
            ) : null}
          </GoogleMap>
        </div>
      </div>
    </div>
  );
}

function Search({ panTo, setMarkers, setAdressmap }) {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      location: { lat: () => -12.064119, lng: () => -77.036169 },
      radius: 100 * 1000,
    },
  });

  const onMapClick2 = React.useCallback((lat, long) => {
    setMarkers(() => [
      {
        lat: lat,
        lng: long,
        time: new Date(),
      },
    ]);
  }, []);
  // https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service#AutocompletionRequest

  const handleInput = (e) => {
    setValue(e.target.value);
  };

  const handleSelect = async (address) => {
    setValue(address, false);
    setAdressmap(address);
    clearSuggestions();

    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      onMapClick2(lat, lng);
      panTo({ lat, lng });
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  return (
    <div className={styles.search}>
      <Combobox onSelect={handleSelect}>
        <ComboboxInput
          value={value}
          onChange={handleInput}
          disabled={!ready}
          placeholder="Busca tu direccion"
        />
        <ComboboxPopover>
          <ComboboxList>
            {status === "OK" &&
              data.map(({ id, description }) => (
                <ComboboxOption key={id} value={description} />
              ))}
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
    </div>
  );
}
