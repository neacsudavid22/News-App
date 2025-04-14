import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

const CategoryBar = ({category, setCategory}) => {

  const CATEGORIES = {
    allNews: ["gray"] ,
    politics: ["red"],
    extern: ["blue"] , 
    finance: ["#c9ac34"] , 
    sports: ["green"] ,
    tech: ["orange"] , 
    lifestyle: ["purple"] 
  };

  const handleCategoryChange = (category) => {
    setCategory(category);
  }

  const handleTitle = (title) => {
    return <span style={{color: title === category ? "black": "whitesmoke"}}>
      {title.toString().charAt(0).toUpperCase() + (title.toString().slice(1))}</span>
  }

  return (
      <Navbar style={{ background: CATEGORIES[category]?.[0] || "gray" }} expand="lg" 
              className="w-100 p-2 p-lg-0 z-index-1000"
      >
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse className="py-1 p-lg-0">
          <Nav 
            variant="tabs" 
            activeKey={category} 
            className="custom-tabs py-1 py-lg-0 w-100 d-flex justify-content-around"
            onSelect={(selectedKey) => handleCategoryChange(selectedKey)}
            style={{ background: CATEGORIES[category]?.[0] || "gray" }} 
          >
            {Object.keys(CATEGORIES).map((key) => (
              <Nav.Item key={key}>
                <Nav.Link 
                  eventKey={key} 
                  className="tab-custom"
                  style={{ color: key === category ? "black" : "whitesmoke" }} 
                >
                  {handleTitle(key)}
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
  );
}

export default CategoryBar;