import { NavigationItem } from "@nl-portal/nl-portal-user-interface";
import {
  EmailIcon,
  HouseIcon,
  InboxIcon,
  UserLoggedInIcon
} from "@gemeente-denhaag/icons";
import { paths } from "./paths";

export const menuItems: NavigationItem[][] = [
  [
    {
      titleTranslationKey: "overview",
      path: paths.overview,
      icon: <HouseIcon />,
    },
  ],[
    {
      titleTranslationKey: "messages",
      path: paths.messages,
      icon: <EmailIcon />
    }
  ],
  [
    {
      titleTranslationKey: "cases",
      path: paths.cases,
      icon: <InboxIcon />,
    },
  ],
  [
    {
      titleTranslationKey: "account",
      path: paths.account,
      icon: <UserLoggedInIcon />,
    },
  ],
];
