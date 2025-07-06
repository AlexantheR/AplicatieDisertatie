import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Input,
} from "reactstrap";
import Table from "./Table";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";


export default function Book(props) {
  const [totalTables, setTotalTables] = useState([]);

  const [selection, setSelection] = useState({
    table: { name: null, id: null },
    date: new Date(),
    time: null,
    location: "Orice locatie",
    size: 0,
  });

  const [booking, setBooking] = useState({ name: "", phone: "", email: "" });
  const [reservationError, setReservationError] = useState(false);

  const locations = ["Orice locatie", "Terasa", "Interior", "Bar"];
  const times = ["9AM", "10AM", "11AM", "12PM", "1PM", "2PM", "3PM", "4PM", "5PM", "6PM", "7PM", "8PM", "9PM", "10PM"];

  const getDate = () => {
    if (!selection.date || !selection.time) return null;

    const selectedDate = selection.date;
    const [hourRaw] = selection.time.match(/\d+/);
    const isPM = selection.time.toUpperCase().includes("PM");

    let hour = parseInt(hourRaw);
    if (isPM && hour < 12) hour += 12;
    if (!isPM && hour === 12) hour = 0;

    const localDate = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      hour,
      0,
      0
    );

    const now = new Date();
    return localDate >= now
      ? new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000)
      : null;
  };

  const getEmptyTables = () => totalTables.filter(t => t.isAvailable).length;

  useEffect(() => {
    if (selection.time && selection.date) {
      const datetime = getDate();
      if (!datetime) return;

      const token = JSON.parse(localStorage.getItem('currentUser'))?.token;

      fetch(`${process.env.REACT_APP_API_URL}/availability`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ date: datetime }),
      })

        .then(res => res.json())
        .then(res => {
          const tables = res.tables.filter(table =>
            (selection.size > 0 ? table.capacity >= selection.size : true) &&
            (selection.location !== "Orice locatie" ? table.location === selection.location : true)
          );
          setTotalTables(tables);
        });
    }
  }, [selection.time, selection.date, selection.size, selection.location]);

  const navigate = useNavigate();


  const reserve = async () => {
    if (!booking.name || !booking.phone || !booking.email) {
      setReservationError(true);
      return;
    }

    const datetime = getDate();
    if (!datetime) return;

    const token = JSON.parse(localStorage.getItem('currentUser'))?.token;

    const res = await fetch(`${process.env.REACT_APP_API_URL}/reservation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ ...booking, date: datetime, table: selection.table.id }),
    });


    if (res.ok) navigate("/thankyou");
  };

  const renderTables = () => {
    const validDate = getDate();

    if (!selection.date || !selection.time) {
      return (
        <p className="table-info-message">
          Selectați data și ora pentru a vedea mesele disponibile.
        </p>
      );
    }

    if (!validDate) {
      return (
        <p className="wrong-time">
          Ați introdus o dată invalidă
        </p>
      );
    }

    if (getEmptyTables() === 0) {
      return <p className="table-display-message">Nicio masă liberă</p>;
    }
    return (
      <>
        <div className="table-key">
          <span className="empty-table"></span> Liber
          &nbsp;&nbsp;
          <span className="full-table"></span> Ocupat
        </div>
        <Row noGutters>
          {totalTables.map(table => (
            <Table
              key={table._id}
              id={table._id}
              chairs={table.capacity}
              name={table.name}
              empty={table.isAvailable}
              selectTable={(name, id) => setSelection({ ...selection, table: { name, id } })}
            />
          ))}
        </Row>
      </>
    );
  };

  return (
    <div className="reservation-wrapper">
      <Row className="text-center pizza-cta">
        <Col>
          <p className="looking-for-pizza">
            {selection.table.id ? "Confirmare rezervare" : "Rezervă o masă"}
            <i className={`fas ${selection.table.id ? "fa-clipboard-check" : "fa-chair"} pizza-slice`} />
          </p>
          {selection.table.id && (
            <p className="selected-table">Urmează să rezervi masa {selection.table.name}</p>
          )}
          {reservationError && (
            <p className="reservation-error">* Vă rugăm să completați toate detaliile.</p>
          )}
        </Col>
      </Row>

      {!selection.table.id ? (
        <>
          <Row className="text-center align-items-center g-3 mb-4">
            <Col xs="12" sm="3">
              <DatePicker
                selected={selection.date}
                onChange={date => setSelection({ ...selection, table: {}, date })}
                minDate={new Date()}
                dateFormat="dd/MM/yyyy"
                className="custom-datepicker"
              />
            </Col>

            <Col xs="12" sm="3">
              <UncontrolledDropdown>
                <DropdownToggle caret color="danger" className="form-control text-white">
                  {selection.time || "Alege ora"}
                </DropdownToggle>
                <DropdownMenu>
                  {times.map(time => (
                    <DropdownItem key={time} onClick={() => setSelection({ ...selection, time })}>
                      {time}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </UncontrolledDropdown>
            </Col>

            <Col xs="12" sm="3">
              <UncontrolledDropdown>
                <DropdownToggle caret color="danger" className="form-control text-white">
                  {selection.location}
                </DropdownToggle>
                <DropdownMenu>
                  {locations.map(loc => (
                    <DropdownItem key={loc} onClick={() => setSelection({ ...selection, location: loc })}>
                      {loc}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </UncontrolledDropdown>
            </Col>

            <Col xs="12" sm="3">
              <UncontrolledDropdown>
                <DropdownToggle caret color="danger" className="form-control text-white">
                  {selection.size > 0 ? selection.size : "Număr persoane"}
                </DropdownToggle>
                <DropdownMenu>
                  {[1, 2, 3, 4, 5, 6, 7].map(n => (
                    <DropdownItem key={n} onClick={() => setSelection({ ...selection, size: n })}>
                      {n}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </UncontrolledDropdown>
            </Col>
          </Row>

          <div className="tables-display">
            {renderTables()}
          </div>

        </>
      ) : (
        <>
          <Row className="text-center justify-content-center reservation-details-container">
            <Col xs="12" sm="3">
              <Input type="text" placeholder="Nume" value={booking.name} onChange={e => setBooking({ ...booking, name: e.target.value })} />
            </Col>
            <Col xs="12" sm="3">
              <Input type="text" placeholder="Telefon" value={booking.phone} onChange={e => setBooking({ ...booking, phone: e.target.value })} />
            </Col>
            <Col xs="12" sm="3">
              <Input type="email" placeholder="Email" value={booking.email} onChange={e => setBooking({ ...booking, email: e.target.value })} />
            </Col>
          </Row>
          <Row className="text-center">
            <Col>
              <button className="book-table-btn mt-3" onClick={reserve}>Rezervă masa</button>
            </Col>
          </Row>

        </>
      )}
    </div>
  );
}
