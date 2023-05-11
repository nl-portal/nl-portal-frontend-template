import * as React from 'react';
import './payment-page.css';
import {useContext, useEffect, useState} from 'react';
import {config} from '../../config';
import {KeycloakContext} from '@gemeente-denhaag/nl-portal-authentication';
import {Heading2} from "@gemeente-denhaag/components-react";
import {FormattedMessage} from "react-intl";
import {LoadingComponent} from '../../components/loading';

const PaymentPage = props => {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [payment, setPayment] = useState({paymentRequired: false, paymentAmount:null, redirectUrl: ''});
  const {keycloakToken} = useContext(KeycloakContext);

  useEffect(() => {
    fetch(`${config.REST_URI}/payment?caseId=${props.caseId}`, {
      method: 'GET',
      headers: new Headers({
        Authorization: `Bearer ${keycloakToken}`,
        'Content-Type': 'application/json',
      }),
    })
      .then(res => res.json())
      .then(
        result => {
            if (result.paymentAmount) {
                result.paymentAmount = (result.paymentAmount / 100).toLocaleString('nl-NL', {style: 'currency',currency:'EUR'});
            }
            setPayment(result);
            setIsLoaded(true);
        },
        error => {
          console.log(error);
          setIsLoaded(true);
          setError(error);
        }
      );
  }, []);

  if (error) {
    return <div>Error: </div>;
  } else if (!isLoaded) {
    return <LoadingComponent></LoadingComponent>;
  } else if (payment.paymentRequired) {
    return (
      <React.Fragment>
        <h2 className="utrecht-heading-2 utrecht-heading-2--distanced pb-1 ">Betalen</h2>
        <p>U wordt nu doorverwezen om de leges van {payment.paymentAmount} te betalen.</p>
        <a className={'btn btn-primary'} role="button" rel="noopener noreferrer" href={payment.redirectUrl}>
          Klik hier om te betalen!
        </a>
      </React.Fragment>
    );
  } else {
      return (
          <React.Fragment>
              <Heading2>
                  <FormattedMessage id="pageTitles.submissionSuccessful" />
              </Heading2>
              <p>Binnen enkele minuten kunt u uw aanvraag inzien onder Lopende zaken.</p>
          </React.Fragment>
      );
  }
};

export {PaymentPage};
