// import doGet from './server/webapp';
// import './es6';

// global.doGet = doGet;

// global.sendmail = (email = 'amit@labnol.org') => {
//   GmailApp.sendEmail(email, 'Apps Script Starter', 'Hello Google Apps Script');
// };

import { showSidebar, onOpen, include } from './sidebar_ui/sidebar_ui';

global.showSidebar = showSidebar;
global.onOpen = onOpen;
global.include = include;
