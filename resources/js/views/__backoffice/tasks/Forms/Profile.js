import React from 'react';
import PropTypes from 'prop-types';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import {
    Button,
    FormControl,
    FormHelperText,
    Input,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Typography,
    withStyles,
} from '@material-ui/core';

import { MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';

const Profile = props => {
    const { classes, values, handleSubmit } = props;

    return (
        <Formik
            initialValues={values}
            validationSchema={Yup.object().shape({
                firstname: Yup.string().required(
                    Lang.get('validation.required', {
                        attribute: 'firstname',
                    }),
                ),

                lastname: Yup.string().required(
                    Lang.get('validation.required', {
                        attribute: 'lastname',
                    }),
                ),
            })}
            onSubmit={async (values, form) => {
                let mappedValues = {};
                let valuesArray = Object.values(values);

                // Format values specially the object ones (i.e Moment)
                Object.keys(values).forEach((filter, key) => {
                    if (
                        valuesArray[key] !== null &&
                        typeof valuesArray[key] === 'object' &&
                        valuesArray[key].hasOwnProperty('_isAMomentObject')
                    ) {
                        mappedValues[filter] = moment(valuesArray[key]).format(
                            'YYYY-MM-DD',
                        );

                        return;
                    }

                    mappedValues[filter] = valuesArray[key];
                });

                await handleSubmit(mappedValues, form);
            }}
            validateOnBlur={false}
        >
            {({
                values,
                errors,
                submitCount,
                isSubmitting,
                handleChange,
                setFieldValue,
            }) => (
                <Form>
                    <Grid container spacing={24}>

                        <Grid item xs={12} sm={12}>
                            <FormControl
                                className={classes.formControl}
                                error={
                                    submitCount > 0 &&
                                    errors.hasOwnProperty('title')
                                }
                            >
                                <InputLabel htmlFor="title">
                                    Title{' '}
                                    <span className={classes.required}>*</span>
                                </InputLabel>

                                <Input
                                    id="title"
                                    name="title"
                                    value={values.title}
                                    onChange={handleChange}
                                    fullWidth
                                />

                                {submitCount > 0 &&
                                    errors.hasOwnProperty('title') && (
                                        <FormHelperText>
                                            {errors.title}
                                        </FormHelperText>
                                    )}
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container spacing={24}>
                        <Grid item xs={12} sm={12}>
                            <FormControl
                                className={classes.formControl}
                                error={
                                    submitCount > 0 &&
                                    errors.hasOwnProperty('description')
                                }
                            >
                                <InputLabel htmlFor="description">
                                    Description
                                </InputLabel>

                                <Input
                                    id="description"
                                    name="Description"
                                    value={values.description}
                                    onChange={handleChange}
                                    fullWidth
                                    multiline
                                    rows={3}
                                />

                                {submitCount > 0 &&
                                    errors.hasOwnProperty('description') && (
                                        <FormHelperText>
                                            {errors.description}
                                        </FormHelperText>
                                    )}
                            </FormControl>
                        </Grid>
                    </Grid>

                    <Grid container spacing={24}>
                            <Grid item xs={12} sm={6}>
                                <FormControl
                                    className={classes.formControl}
                                    error={submitCount > 0 && errors.hasOwnProperty('start_date')}
                                >
                                    <MuiPickersUtilsProvider utils={MomentUtils}>
                                        <DatePicker
                                            id="start_date"
                                            name="start_date"
                                            label="Start Date"
                                            placeholder="Please pick the Start Date"
                                            value={values.start_date}
                                            onChange={date => setFieldValue('start_date', date)}
                                            format="YYYY-MM-DD"
                                            // Prevent selection of dates before today
                                            minDate={moment().format('YYYY-MM-DD')}
                                            keyboard
                                            clearable
                                            disableFuture={false} // Allow future dates
                                        />
                                    </MuiPickersUtilsProvider>

                                    {submitCount > 0 && errors.hasOwnProperty('start_date') && (
                                        <FormHelperText>{errors.start_date}</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl
                                    className={classes.formControl}
                                    error={submitCount > 0 && errors.hasOwnProperty('end_date')}
                                >
                                    <MuiPickersUtilsProvider utils={MomentUtils}>
                                        <DatePicker
                                            id="end_date"
                                            name="end_date"
                                            label="End Date"
                                            placeholder="Please pick the End Date"
                                            value={values.end_date}
                                            onChange={date => setFieldValue('end_date', date)}
                                            format="YYYY-MM-DD"
                                            // Prevent selection of dates before the selected start date
                                            minDate={values.start_date ? moment(values.start_date).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD')}
                                            keyboard
                                            clearable
                                            disableFuture={false} // Allow future dates
                                        />
                                    </MuiPickersUtilsProvider>

                                    {submitCount > 0 && errors.hasOwnProperty('end_date') && (
                                        <FormHelperText>{errors.end_date}</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>

                    </Grid>
                    <Grid container spacing={24}>
                        <Grid item xs={12} sm={12}>
                            <FormControl
                                className={classes.formControl}
                                error={
                                    submitCount > 0 &&
                                    errors.hasOwnProperty('status')
                                }
                            >
                                <InputLabel htmlFor="status">Status</InputLabel>

                                <Select
                                    id="status"
                                    name="status"
                                    value={values.status}
                                    onChange={handleChange}
                                    input={<Input fullWidth />}
                                    autoWidth
                                >
                                    <MenuItem value="">
                                        Please select the status
                                    </MenuItem>

                                    <MenuItem value="female">Pending</MenuItem>
                                    <MenuItem value="male">In Progress</MenuItem>
                                    <MenuItem value="male">Completed</MenuItem>

                                </Select>

                                {submitCount > 0 &&
                                    errors.hasOwnProperty('status') && (
                                        <FormHelperText>
                                            {errors.status}
                                        </FormHelperText>
                                    )}
                            </FormControl>
                        </Grid>
                    </Grid>


                    <div className={classes.sectionSpacer} />

                    <Grid container spacing={24} justify="flex-end">
                        <Grid item>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={
                                    (errors &&
                                        Object.keys(errors).length > 0 &&
                                        submitCount > 0) ||
                                    isSubmitting
                                }
                            >
                                Submit
                            </Button>
                        </Grid>
                    </Grid>
                </Form>
            )}
        </Formik>
    );
};

Profile.propTypes = {
    values: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
};

const styles = theme => ({
    formControl: {
        minWidth: '100%',
    },

    required: {
        color: theme.palette.error.main,
    },
});

export default withStyles(styles)(Profile);
