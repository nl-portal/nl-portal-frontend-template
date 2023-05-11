import * as React from 'react';
import {useHistory} from 'react-router-dom';
import {gql, useQuery} from '@apollo/client';
import {useIntl} from 'react-intl';
import {Card, Paragraph} from '@gemeente-denhaag/components-react';
import styles from './home-page.module.scss';

const ALL_CASES_QUERY = gql`
  query GetAllCaseDefinitions {
    allCaseDefinitions {
      id
      schema
      statusDefinition
    }
  }
`;

const HomePage = () => {
  const {data} = useQuery(ALL_CASES_QUERY);
  const intl = useIntl();
  const history = useHistory();

  if (data != null) {
    return (
      <React.Fragment>
        <h2 className="utrecht-heading-2 utrecht-heading-2--distanced">
          {intl.formatMessage({id: 'pageTitles.welcome'})}
        </h2>
        <br />
        <Paragraph>
          Via dit portaal kunt u een aanvraag indienen met betrekking tot (tijdelijke) verhuur
          onder bepaalde omstandigheden, voor woningruil of voor huisbewaring. Onder Lopende
          zaken kunt u de status van uw aanvraag inzien. Onder Taken kunt u aanvullende informatie
          aanleveren, indien u daartoe per e-mail een verzoek van de gemeente heeft ontvangen.
        </Paragraph>
        <br />
        <br />

        <Paragraph>
          <strong>Aanvraag doen</strong>
        </Paragraph>

        <br />
        <div className={styles.actions}>
          {data.allCaseDefinitions.map(caseDefinition => (
            <Card
              key={caseDefinition.id}
              variant="basic"
              title=""
              subTitle={intl.formatMessage({id: 'home.' + caseDefinition.id})}
              date={new Date()}
              onClick={() =>
                history.push({
                  pathname: `/formulier/${caseDefinition.id}`,
                })
              }
            />
          ))}
        </div>
      </React.Fragment>
    );
  } else {
    return (
      <React.Fragment>
        <div>Loading</div>
      </React.Fragment>
    );
  }
};

export {HomePage};
