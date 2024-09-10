import React, { useEffect, useState } from 'react';

import {
    Paper,
    Typography,
    withStyles,
} from '@material-ui/core';

import { LinearIndeterminate } from '../../../ui/Loaders';
import { Master as MasterLayout } from '../layouts';

import { Profile, Account, Avatar } from './Forms';
import Task from '../../../models/Task';
import { User } from '../../../models';
import * as NavigationUtils from '../../../helpers/Navigation';

function Create(props) {
    const [loading, setLoading] = useState(false);
    const [formValues, setFormValues] = useState([]);
    const [task, setTask] = useState({});
    const [message, setMessage] = useState({});
    const [users, setUsers] = useState({});
    /**
     * Handle form submit, this should send an API response
     * to create a task.
     *
     * @param {object} values
     *
     * @param {object} form
     *
     * @return {undefined}
     */
    const handleSubmit = async (values, { setSubmitting, setErrors }) => {
        setSubmitting(false);

        setLoading(true);

        try {

            // Instruct the API the current step.
            const task = await Task.store(values);

            // After persisting the previous values. Move to the next step...
            let newFormValues = [...formValues];

            setLoading(false);
            setFormValues(newFormValues);
            setTask(task);

            setMessage({
                type: 'success',
                body: Lang.get('resources.created', {
                    name: 'Task',
                }),
                closed: () => setMessage({}),
            });

            setTimeout(()  => {
                history.push(
                    NavigationUtils.route(
                        'backoffice.resources.tasks.index',
                    ));
            }, 1000);
        } catch (error) {
            if (!error.response) {
                throw new Error('Unknown error');
            }

            const { errors } = error.response.data;

            setErrors(errors);

            setLoading(false);
        }
    };

    const { classes, ...other } = props;
    const { history } = props;

    const fetchUser = async id => {
        setLoading(true);

        try {
            const users = await User.all();

            setUsers(users);
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const renderForm = () => {
        const defaultProfileValues = {
            title: '',
            start_date: null,
            end_date:null,
            description: '',
            status: ''
        };
                return (
                    <Profile
                        {...other}
                        values={
                            formValues[0] ? formValues[0] : defaultProfileValues
                        }
                        allUsers={users.length ? users : []}
                        handleSubmit={handleSubmit}
                    />
                )
    };

    return (
        <MasterLayout
            {...other}
            pageTitle="Create a task"
            tabs={[]}
            message={message}
        >
            <div className={classes.pageContentWrapper}>
                {loading && <LinearIndeterminate />}

                <Paper>
                    <div className={classes.pageContent}>
                        <Typography
                            component="h1"
                            variant="h4"
                            align="center"
                            gutterBottom
                        >
                            Task Creation
                        </Typography>
                        {renderForm()}
                    </div>
                </Paper>
            </div>
        </MasterLayout>
    );
}

const styles = theme => ({
    pageContentWrapper: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        minHeight: '75vh',
        overflowX: 'auto',
    },

    pageContent: {
        padding: theme.spacing.unit * 3,
    },
});

export default withStyles(styles)(Create);
