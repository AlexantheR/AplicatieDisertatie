import React, { useState, useEffect } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import { useDispatch, useSelector } from 'react-redux';
import { makeUserPremium, updateUserPremiumStatus } from '../actions/userActions';
import Loading from '../components/Loading';
import Success from '../components/Success';
import Error from '../components/Error';

export default function PremiumCheckout() {
  const userState = useSelector(state => state.userReducer) || {};
  const { loading, error, success } = userState;
  const dispatch = useDispatch();
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  useEffect(() => {
    if (userState?.isPremium) {
      setPaymentCompleted(true);
    }
  }, [userState]);

  const handlePayment = async (token) => {
    try {
      dispatch(makeUserPremium(token.email));
      dispatch(updateUserPremiumStatus(true)); // Update the premium status in the Redux store
      setPaymentCompleted(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {loading && <Loading />}
      {error && <Error error="Ceva nu a mers bine!" />}
      {success && <Success success="Utilizatorul a fost marcat ca Premium!" />}

      {!paymentCompleted ? (
        <StripeCheckout
          amount={2500}
          token={handlePayment}
          stripeKey="pk_test_51MxrSbBLFgjsWwKCbsXG1ISF3luoqebwtbEnUqI4r7t10fFSRmtGKgiTmAhqeBGfP2H7yTrACseB7bimLCTFQ9Fr00ezwARnpD"
          currency="RON"
        >
          <button className="book-table-btn">Plateste pentru Premium</button>
        </StripeCheckout>
      ) : (
        <p>Plata a fost efectuată cu succes!</p>
      )}
    </div>
  );
}
