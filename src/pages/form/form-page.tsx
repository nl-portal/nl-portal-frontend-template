import * as React from 'react';
import {Form} from '@formio/react';
import {LocaleContext} from '@gemeente-denhaag/nl-portal-localization';
import {useIntl} from 'react-intl';
import {useContext, useEffect, useState} from 'react';
import {useQuery, useMutation, gql} from '@apollo/client';
import {Helmet} from 'react-helmet';
import {useParams} from 'react-router-dom';
import './form-page.css';
import {PaymentPage} from '../payment';
import {RequestReceivedPage} from '../request-received';
import {KeycloakContext} from '@gemeente-denhaag/nl-portal-authentication';
import {config} from '../../config';
import {LoadingComponent} from '../../components/loading';

const FORM_QUERY = gql`
  query GetFormDefinitionByName($name: String!) {
    getFormDefinition(name: $name) {
      formDefinition
    }
  }
`;

const CREATE_CASE_MUTATION = gql`
  mutation CreateCase($submission: JSON!, $caseDefinitionId: String!) {
    processSubmission(submission: $submission, caseDefinitionId: $caseDefinitionId) {
      caseId
    }
  }
`;

const FormPage = () => {
    const FORMIO_TOKEN_LOCAL_STORAGE_KEY = 'formioToken';
    const params = useParams();
    const {hrefLang} = useContext(LocaleContext);
    const intl = useIntl();

    const [caseDefinitionId, setCaseDefinitionId] = useState(params['caseDefinitionId']);
    const [caseId, setCaseId] = useState('');
    const [createCase] = useMutation(CREATE_CASE_MUTATION);
    const [submission, setSubmission]: any = useState({submission: {}});
    const [submissionSuccessfully, setSubmissionSuccessfully] = useState(false);
    const [isLoading, setIsLoading]: any = useState(false);
    const [formOptions, setFormOptions] = useState({
        language: hrefLang,
        i18n: {
            [hrefLang]: {
                next: intl.formatMessage({id: 'formTranslation.next'}),
                previous: intl.formatMessage({id: 'formTranslation.previous'}),
                cancel: intl.formatMessage({id: 'formTranslation.cancel'}),
                submit: intl.formatMessage({id: 'formTranslation.submit'}),
                error: intl.formatMessage({id: 'formTranslation.error'}),
                required: intl.formatMessage({id: 'formTranslation.required'}),
                'File Name': intl.formatMessage({id: 'formTranslation.fileName'}),
                Size: intl.formatMessage({id: 'formTranslation.size'}),
                'Drop files to attach,': intl.formatMessage({id: 'formTranslation.dropFilesToAttach'}),
                or: intl.formatMessage({id: 'formTranslation.or'}),
                'Use Camera,': intl.formatMessage({id: 'formTranslation.useCamera'}),
                browse: intl.formatMessage({id: 'formTranslation.browse'}),
            },
        },
    });
    const {keycloakToken} = useContext(KeycloakContext);

    const {loading, error, data} = useQuery(FORM_QUERY, {
        variables: {name: params['caseDefinitionId'] + '.start'},
    });

    useEffect(() => {
        if (keycloakToken) {
            localStorage.setItem(FORMIO_TOKEN_LOCAL_STORAGE_KEY, keycloakToken);
        }
    }, [keycloakToken]);

    useEffect(() => {
        onPageSwitch();
    }, []);

    const setFormSubmission = submission => {
        setSubmission(submission);
    };

    const onFormSubmit = submission => {
        console.log('CaseDefinitionKey', caseDefinitionId)
        if (submission?.state === 'submitted') {
            setIsLoading(true);
            createCase({
                variables: {submission: submission.data, caseDefinitionId: caseDefinitionId},
            }).then(value => {
                setCaseId(value.data.processSubmission.caseId);
                setSubmissionSuccessfully(true);
                onPageSwitch();
                setIsLoading(false);
            });
        }
    };

    const onFormSubmitError = () => {
        setIsLoading(false);
    }

    const redrawForm = form => {
        getUserInfo(form);
        form.triggerRedraw();
    };

    const getUserInfo = form => {
        fetch(`${config.REST_URI}/user/info`, {
            method: 'GET',
            headers: new Headers({
                Authorization: `Bearer ${keycloakToken}`,
                'Content-Type': 'application/json',
            }),
        })
            .then(res => res.json())
            .then(
                result => {
                    prefillUserInfoFormioForm(form, result);
                },
                error => {
                    console.log(error);
                }
            );
    };

    const prefillUserInfoFormioForm = (form, result) => {
        // check case for backwards compatibility
        if (caseDefinitionId === 'verhuur-opkoopbescherming') {
            form.submission.data.aanvraag.aanvrager.type = result.type;
            if (result.bsn != null) {
                form.submission.data.aanvraag.aanvrager.bsn = result.bsn;
            }

            if (result.kvk != null) {
                form.submission.data.aanvraag.aanvrager.kvk = result.kvk;
            }
        }
        else {
            if (result.bsn != null) {
                form.submission.data.bsn = result.bsn;
            }

            if (result.kvk != null) {
                form.submission.data.kvk = result.kvk;
            }
        }
        setSubmission(form.submission);
    };

    const onPageSwitch = (): void => {
        window.scrollTo(0, 0);
    };

    return (
        <React.Fragment>
            <Helmet>
                <link href="https://cdn.form.io/formiojs/formio.full.min.css" rel="stylesheet"/>
            </Helmet>
            {!loading && !submissionSuccessfully && !isLoading ? (
                <Form
                    form={data.getFormDefinition.formDefinition}
                    options={formOptions}
                    submission={submission}
                    formReady={redrawForm}
                    onChange={setFormSubmission}
                    onSubmit={onFormSubmit}
                    onSubmitError={onFormSubmitError}
                    onPrevPage={onPageSwitch}
                    onNextPage={onPageSwitch}
                />
            ) : isLoading ? (
              <LoadingComponent></LoadingComponent>
            ) : submissionSuccessfully /* TODO: find solution for dynamic conditional payment redirection */ ? (
                <PaymentPage caseId={caseId}/>
            ) : submissionSuccessfully ? (
                <RequestReceivedPage/>
            ) : (
                ''
            )}
        </React.Fragment>
    );
};

export {FormPage};
