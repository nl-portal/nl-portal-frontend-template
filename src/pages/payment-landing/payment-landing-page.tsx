import * as React from 'react';
import './payment-landing-page.css';
import {Redirect, useLocation} from 'react-router-dom';
import {useContext, useEffect, useState} from 'react';
import {config} from '../../config';
import {Heading2} from '@gemeente-denhaag/components-react';
import {FormattedMessage} from 'react-intl';
import {KeycloakContext} from '@gemeente-denhaag/nl-portal-authentication';
import {LoadingComponent} from '../../components/loading';

const PaymentLandingPage = () => {
  const location = useLocation();
  const returnMac = location?.search.substring(
    location?.search.indexOf('=') + 1,
    location?.search.lastIndexOf('&')
  );
  const hostedCheckoutId = location?.search.split('&hostedCheckoutId=')[1];
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [paymentStatus, setPaymentStatus]: any = useState(null);
  const [paymentUrl, setPaymentUrl]: any = useState('');
  const {keycloakToken} = useContext(KeycloakContext);

  useEffect(() => {
    if (returnMac != null && hostedCheckoutId != null) {
      fetch(
        `${config.REST_URI}/return?RETURNMAC=${returnMac}&hostedCheckoutId=${hostedCheckoutId}`,
        {
          headers: new Headers({
            Authorization: `Bearer ${keycloakToken}`,
            'Content-Type': 'application/json',
          }),
        }
      )
        .then(res => res.json())
        .then(
          result => {
            setIsLoaded(true);
            setPaymentStatus(result);
          },
          error => {
            setIsLoaded(true);
            setError(error);
          }
        );
    }
  }, []);

  useEffect(() => {
    if (paymentStatus && !paymentStatus?.paymentOk) {
      fetch(`${config.REST_URI}/payment?caseId=${paymentStatus.caseId}`, {
        method: 'GET',
        headers: new Headers({
          Authorization: `Bearer ${keycloakToken}`,
          'Content-Type': 'application/json',
        }),
      })
        .then(res => res.json())
        .then(
          result => {
            setPaymentUrl(result.redirectUrl);
          },
          error => {
            console.log(error);
          }
        );
    }
  }, [paymentStatus]);

  const getPaymentStatus = status => {
    return (
      <React.Fragment>
        {status.paymentOk && status.productaanvraagOk
          ? paymentSuccessful()
          : !status.paymentOk
          ? paymentFailed()
          : status.paymentOk && !status.productaanvraagOk
          ? productAanvraagFailed()
          : genericError()}
      </React.Fragment>
    );
  };

  const removeEntryUrlFromSession = () => {
    const entryUrl = 'entryUrl';
    if (sessionStorage.getItem(entryUrl) !== null) {
      // Remove entryUrl if it exists in the session
      sessionStorage.removeItem(entryUrl);
    }
  };

  const paymentSuccessful = () => {
    return (
      <React.Fragment>
        <Heading2>
          <FormattedMessage id="pageTitles.paymentLandingSuccessful" />
        </Heading2>
        <p>Binnen enkele minuten kunt u uw aanvraag inzien onder Lopende zaken.</p>
      </React.Fragment>
    );
  };

  const paymentFailed = () => {
    return (
      <React.Fragment>
        <Heading2>
          <FormattedMessage id="pageTitles.paymentLandingFailed" />
        </Heading2>
        <p>
          Er is iets mis gegegaan tijdens het betalen waardoor de betaling niet gelukt is. Klik
          hieronder om de betaling opnieuw te proberen.
        </p>
        <a className={'btn btn-primary'} role="button" rel="noopener noreferrer" href={paymentUrl} onClick={removeEntryUrlFromSession}>
          Klik hier om de betaling opnieuw te proberen
        </a>
      </React.Fragment>
    );
  };

  const productAanvraagFailed = () => {
    return (
      <React.Fragment>
        <Heading2>
          <FormattedMessage id="pageTitles.paymentLandingProductAanvraagFailed" />
        </Heading2>
        <p>
          Uw betaling is gelukt, maar helaas waren wij niet in staat uw aanvraag verder te
          verwerken.
          <br />
          Neem alstublieft contact op met Gemeente Amsterdam op telefoonnummer: 14020.
          <br />
          <br />
          Excuses voor het ongemak
        </p>
      </React.Fragment>
    );
  };

  const genericError = () => {
    return (
      <React.Fragment>
        <Heading2>
          <FormattedMessage id="pageTitles.paymentLandingGenericError" />
        </Heading2>
        <p>
          Probeer het later nog eens of neem contact op met Gemeente Amsterdam op telefoonnummer:
          14020
          <br />
          <br />
          Excuses voor het ongemak
        </p>
      </React.Fragment>
    );
  };

  if (returnMac == null || hostedCheckoutId == null || error) {
    return <Redirect to="/" />;
  } else if (paymentStatus && isLoaded) {
    return <React.Fragment>{getPaymentStatus(paymentStatus)}</React.Fragment>;
  } else {
    return <LoadingComponent></LoadingComponent>;
  }
};

export {PaymentLandingPage};
