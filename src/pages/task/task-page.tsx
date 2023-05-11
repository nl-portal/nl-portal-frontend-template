import * as React from 'react';
import {Link} from 'react-router-dom';
import {useContext, useEffect, useState} from 'react';
import {Form} from '@formio/react';
import {gql, useQuery} from '@apollo/client';
import {Helmet} from 'react-helmet';
import {useLocation} from 'react-router-dom';
import './task-page.css';
import {config} from '../../config';
import {KeycloakContext} from '@gemeente-denhaag/nl-portal-authentication';
import _ from 'lodash';

const FORM_QUERY = gql`
  query GetFormDefinitionByName($name: String!) {
    getFormDefinition(name: $name) {
      formDefinition
    }
  }
`;

const TaskPage = () => {
  let location: any = useLocation();
  const [formName, setFormName] = useState('');
  const [verwerkerId, setVerwerkerId] = useState('');
  const [submission, setSubmission] = useState({submission: {}});
  const [submissionSuccessfully, setSubmissionSuccessfully] = useState(false);
  const {keycloakToken} = useContext(KeycloakContext);

  const {loading, data} = useQuery(FORM_QUERY, {
    variables: {name: formName},
  });

  useEffect(() => {
    getTaskData();
  }, []);

  const getTaskData = () => {
    if (location.state != null && Object.keys(location.state).length > 0) {
      localStorage.setItem(location.state.name, JSON.stringify(location.state));
    } else {
      const storage: any = localStorage.getItem(
        location?.search.substring(
          location?.search.indexOf('=') + 1,
          location?.search.lastIndexOf('&')
        )
      );
      const savedStated = storage != null ? JSON.parse(storage) : null;

      if (savedStated?.data != null) {
        location.state = savedStated;
      }
    }
    setFormName(location.state.name);
    setVerwerkerId(location.state.verwerker_taak_id);
    transformPrefilledDataToFormioSubmission(location.state.data);
  };

  const transformPrefilledDataToFormioSubmission = data => {
    const keys = Object.keys(data);
    let prefillData: any = {};
    const arrayPrefilledData: any = [];
    keys.map(key => {
      prefillData = key
        .split('.')
        .reverse()
        .reduce((a, v, i) => {
          if (i === 0) {
            return {...a, [v]: data[key]};
          } else {
            return {[v]: a};
          }
        }, {});

      arrayPrefilledData.push(prefillData);
    });
    let payload = {};
    arrayPrefilledData.map(item => {
      payload = _.merge(payload, item);
    });

    submission['data'] = payload;
    setSubmission(submission);
  };

  const completeTask = data => {
    fetch(`${config.REST_URI}/task/submission`, {
      method: 'POST',
      headers: new Headers({
        Authorization: `Bearer ${keycloakToken}`,
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({verwerker_taak_id: verwerkerId, verzonden_data: data}),
    })
      .then(res => res.text())
      .then(
        result => {
          let parsedResult;
          if (result !== '') {
            parsedResult = JSON.parse(result);
          }
          if (parsedResult == null || parsedResult?.status === 200) {
            setSubmissionSuccessfully(true);
          } else {
            setSubmissionSuccessfully(false);
          }
        },
        error => {
          console.log(error);
        }
      );
  };

  const setFormSubmission = submissionForm => {
    if (_.isEqual(submissionForm.data, submission['data'])) {
      submissionForm.data = {...submissionForm.data, ...submission['data']};
      setSubmission(submissionForm);
    }
  };

  const onFormSubmit = submission => {
    if (submission?.state === 'submitted') {
      completeTask(submission.data);
    }
  };

  const redrawForm = form => {
    form.triggerRedraw();
  };

  const removeLocalStorage = () => {
    localStorage.removeItem(formName);
  };

  const getSubmittedMessage = () => (
    <React.Fragment>
      <h2 className="utrecht-heading-2 utrecht-heading-2--distanced pb-1">Taak is afgerond</h2>
      <Link
        onClick={removeLocalStorage}
        className={'btn btn-primary'}
        role="button"
        rel="noopener noreferrer"
        to="/taken"
      >
        Klik hier om terug te gaan naar je openstaande taken
      </Link>
    </React.Fragment>
  );

  return (
    <React.Fragment>
      <Helmet>
        <link href="https://cdn.form.io/formiojs/formio.full.min.css" rel="stylesheet" />
      </Helmet>
      {!loading && !submissionSuccessfully ? (
        <Form
          form={data?.getFormDefinition?.formDefinition}
          formReady={redrawForm}
          submission={submission}
          onChange={setFormSubmission}
          onSubmit={onFormSubmit}
        />
      ) : (
        getSubmittedMessage()
      )}
    </React.Fragment>
  );
};

export {TaskPage};
