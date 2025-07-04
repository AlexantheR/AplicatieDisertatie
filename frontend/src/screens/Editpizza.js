import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { editPizza, getPizzaById } from "../actions/pizzaActions";
import Error from "../components/Error";
import Loading from "../components/Loading";
import Success from "../components/Success";
export default function Editpizza({ match }) {
    const dispatch = useDispatch();
    const [name, setname] = useState("");
    const [smallprice, setsmallprice] = useState();
    const [mediumprice, setmediumprice] = useState();
    const [largeprice, setlargeprice] = useState();
    const [image, setimage] = useState("");
    const [description, setdescription] = useState("");
    const [category, setcategory] = useState("");

    const getpizzabyidstate = useSelector((state) => state.getPizzaByIdReducer);

    const { pizza, error, loading } = getpizzabyidstate;
    const { pizzaid } = useParams();

    const editpizzastate = useSelector((state) => state.editPizzaReducer)
    const { editloading, editerror, editsuccess } = editpizzastate;

    useEffect(() => {

        if (pizza) {
            if (pizza._id == pizzaid) {
                setname(pizza.name)
                setdescription(pizza.description)
                setcategory(pizza.category)
                setsmallprice(pizza.prices[0]['mica'])
                setmediumprice(pizza.prices[0]['medie'])
                setlargeprice(pizza.prices[0]['mare'])
                setimage(pizza.image)
            }
            else {
                dispatch(getPizzaById(pizzaid));
            }

        }
        else {
            dispatch(getPizzaById(pizzaid));
        }



    }, [pizza, dispatch]);

    function formHandler(e) {
        e.preventDefault();

        const editedpizza = {
            _id: pizzaid,
            name,
            image,
            description,
            category,
            prices: {
                mica: smallprice,
                medie: mediumprice,
                mare: largeprice,
            },
        };

        dispatch(editPizza(editedpizza))
    }

    return (
        <div>



            <div className="text-left shadow-lg p-3 mb-5 bg-white rounded">
                <h1>Editeaza Pizza</h1>
                {loading && <Loading />}
                {error && <Error error="Ceva nu a mers bine!" />}
                {editsuccess && (<Success success='Pizza editata cu succes' />)}
                {editloading && (<Loading />)}

                <form onSubmit={formHandler}>
                    <input
                        className="form-control"
                        type="text"
                        placeholder="denumire"
                        value={name}
                        onChange={(e) => {
                            setname(e.target.value);
                        }}
                    />
                    <input
                        className="form-control"
                        type="text"
                        placeholder="pret varianta mica"
                        value={smallprice}
                        onChange={(e) => {
                            setsmallprice(e.target.value);
                        }}
                    />
                    <input
                        className="form-control"
                        type="text"
                        placeholder="pret varianta medie"
                        value={mediumprice}
                        onChange={(e) => {
                            setmediumprice(e.target.value);
                        }}
                    />
                    <input
                        className="form-control"
                        type="text"
                        placeholder="pret varianta mare"
                        value={largeprice}
                        onChange={(e) => {
                            setlargeprice(e.target.value);
                        }}
                    />
                    <input
                        className="form-control"
                        type="text"
                        placeholder="categorie"
                        value={category}
                        onChange={(e) => {
                            setcategory(e.target.value);
                        }}
                    />
                    <input
                        className="form-control"
                        type="text"
                        placeholder="descriere"
                        value={description}
                        onChange={(e) => {
                            setdescription(e.target.value);
                        }}
                    />
                    <input
                        className="form-control"
                        type="text"
                        placeholder="url imagine"
                        value={image}
                        onChange={(e) => {
                            setimage(e.target.value);
                        }}
                    />
                    <button className="book-table-btn mt-3" type="submit">
                        Editeaza Pizza
                    </button>
                </form>
            </div>
        </div>
    );
}
