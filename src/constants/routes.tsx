import {
  AccountPage,
  CasesList,
  CaseDetailsPage,
  EditAccountPage,
  MessagesPage,
  MessageDetailsPage,
  NoMatchPage,
  OverviewPage,
  TasksList,
  TaskDetailsPage,
} from "@nl-portal/nl-portal-user-interface";
import { paths } from "./paths";
import { config } from "./config";
import { Navigate } from "react-router-dom";
import ThemeSampleOverviewPage from "../pages/ThemeSampleOverviewPage";
import ThemeSampleListPage from "../pages/ThemeSampleListPage";
import ThemeSampleDetailPage from "../pages/ThemeSampleDetailPage";

export const routes = [
  {
    path: paths.overview,
    element: <OverviewPage showIntro fetchTasksLength={0} />,
  },
  {
    path: paths.cases,
    children: [
      {
        index: true,
        element: <CasesList />,
      },
      {
        path: paths.case(),
        element: <CaseDetailsPage showContactTimeline />,
      },
    ],
  },
  {
    path: paths.tasks,
    children: [
      {
        index: true,
        element: <TasksList/>,
      },
      {
        path: paths.task(),
        element: <TaskDetailsPage/>,
      },
    ],
  },
  {
    path: paths.messages,
    children: [
      {
        index: true,
        element: <MessagesPage />,
      },
      {
        path: paths.message(),
        element: <MessageDetailsPage/>,
      },
    ],
  },
  {
    path: paths.themeOverview("sample"),
    children: [
      {
        index: true,
        element: <ThemeSampleOverviewPage />,
      },
      {
        path: paths.themeSub("sample", "contracten"),
        element: <ThemeSampleListPage />,
      },
      {
        path: paths.themeDetails("sample"),
        element: <ThemeSampleDetailPage />,
      },
    ],
  },
  {
    path: paths.account,
    children: [
      {
        index: true,
        element: (
          <AccountPage
            showInhabitantAmount={config.SHOW_INHABITANT_AMOUNT}
            addressResearchUrl={config.ADDRESS_RESEARCH_URL}
          />
        ),
      },
      {
        path: paths.editAccount,
        element: <EditAccountPage />,
      },
    ],
  },
  {
    path: "/keycloak/callback",
    element: <Navigate to={sessionStorage.getItem("entryUrl") || "/"} />,
  },
  {
    path: paths.noMatch,
    element: <NoMatchPage contactLink={{ target: "_blank" }} />,
  },
  {
    path: "*",
    element: <Navigate to={paths.noMatch} />,
  },
];
