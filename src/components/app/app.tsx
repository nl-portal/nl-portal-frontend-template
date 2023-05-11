import React, {Fragment} from 'react';
import '@gemeente-denhaag/design-tokens-components';
import '@gemeente-denhaag/nl-portal-user-interface/dist/index.css';
import '../../styles/nl-portal-design-tokens.css';
import {KeycloakWrapper} from '@gemeente-denhaag/nl-portal-authentication';
import {LocalizationProvider} from '@gemeente-denhaag/nl-portal-localization';
import {ApiWrapper} from '@gemeente-denhaag/nl-portal-api';
import {
  CasePage,
  CasesPage,
  DocumentsPage,
  NotificationsPage,
  Layout,
  PortalFooter,
  PortalPage,
} from '@gemeente-denhaag/nl-portal-user-interface';
import {ArchiveIcon, DocumentIcon, GridIcon, InboxIcon} from '@gemeente-denhaag/icons';
import {FormPage} from '../../pages/form';
import {CUSTOM_MESSAGES} from '../../i18n';
import {ReactComponent as HeaderLogo} from '../../assets/header-logo.svg';
import Facet from '../../assets/facet.png';
import {config} from '../../config';
import {HomePage} from '../../pages/home';
import {PaymentLandingPage} from '../../pages/payment-landing';
import {TasksPage} from '../../pages/tasks';
import {TaskPage} from '../../pages/task';

const pages: Array<PortalPage> = [
  {
    icon: <GridIcon />,
    pageComponent: <HomePage />,
    path: '/',
    titleTranslationKey: 'overview',
    showInMenu: true,
    isHome: true,
  },
  {
    icon: <InboxIcon />,
    pageComponent: <NotificationsPage />,
    path: '/berichten',
    titleTranslationKey: 'notifications',
    showInMenu: false,
    showMessagesCount: true,
  },
  {
    icon: <ArchiveIcon />,
    pageComponent: <CasesPage showCaseIdentification/>,
    path: '/zaken',
    titleTranslationKey: 'cases',
    showInMenu: true,
    children: [
      {
        icon: <ArchiveIcon />,
        pageComponent: <CasePage statusHistoryFacet={<img src={Facet} alt="" />} />,
        path: '/zaak',
        titleTranslationKey: 'cases',
        showLinkToParent: true,
      },
      {
        icon: <ArchiveIcon />,
        pageComponent: <DocumentsPage />,
        path: '/zaak/documenten',
        titleTranslationKey: 'cases',
      },
    ],
  },
  {
    icon: <DocumentIcon />,
    pageComponent: <TasksPage />,
    path: '/taken',
    titleTranslationKey: 'tasks',
    showInMenu: true,
  },
  {
    icon: <DocumentIcon />,
    pageComponent: <TaskPage />,
    path: '/taken/:formulierId',
    titleTranslationKey: 'task',
    showInMenu: false,
  },
  {
    icon: <DocumentIcon />,
    pageComponent: <FormPage />,
    path: '/formulier/:caseDefinitionId',
    titleTranslationKey: 'form',
    showInMenu: false,
  },
  {
    icon: <GridIcon />,
    pageComponent: <PaymentLandingPage />,
    path: '/payment-landing',
    titleTranslationKey: 'overview',
    showInMenu: false,
  },
];

const footer: PortalFooter = [
  {
    titleTranslationKey: 'amsterdam',
    links: [
      {linkTranslationKey: 'goToAmsterdam', url: 'https://www.amsterdam.nl', hrefLang: 'nl'},
      {linkTranslationKey: 'goToAmsterdam', url: 'https://www.amsterdam.nl/en/', hrefLang: 'en'},
    ],
  },
  {
    titleTranslationKey: 'disclaimers',
    links: [
      {
        linkTranslationKey: 'accessibility',
        url: '',
        hrefLang: 'nl',
      },
    ],
  },
];

localStorage.setItem('NL_PORTAL_LANG', 'nl-NL');

const App = () => (
  <Fragment>
    <KeycloakWrapper
        clientId={config.KEYCLOAK_CLIENT_ID}
        realm={config.KEYCLOAK_REALM}
        url={config.KEYCLOAK_URL}
        redirectUri={config.KEYCLOAK_REDIRECT_URI}
    >
      <ApiWrapper graphqlUri={config.GRAPHQL_URI} restUri={config.REST_URI}>
        <LocalizationProvider customMessages={CUSTOM_MESSAGES}>
          <Layout
              pages={pages}
              headerLogo={<HeaderLogo />}
              headerLogoSmall={<HeaderLogo />}
              footer={footer}
          />
        </LocalizationProvider>
      </ApiWrapper>
    </KeycloakWrapper>
  </Fragment>
);

export {App};
