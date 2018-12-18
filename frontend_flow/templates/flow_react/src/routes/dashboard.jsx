// import Dashboard from "views/Dashboard/Dashboard";
import Dashboard from "views/Home/Home";
import UserProfile from "views/UserProfile/UserProfile";
import StaffList from "views/StaffList/StaffList";
// import Typography from "views/Typography/Typography";
// import Icons from "views/Icons/Icons";
// import Maps from "views/Maps/Maps";
// import Notifications from "views/Notifications/Notifications";
// import Upgrade from "views/Upgrade/Upgrade";
import FlowTemplate from 'views/FlowTemplate/FlowTemplate';
import Process from 'views/Process/Process';
import ProcessList from 'views/ProcessList/ProcessList';

const dashboardRoutes = [
  // {
  //   path: "/dashboard",
  //   name: "首页",
  //   icon: "pe-7s-graph",
  //   component: Dashboard
  // },
  {
    path: "/dashboard",
    name: "首页",
    icon: "pe-7s-graph",
    component: Dashboard
  },
  {
    path: "/process-list",
    name: "合同事务管理",
    icon: "pe-7s-display1",
    component: ProcessList
  },
  {
    path: "/process/:id",
    name: "Process",
    component: Process
  },
  {
    path: "/staff",
    name: "职员管理",
    icon: "pe-7s-users",
    component: StaffList
  },
  {
    path: "/flow_template",
    name: "流程模板",
    icon: "pe-7s-copy-file",
    component: FlowTemplate
  },
  {
    path: "/user/:id",
    name: "User Profile",
    component: UserProfile
  },
  // {
  //   path: "/typography",
  //   name: "Typography",
  //   icon: "pe-7s-news-paper",
  //   component: Typography
  // },
  // { path: "/icons", name: "Icons", icon: "pe-7s-science", component: Icons },
  // { path: "/maps", name: "Maps", icon: "pe-7s-map-marker", component: Maps },
  // {
  //   path: "/notifications",
  //   name: "Notifications",
  //   icon: "pe-7s-bell",
  //   component: Notifications
  // },
  // {
  //   upgrade: true,
  //   path: "/upgrade",
  //   name: "Upgrade to PRO",
  //   icon: "pe-7s-rocket",
  //   component: Upgrade
  // },
  { redirect: true, path: "/", to: "/dashboard", name: "Dashboard" },
];

export default dashboardRoutes;