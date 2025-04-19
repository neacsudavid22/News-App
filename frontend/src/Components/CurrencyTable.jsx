import { useEffect, useState, useRef } from "react";
import { Table, OverlayTrigger, Tooltip, Form } from "react-bootstrap";

const CurrencyTable = () => {
  const [rates, setRates] = useState({});

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

  const [targetCurrencyList] = useState(["RON", "USD", "EUR", "GBP", "TRY", "BGN", "AUD", "PLN", "INR"]);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    const toList = targetCurrencyList.join(",");
    const fetchRates = async () => {
      const promises = Object.keys(currencies.current).map(async (fromCurrency) => {
        try {
          const res = await fetch(`https://api.frankfurter.app/latest?from=${fromCurrency}&to=${toList}`);
          const { rates } = await res.json();
          setLastUpdated(Date.now())
          return [fromCurrency, rates];
        } catch (error) {
          console.error(`Failed to fetch rates for ${fromCurrency}`, error);
          return [fromCurrency, {}];
        }
      });

      const entries = await Promise.all(promises);
      setRates(Object.fromEntries(entries));
    };

    fetchRates();
    const intervalId = setInterval(fetchRates, 20 * 1000);

    return () => clearInterval(intervalId);
  }, [targetCurrencyList]);

  const marginLeft = 1.6;
  const marginTop = 12;
  const divHeight = 90;

  const [filterName, setFilterName] = useState("");

  const [currencyList, setCurrencyList] = useState(Object.keys(currencies.current));

  useEffect(() => {
    const filterCurrencies = () => {
      const allCurrencies = Object.keys(currencies.current);

      if (!filterName) {
        setCurrencyList(allCurrencies);
        return;
      }
      
      const filtered = allCurrencies.filter(currency => 
        currency.toLowerCase().includes(filterName.toLowerCase()) ||
        currencies.current[currency].toLowerCase().includes(filterName.toLowerCase())
      );
      
      setCurrencyList(filtered);
    };

    filterCurrencies();
  }, [filterName]);

  return (
    <>
      {/* Fixed First Column */}
      <Form.Control 
          type="text" className="w-25 position-fixed" placeholder="search currency" 
          size="sm"
          onChange={(e)=>setFilterName(e.target.value)}
          style={{
            marginLeft: (0.5 + marginLeft).toString() + "vw",
            marginTop: (marginTop - 3.5).toString() + "rem",
          }}
      />
      <div
        className="position-fixed rounded-start-4 overflow-hidden z-1"
        style={{
          marginLeft: marginLeft.toString() + "vw",
          marginTop: marginTop.toString() + "rem",
          width: "4rem",
          height: (divHeight - 40).toString() + "vh"
        }}
      >
       
        <Table striped bordered hover variant="dark" size="sm">
          <thead>
            <tr>
              <th>From/To</th>
            </tr>
          </thead>
          <tbody>
            {targetCurrencyList.map((target) => (
              <tr key={target}>
                <td>
                  <OverlayTrigger
                    placement="right"
                    overlay={
                      <Tooltip id={`tooltip-fixed-${target}`}>
                        {currencies.current[target]}
                      </Tooltip>
                    }
                  >
                    <p style={{ cursor: "help", margin: 0 }}>{target}</p>
                  </OverlayTrigger>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
  
      {/* Main Table with Data */}
      <div
        className="position-fixed rounded-4 overflow-hidden"
        style={{
          marginLeft: marginLeft.toString() + "vw",
          marginTop: marginTop.toString() + "rem",
          width: "26vw",
          height: divHeight.toString() + "vh"
        }}
      >
        <Table responsive striped bordered hover variant="dark" size="sm">
          <thead>
            <tr>
              <th>From/To</th>
              {currencyList.map((base) => (
                <th key={base}>
                  <OverlayTrigger
                    placement="bottom"
                    overlay={
                      <Tooltip id={`tooltip-${base}`}>
                        {currencies.current[base]}
                      </Tooltip>
                    }
                  >
                    <p style={{ cursor: "help", margin: 0 }}>{base}</p>
                  </OverlayTrigger>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {targetCurrencyList.map((target) => (
              <tr key={target}>
                <td>
                  <OverlayTrigger
                    placement="right"
                    overlay={
                      <Tooltip id={`tooltip-main-${target}`}>
                        {currencies.current[target]}
                      </Tooltip>
                    }
                  >
                    <p style={{ cursor: "help", margin: 0 }}>{target}</p>
                  </OverlayTrigger>
                </td>
                {currencyList.map((base) => (
                  <td key={`${target}-${base}`} className="text-center">
                    {base === target ? "1.000" : 
                    (rates[base]?.[target] ? (1 / rates[base][target]).toFixed(3) : "...")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={currencyList.length + 1}>
                Last updated at {new Date(lastUpdated).toLocaleString()}
              </td>
            </tr>
          </tfoot>
        </Table>
      </div>
    </>
  );
};

export default CurrencyTable;
