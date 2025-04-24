import React, { useState } from "react";
import { Card, Form, ListGroup, ListGroupItem } from "react-bootstrap";

const GeoapifyAutocomplete = ({ setLocation }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const handleInputChange = async (value) => {
    setQuery(value);

    if (value.length < 3) {
      setSuggestions([]);
      return;
    }

    const res = 
    await fetch(`https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
      value
    )}&bias=countrycode:ro&limit=5&apiKey=${import.meta.env.VITE_GEOAPIFY_API_KEY}`);
    const data = await res.json()
    setSuggestions(data.features || []);
  };

  const handleSelect = (location) => {
    setLocation({
      city: location.properties.city,
      country: location.properties.country,
      lat: location.properties.lat,
      lon: location.properties.lon,
    });
    setQuery(location.properties.formatted); 
    setSuggestions([]); 
  };

  return (
    <Card className="mb-3 shadow rounded-4">
        <Card.Header>
            <Card.Title className="m-auto">Search a location</Card.Title>
        </Card.Header>
        <Card.Body>
      <Form.Control
        type="text"
        placeholder="type a city name..."
        value={query}
        onChange={(e) => handleInputChange(e.target.value)}
      />
      {suggestions.length > 0 && (
        <ListGroup className="mt-1">
          {suggestions.map((location) => (
            <ListGroupItem
              key={location.properties.place_id}
              onClick={() => handleSelect(location)}
              style={{ cursor: "pointer" }}
            >
              {location.properties.formatted}
            </ListGroupItem>
          ))}
        </ListGroup>
      )}
      </Card.Body>
      <Card.Footer className="mt-1"><Card.Subtitle>Provided by Geoapify</Card.Subtitle></Card.Footer>
    </Card>
  );
};

export default GeoapifyAutocomplete;
