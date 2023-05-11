import * as React from 'react';
import {useContext, useEffect, useState} from 'react';
import {
  Heading2,
  Card,
  Tabs,
  Tab,
  TabContext,
  TabPanel,
  Paragraph,
} from '@gemeente-denhaag/components-react';
import {FormattedMessage, useIntl} from 'react-intl';
import Skeleton from 'react-loading-skeleton';
import {BREAKPOINTS, useMediaQuery, useQuery} from '@gemeente-denhaag/nl-portal-user-interface';
import {useLocation, useHistory} from 'react-router-dom';
import styles from './tasks-page.module.scss';
import {config} from '../../config';
import {KeycloakContext} from '@gemeente-denhaag/nl-portal-authentication';

const TasksPage = () => {
  const intl = useIntl();
  intl.formatMessage({id: 'formTranslation.next'});
  const [tabNumber, setTabNumber] = useState(0);
  const [tasks, setTasks] = useState([] as any);
  const [loading, setLoading] = useState(true);

  const isTablet = useMediaQuery(BREAKPOINTS.TABLET);
  const TAB_QUERY_PARAM = 'tab';
  const location = useLocation();
  const history = useHistory();
  const query = useQuery();
  const queryTab = Number(query.get(TAB_QUERY_PARAM));
  const getTaskUrl = (formulierId: string, verwerkerTaakId: string) =>
    `?formulier=${formulierId}&id=${verwerkerTaakId}`;
  const {keycloakToken} = useContext(KeycloakContext);

  useEffect(() => {
    getTasks();
  }, []);

  const getTasks = () => {
    fetch(`${config.REST_URI}/task`, {
      headers: new Headers({
        Authorization: `Bearer ${keycloakToken}`,
      }),
    })
      .then(res => res.json())
      .then(
        result => {
          setTasks(result.reverse());
          setLoading(false);
        },
        error => {
          console.log(error);
          setLoading(false);
        }
      );
  };

  const getTaskCards = (completed: boolean) => {
    return (
      tasks
        .filter(task => {
          const taskCompleted = task?.status?.completed;
          return completed ? taskCompleted : !taskCompleted;
        })
        .map(task => (
          <div className={styles.tasks__card} key={task.verwerker_taak_id}>
            <Card
              variant="basic"
              title={intl.formatMessage({id: task.formulier_id})}
              date={new Date(task.date)}
              onClick={() =>
                history.push({
                  pathname: '/taken/taak',
                  search: getTaskUrl(task.formulier_id, task.verwerker_taak_id),
                  state: task,
                })
              }
            />
          </div>
        )) || []
    );
  };

  const getNoDataMessage = (completed: boolean) => (
    <Paragraph>
      <FormattedMessage id={completed ? 'tasks.noClosedTasks' : 'tasks.noOpenTasks'} />
    </Paragraph>
  );

  const getTabContent = (completed: boolean) => {
    const cards = getTaskCards(completed);
    return cards.length > 0 ? cards : getNoDataMessage(completed);
  };

  const getSkeleton = () => {
    const getSkeletonCard = (key: number) => (
      <div
        className={styles.tasks__card}
        key={key}
        aria-busy
        aria-disabled
        aria-label={intl.formatMessage({id: 'element.loading'})}
      >
        <Skeleton height={220} />
      </div>
    );

    return (
      <React.Fragment>
        {getSkeletonCard(0)}
        {getSkeletonCard(1)}
      </React.Fragment>
    );
  };

  useEffect(() => {
    if (queryTab !== tabNumber) {
      history.push(`${location.pathname}?${TAB_QUERY_PARAM}=${tabNumber}`);
    }
  }, [tabNumber]);

  useEffect(() => {
    if (queryTab && queryTab !== tabNumber) {
      setTabNumber(queryTab);
    }
  }, [queryTab]);

  return (
    <React.Fragment>
      <section className={styles.tasks}>
        <header className={styles.tasks__header}>
          <Heading2>
            <FormattedMessage id="pageTitles.tasks" />
          </Heading2>
        </header>
        <TabContext value={tabNumber.toString()}>
          <Tabs
            variant={isTablet ? 'standard' : 'fullWidth'}
            value={tabNumber}
            onChange={(_event: React.ChangeEvent<unknown>, newValue: number) => {
              setTabNumber(newValue);
            }}
          >
            <Tab label={intl.formatMessage({id: 'titles.openTasks'})} value={0} />
          </Tabs>
          <TabPanel value="0">
            <div className={styles.tasks__cards}>
              {loading ? getSkeleton() : getTabContent(false)}
            </div>
          </TabPanel>
        </TabContext>
      </section>
    </React.Fragment>
  );
};

export {TasksPage};
