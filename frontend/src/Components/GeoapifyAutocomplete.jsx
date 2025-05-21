import { useState, useRef } from "react";
import { Form, ListGroup, ListGroupItem } from "react-bootstrap";

const GeoapifyAutocomplete = ({ setLocation }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const skipFetchRef = useRef(false);

  const handleInputChange = async (value) => {
    setQuery(value);

    if (skipFetchRef.current) {
      skipFetchRef.current = false;
      return;
    }

    if (value.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await fetch(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
          value
        )}&filter=countrycode:ro&type=city&lang=ro&limit=5&apiKey=${import.meta.env.VITE_GEOAPIFY_API_KEY}`
      );
      const data = await res.json();
      setSuggestions(data.features || []);
    } catch (error) {
      console.error("Geoapify error:", error);
      setSuggestions([]);
    }
  };

  const handleSelect = (location) => {
    const props = location.properties;
    const address = {};
    if (props.city) address.city = props.city;
    if (props.county || props.state) address.county = props.county || props.state;
    if (props.country) address.country = props.country;
    if (props.lat) address.lat = props.lat;
    if (props.lon) address.lon = props.lon;

    setLocation(address);

    skipFetchRef.current = true;

    setQuery(
      Object.keys(address)
        .filter(key => key !== "lat" && key !== "lon")
        .map(key => address[key])
        .join(", ")
    );

    setSuggestions([]);
  };

  return (
    <>
      <Form.Control
        type="text"
        placeholder="Introduce a locality.."
        value={query}
        onChange={(e) => handleInputChange(e.target.value)}
      />
      {suggestions.length > 0 && (
        <ListGroup className="pt-1">
          {suggestions.map((location) => {
            const props = location.properties;
            const city = props.city || props.name || "N/A";
            const county = props.county || props.state || "";
            const country = props.country || "";

            return (
              <ListGroupItem
                key={props.place_id}
                onClick={() => handleSelect(location)}
                style={{ cursor: "pointer" }}
              >
                {`${city}${county ? ", " + county : ""}${country ? ", " + country : ""}`}
              </ListGroupItem>
            );
          })}
        </ListGroup>
      )}
    </>
  );
};

export default GeoapifyAutocomplete;
