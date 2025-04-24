import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

const locationRouter = express.Router();

locationRouter.route('/location/:text').get(async (req, res) => {
  const text = req.params.text;

  try {
    const response = await fetch(
      `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(text)}&apiKey=${process.env.GEOAPIFY_API_KEY}`
    );

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({ message: errorData.message || 'Geoapify API error.' });
    }

    const result = await response.json();
    
    if (result.features.length === 0) {
      return res.status(404).json({ message: 'No results found.' });
    }

    const feature = result.features[0];

    const location = {
      country: feature.properties.country,
      county: feature.properties.county,
      city: feature.properties.city,
      lon: feature.properties.lon,
      lat: feature.properties.lat,
      result_type: feature.properties.result_type,
    };

    return res.status(200).json(location);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error.' });
  }
});

export default locationRouter;
