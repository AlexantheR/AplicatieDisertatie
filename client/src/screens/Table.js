import React from "react";
import { Col } from "reactstrap";

export default function Table(props) {
  const isAvailable = props.empty;

  const handleClick = () => {
    if (isAvailable) {
      props.selectTable(props.name, props.id);
    } else {
      console.log("Tried to select a full table");
    }
  };

  return (
    <div className="table-container">
      <Col
        className={`reservation-table-card ${isAvailable ? "available" : "occupied"}`}
        onClick={handleClick}
      >
        <h5 className="table-name">{props.name}</h5>
        <p className="table-capacity">{props.chairs} locuri</p>
        <p className={`table-status ${isAvailable ? "liber" : "ocupat"}`}>
          {isAvailable ? "Liberă" : "Ocupată"}
        </p>
      </Col>
    </div>
  );
}
