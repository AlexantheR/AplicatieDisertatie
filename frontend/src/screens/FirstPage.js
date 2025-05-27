import React from "react";
import { useNavigate } from "react-router-dom";
import AOS from 'aos';
import 'aos/dist/aos.css';

function FirstPage() {
  const navigate = useNavigate();

  React.useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  return (
    <div className="firstpage-container">
      <div className="firstpage-hero">
        <h1 className="hero-title">Pizza delicioasă făcută cu dragoste</h1>
        <p className="hero-subtitle">
          Descoperă o varietate largă de pizza apetisante, pregătite cu ingrediente proaspete.
        </p>
        <div className="hero-buttons">
          <button className="btn btn-danger" onClick={() => navigate("/pizzamenu")}>Vezi Pizza</button>
          <button className="btn btn-danger" onClick={() => navigate("/drinks")}>Vezi băuturi</button>
          <button className="btn btn-danger" onClick={() => navigate("/book")}>Rezervări</button>
        </div>
      </div>

      <div className="firstpage-about" data-aos="fade-up">
        <h2>Despre noi</h2>
        <p>
          Suntem un restaurant dedicat pasionaților de pizza, unde găsiți combinații savuroase și arome autentice.
          Ne străduim să oferim experiențe gastronomice deosebite, cu pizza proaspătă pregătită din ingrediente de calitate superioară.
        </p>
      </div>
    </div>
  );
}

export default FirstPage;
