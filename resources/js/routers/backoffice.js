import { Home } from '../views/__backoffice';
import * as Settings from '../views/__backoffice/settings';
import * as Users from '../views/__backoffice/users';
import * as Tasks from '../views/__backoffice/tasks';

const resources = [
    {
        name: 'users.index',
        path: '/users',
        component: Users.List,
    },

    {
        name: 'users.create',
        path: '/users/create',
        component: Users.Create,
    },

    {
        name: 'users.edit',
        path: '/users/:id/edit',
        component: Users.Edit,
    },
    {
        name: 'tasks.index',
        path: '/tasks',
        component: Tasks.List,
    },

    {
        name: 'tasks.create',
        path: '/tasks/create',
        component: Tasks.Create,
    },

    {
        name: 'tasks.edit',
        path: '/tasks/:id/edit',
        component: Tasks.Edit,
    },
].map(route => {
    route.name = `resources.${route.name}`;
    route.path = `/resources${route.path}`;

    return route;
});

export default [
    {
        name: 'home',
        path: '/',
        component: Home,
    },

    {
        name: 'settings.profile',
        path: '/settings/profile',
        component: Settings.Profile,
    },

    {
        name: 'settings.account',
        path: '/settings/account',
        component: Settings.Account,
    },

    ...resources,
].map(route => {
    route.name = `backoffice.${route.name}`;
    route.auth = true;

    return route;
});
