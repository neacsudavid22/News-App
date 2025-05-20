import { useState } from "react";
import WeatherWidget from "./WeatherWidget";
import { Card } from "react-bootstrap";
import GeoapifyAutocomplete from "./GeoapifyAutocomplete";

const LocationAndWeather = () => {
    const [location, setLocation] = useState(null);

    return (
      <div className="position-fixed w-25 rounded-4"
      style={{ right: "1.8rem", marginTop: "8rem", zIndex: 1000 }}>
        <Card className="mb-3 shadow rounded-4">
            <Card.Header>
                <Card.Title className="m-auto">Search a location</Card.Title>
            </Card.Header>
            <Card.Body>
              <GeoapifyAutocomplete setLocation={setLocation}/>
            </Card.Body>
          <Card.Footer className="mt-1"><Card.Subtitle>Provided by Geoapify</Card.Subtitle></Card.Footer>
        </Card>
        <WeatherWidget location={location}/>
      </div>
    );
};

export default LocationAndWeather;
