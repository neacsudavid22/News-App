import { useEffect, useState, useRef } from "react";
import { Form, Card, Row, Col, OverlayTrigger, Tooltip, Dropdown } from "react-bootstrap";

const CurrencyConverter = () => {
  const currencies = useRef({
    RON: "Romanian Leu",
    EUR: "Euro",
    USD: "United States Dollar",
    AUD: "Australian Dollar",
    BGN: "Bulgarian Lev",
    BRL: "Brazilian Real",
    CAD: "Canadian Dollar",
    CHF: "Swiss Franc",
    CNY: "Chinese Yuan",
    CZK: "Czech Koruna",
    DKK: "Danish Krone",
    GBP: "British Pound Sterling",
    HKD: "Hong Kong Dollar",
    HUF: "Hungarian Forint",
    IDR: "Indonesian Rupiah",
    ILS: "Israeli New Shekel",
    INR: "Indian Rupee",
    ISK: "Icelandic Krona",
    JPY: "Japanese Yen",
    KRW: "South Korean Won",
    MXN: "Mexican Peso",
    MYR: "Malaysian Ringgit",
    NOK: "Norwegian Krone",
    NZD: "New Zealand Dollar",
    PHP: "Philippine Peso",
    PLN: "Polish Zloty",
    SEK: "Swedish Krona",
    SGD: "Singapore Dollar",
    THB: "Thai Baht",
    TRY: "Turkish Lira",
    ZAR: "South African Rand"
  });

  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");
  const [rate, setRate] = useState(null);
  const [amount, setAmount] = useState(0);


  // Keep original rate fetching logic
  useEffect(() => {
    const fetchRate = async () => {
      if (from && to && from !== to) {
        try {
          const res = await fetch(`https://api.frankfurter.app/latest?from=${from}&to=${to}`);
          const data = await res.json();
          setRate(data.rates[to]);
        } catch (err) {
          console.error("Error fetching rate", err);
          setRate(null);
        }
      } else {
        setRate(1);
      }
    };
    fetchRate();
  }, [from, to]);

  const renderOptions = (type) => {
    const currenciesList = Object.entries(currencies.current);
    
    return currenciesList.map(([code, name]) => (
      <OverlayTrigger
        key={code}
        placement="right"
        overlay={<Tooltip id={`tooltip-${code}`}>{name}</Tooltip>}
      >
        <Dropdown.Item 
          as="button"
          className="text-decoration-none"
          onClick={() => type === 'from' ? setFrom(code) : setTo(code)}
          active={type === 'from' ? code === from : code === to}
        >
          {code}
        </Dropdown.Item>
      </OverlayTrigger>
    ));
  };
    const fromCurrencyName = currencies.current[from];
  const toCurrencyName = currencies.current[to];

  return (
    <Card className="w-25 shadow position-fixed rounded-4" style={{ left: "2rem", marginTop: "11.5rem" }}>
      <h5 className="mb-4 text-center pt-4">Currency Converter</h5>
      <Row className="mb-3 px-4 g-2">
        <Col>
          <Form.Label>From</Form.Label>
          <Dropdown>
            <Dropdown.Toggle variant="outline-secondary" className="w-100">
              {from} - {currencies.current[from]}
            </Dropdown.Toggle>
            <Dropdown.Menu className="w-100" style={{ maxHeight: "300px", overflowY: "auto" }}>
              {renderOptions('from')}
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>
      <Row className="mb-3 px-4 g-2">
        <Col>
          <Form.Label>To</Form.Label>
          <Dropdown>
            <Dropdown.Toggle variant="outline-secondary" className="w-100">
              {to} - {currencies.current[to]}
            </Dropdown.Toggle>
            <Dropdown.Menu className="w-100" style={{ maxHeight: "300px", overflowY: "auto" }}>
              {renderOptions('to')}
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>

      <Form.Group className="mb-3 px-4">
        <Form.Label>Amount</Form.Label>
        <Form.Control
          type="number"
          placeholder="0"
          value={amount > 0 ? amount : ""} 
          onChange={(e) => setAmount(Number(e.target.value))}
          min="1"
        />
      </Form.Group>

      <div className="text-center mt-3 pb-4">
        {rate !== null ? (
          <h6>
            {amount}{' '}
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip id="from-tooltip">{fromCurrencyName}</Tooltip>}
            >
              <span className="border-bottom border-primary">{from}</span>
            </OverlayTrigger>{' '}
            ={' '}
            <strong>
              {(amount * rate).toFixed(3)}{' '}
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip id="to-tooltip">{toCurrencyName}</Tooltip>}
              >
                <span className="border-bottom border-primary">{to}</span>
              </OverlayTrigger>
            </strong>
          </h6>
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <Card.Footer className="py-3">
        <Card.Subtitle>Provided by Frankfurter</Card.Subtitle>
      </Card.Footer>
    </Card>
  );
};

export default CurrencyConverter;