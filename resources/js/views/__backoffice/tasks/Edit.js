import React, { useState, useEffect } from 'react';

import {
    CircularProgress,
    Grid,
    Paper,
    Typography,
    withStyles,
} from '@material-ui/core';

import * as UrlUtils from '../../../helpers/URL';
import { Master as MasterLayout } from '../layouts';
import { Profile } from './Forms';
import Task from '../../../models/Task';
import { User } from '../../../models';
import * as NavigationUtils from '../../../helpers/Navigation';

function Edit(props) {
    const [loading, setLoading] = useState(false);
    const [formValues, setFormValues] = useState([]);
    const [task, setTask] = useState({});
    const [user, setUser] = useState({});
    const [message, setMessage] = useState({});
    const { classes, ...other } = props;
    const { history } = props;

    /**
     * Fetch the task.
     *
     * @param {number} id
     *
     * @return {undefined}
     */
    const fetchTask = async id => {
        setLoading(true);

        try {
            const task = await Task.show(id);
            setTask(task);
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };

    const fetchUser = async () => {
        setLoading(true);

        try {
            const user = await User.all();
            setUser(user);
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };

    /**
     * Handle form submit, this should send an API response to create a user.
     *
     * @param {object} values
     * @param {object} form
     *
     * @return {undefined}
     */
    const handleSubmit = async (values, { setSubmitting, setErrors }) => {
        setSubmitting(false);

        setLoading(true);

        try {
            await Task.update(task.id, {...values});

            let newFormValues = [...formValues];

            setLoading(false);
            setFormValues(newFormValues);
            setUser(user);
            setTask(task)
            setMessage({
                type: 'success',
                body: Lang.get('resources.updated', {
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
    useEffect(() => {
        if (Object.keys(user).length > 0) {
            return;
        }

        const { params } = props.match;

        fetchTask(params.id);
        fetchUser();
    }, [user, props.match, props.location]); // Adding dependencies

    const renderLoading = (
        <Grid
            container
            className={classes.loadingContainer}
            justify="center"
            alignItems="center"
        >
            <Grid item>
                <CircularProgress color="primary" />
            </Grid>
        </Grid>
    );

    if (loading) return  renderLoading;

    return (
        <MasterLayout
            {...other}
            pageTitle="Edit user"
            tabs={[]}
            message={message}
        >
            <div className={classes.pageContentWrapper}>
                {loading && <CircularProgress color="primary" />}

                <Paper>
                    <div className={classes.pageContent}>
                        <Typography
                            component="h1"
                            variant="h4"
                            align="center"
                            gutterBottom
                        >
                            Task Modification
                        </Typography>
                        <Profile
                            {...other}
                            allUsers={user.length ? user : []}
                            values={
                                formValues[0] ? formValues[0] : {
                                    title: task.title ? task.title : '',
                                    description: task.description ? task.description : '',
                                    status: task.status ? task.status : '',
                                    start_date: task.start_date ? task.start_date : '',
                                    end_date: task.end_date ? task.end_date : '',
                                    user_id: task.user_id ? task.user_id : ''
                                }
                            }
                            handleSubmit={handleSubmit}
                        />
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

    loadingContainer: {
        minHeight: 200,
    },
});

export default withStyles(styles)(Edit);
