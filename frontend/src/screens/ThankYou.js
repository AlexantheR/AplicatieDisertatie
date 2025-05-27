import React, { useEffect } from "react";
import { Row, Col } from "reactstrap";
import { useNavigate } from "react-router-dom";

export default function ThankYou() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 2000);

    return () => clearTimeout(timer); // Cleanup în caz că se părăsește componenta
  }, [navigate]);

  return (
    <div>
      <Row noGutters className="text-center">
        <Col>
          <p className="thanks-header">Vă așteptăm!</p>
          <i className="fas fa-pizza-slice thank-you-pizza"></i>
          <p className="thanks-subtext">
            Rezervarea a fost înregistrată cu succes!
          </p>
        </Col>
      </Row>
    </div>
  );
}
