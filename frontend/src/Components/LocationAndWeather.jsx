import React, { useState } from "react";
import GeoapifyAutocomplete from "./GeoapifyAutocomplete";
import WeatherWidget from "./WeatherWidget";

const LocationAndWeather = () => {
    const [location, setLocation] = useState(null);

    return (
      <div className="position-fixed w-25 rounded-4"
      style={{ right: "1.8rem", marginTop: "8rem", zIndex: 1000 }}>
        <GeoapifyAutocomplete setLocation={setLocation} />
        <WeatherWidget location={location}/>
      </div>
    );
};

export default LocationAndWeather;
