import { useEffect, useState } from "react";
import { Card, Spinner } from "react-bootstrap";

const WeatherWidget = ({location = null}) => {

  const [weather, setWeather] = useState(null);

  useEffect(() => {
    if (!location?.lat || !location?.lon) return;

    const fetchWeather = async () => {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}&units=metric`
      );
      const data = await res.json();
      setWeather(data);
    };

    fetchWeather();
  }, [location]);

  if (!weather) return (
        <Card className="mt-3 shadow rounded-4">
            <Card.Header className="d-flex justify-between">
                <Card.Title className="m-auto">Waiting for a location..</Card.Title>
                <Spinner animation="grow" role="status" className="m-auto">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Card.Header>
        </Card>
    );

  return (
    <Card className="mt-3 shadow rounded-4">
        <Card.Header >
            <Card.Title className="m-auto fw-bold">
                Weather in {location.city ? (location.city + ", "): ""}
                {location.county ? (location.county + ", ") : ""}
                {location.country ? (location.country) : ""}
            </Card.Title>
        </Card.Header>
        <Card.Body className=" d-flex flex-column ms-3">
            {/* <Card.Text className="fs-5">Description: {weather.weather[0].description}</Card.Text> */}
            <Card.Text className=" fw-bold">Temperature: {weather.main.temp}°C</Card.Text>
            <Card.Text className=" fw-bold">Feels like: {weather.main.feels_like}°C</Card.Text>
            <Card.Text className=" fw-bold">Humidity: {weather.main.humidity}</Card.Text>
            <Card.Text className=" fw-bold">Air pressure: {weather.main.pressure}</Card.Text>
            <Card.Text className=" fw-bold">Wind speed: {weather.wind.speed} km/h</Card.Text>
        </Card.Body>
        <Card.Footer>
            <Card.Subtitle className="mt-1">Provided by Open Weather</Card.Subtitle>
        </Card.Footer>
    </Card>
  );
}

export default WeatherWidget;