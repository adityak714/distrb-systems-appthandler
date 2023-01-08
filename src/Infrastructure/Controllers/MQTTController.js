"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MQTTController = void 0;
/* eslint-disable no-case-declarations */
/* eslint-disable prettier/prettier */
const mqtt_1 = __importDefault(require("mqtt"));
const dateUtils_1 = require("../../Domain/Utils/dateUtils");
const opossum_1 = __importDefault(require("opossum"));
class MQTTController {
    constructor(createAppointmentCommand, editAppointmentCommand, getAppointmentsCommand, deleteAppointmentCommand) {
        this.createAppointmentCommand = createAppointmentCommand;
        this.editAppointmentCommand = editAppointmentCommand;
        this.getAppointmentsCommand = getAppointmentsCommand;
        this.deleteAppointmentCommand = deleteAppointmentCommand;
        /*readonly mqttoptions: IClientOptions = {
            port: 8883,
            host: 'cb9fe4f292fe4099ae5eeb9f230c8346.s2.eu.hivemq.cloud',
            protocol: 'mqtts',
            username: 'T2Project',
            password: 'Mamamia1234.'
        }
        */
        this.client = mqtt_1.default.connect('mqtt://broker.hivemq.com', {
            port: 1883,
            username: 'T2Project',
            password: 'Mamamia1234.',
        });
        this.options = {
            timeout: 500,
            errorThresholdPercentage: 50,
            resetTimeout: 5000 // After 30 seconds, try again.
        };
        //readonly client = mqtt.connect('mqtt://broker.hivemq.com');
        //readonly client = mqtt.connect(this.mqttoptions);
        this.mqtt_options = { qos: 1 };
        this.availabilityTopic = 'avaiability/#';
        this.appointmentTopic = 'appointment/#';
        this.appointmentResponse = 'appointment/response';
        this.appointmentRequest = 'appointment/request';
        this.availabilityRequest = 'availability/request';
        this.availabilityResponse = 'availability/response';
        this.editRequest = 'edit/request';
        this.editResponse = 'edit/response';
        this.editAvailabilityResponse = 'edit/availability/response';
        this.editAvailabilityRequest = 'edit/availability/request';
        this.getAppointmentsRequest = 'get/appointments/request';
        this.userAppointmentsResponse = 'user/appointments/response';
        this.userAppointmentsRequest = 'user/appointments/request';
        this.getAppointmentsResponse = 'get/appointments/response';
        this.deleteAppointmentRequest = 'delete/appointment/request';
        this.deleteAppointmentResponse = 'delete/appointment/response';
        this.deleteAllAppointments = 'delete/appointments/request';
        this.appointment = '';
    }
    connect() {
        this.client.on('connect', () => {
            console.log('Client is connected to the internet');
            this.client.subscribe(this.appointmentRequest, { qos: 1 });
            this.client.subscribe(this.editRequest);
            this.client.subscribe(this.editAvailabilityResponse, { qos: 1 });
            this.client.subscribe(this.availabilityResponse, { qos: 1 });
            this.client.subscribe(this.userAppointmentsRequest, { qos: 1 });
            this.client.subscribe(this.userAppointmentsResponse, { qos: 1 });
            this.client.subscribe(this.getAppointmentsRequest, { qos: 1 });
            this.client.subscribe(this.getAppointmentsResponse, { qos: 1 });
            this.client.subscribe(this.deleteAppointmentRequest, { qos: 1 });
            this.client.subscribe(this.deleteAppointmentResponse, { qos: 1 });
            this.client.subscribe(this.deleteAllAppointments, { qos: 1 });
            console.log('Client has subscribed successfully');
            this.client.on('message', async (topic, message) => {
                if (topic === this.appointmentRequest) {
                    this.appointment = message.toString();
                    console.log(this.appointment);
                    const newMessage = JSON.parse(this.appointment);
                    const response = {
                        'dentistId': newMessage.dentistId,
                        'date': newMessage.date
                    };
                    console.log(response);
                    this.client.publish(this.availabilityRequest, JSON.stringify(response), { qos: 1 });
                }
                if (topic === this.getAppointmentsRequest) {
                    const getAppointmentsBreaker = new opossum_1.default((dentistId) => {
                        return this.getAppointmentsCommand.getAllAppointments(dentistId);
                    });
                    try {
                        getAppointmentsBreaker.on('success', (result) => console.log(result));
                        getAppointmentsBreaker.on('timeout', () => console.log('timeout'));
                        getAppointmentsBreaker.on('open', () => console.log('open'));
                        getAppointmentsBreaker.on('halfOpen', () => console.log('halfOpen'));
                        getAppointmentsBreaker.on('close', () => console.log('close'));
                        getAppointmentsBreaker.fallback(() => 'Sorry, out of service right now');
                        getAppointmentsBreaker.on('fallback', () => console.log('Sorry, out of service right now'));
                        const dentistryInfo = JSON.parse(message.toString());
                        console.log(dentistryInfo);
                        const appointments = await getAppointmentsBreaker.fire(dentistryInfo.dentistId);
                        if (!getAppointmentsBreaker.opened) {
                            this.client.publish(this.getAppointmentsResponse, JSON.stringify(appointments));
                        }
                    }
                    catch (error) {
                        console.log(error);
                    }
                }
                if (topic === this.getAppointmentsResponse) {
                    const appointments = JSON.parse(message.toString());
                }
                if (topic === this.userAppointmentsRequest) {
                    const userAppointmentBreaker = new opossum_1.default((userId) => {
                        return this.getAppointmentsCommand.getAppointmentsByUserId(userId);
                    });
                    try {
                        userAppointmentBreaker.on('success', (result) => console.log(result));
                        userAppointmentBreaker.on('timeout', () => console.log('timeout'));
                        userAppointmentBreaker.on('open', () => console.log('open'));
                        userAppointmentBreaker.on('halfOpen', () => console.log('halfOpen'));
                        userAppointmentBreaker.on('close', () => console.log('close'));
                        userAppointmentBreaker.fallback(() => 'Sorry, out of service right now');
                        userAppointmentBreaker.on('fallback', () => console.log('Sorry, out of service right now'));
                        const request = JSON.parse(message.toString());
                        console.log(request);
                        const appointments = await userAppointmentBreaker.fire(request.userId);
                        console.log(appointments);
                        if (!userAppointmentBreaker.opened) {
                            this.client.publish(this.userAppointmentsResponse, JSON.stringify(appointments));
                        }
                    }
                    catch (error) {
                        console.log(error);
                    }
                }
                if (topic === this.userAppointmentsResponse) {
                    const appointments = JSON.parse(message.toString());
                    console.log(appointments);
                }
                if (topic === this.availabilityResponse) {
                    //Create circuitbreaker for creating appointment
                    const createAppointmentBreaker = new opossum_1.default((userId, dentistId, requestId, issuance, date) => {
                        return this.createAppointmentCommand.createAppointment(userId, dentistId, requestId, issuance, date);
                    }, this.options);
                    try {
                        let newAppointment = null;
                        let savedAppointment = null;
                        const firstAnswer = JSON.parse(message.toString());
                        console.log(firstAnswer);
                        const answer = firstAnswer.response;
                        console.log(answer);
                        createAppointmentBreaker.on('success', (result) => console.log(result));
                        createAppointmentBreaker.on('timeout', () => console.log('timeout'));
                        createAppointmentBreaker.on('open', () => console.log('Circuitbreaker is open'));
                        createAppointmentBreaker.on('halfOpen', () => console.log('halfOpen'));
                        createAppointmentBreaker.on('close', () => console.log('close'));
                        createAppointmentBreaker.fallback(() => 'Sorry, out of service right now');
                        createAppointmentBreaker.on('fallback', () => console.log('Sorry, out of service right now'));
                        switch (answer) {
                            case 'yes':
                                newAppointment = JSON.parse(this.appointment);
                                await createAppointmentBreaker.fire(newAppointment.userId, newAppointment.dentistId, newAppointment.requestId, newAppointment.issuance, newAppointment.date);
                                const date = (0, dateUtils_1.convertToLocalTime)(newAppointment.date, 'sv-SE');
                                savedAppointment = {
                                    'userId': newAppointment.userId,
                                    'requestId': newAppointment.requestId,
                                    'date': date
                                };
                                console.log(savedAppointment);
                                if (!createAppointmentBreaker.opened) {
                                    this.client.publish(this.appointmentResponse, JSON.stringify(savedAppointment), { qos: 1 });
                                }
                                break;
                            case 'no':
                                newAppointment = JSON.parse(this.appointment);
                                console.log(newAppointment);
                                savedAppointment = {
                                    'userId': newAppointment.userId,
                                    'requestId': newAppointment.requestId,
                                    'date': 'none'
                                };
                                console.log(savedAppointment);
                                this.client.publish(this.appointmentResponse, JSON.stringify(savedAppointment), { qos: 1 });
                        }
                    }
                    catch (err) {
                        createAppointmentBreaker.on('fallback', () => 'Sorry, out of service right now');
                        createAppointmentBreaker.fallback(() => console.log('Sorry, out of service right now'));
                        //console.log(err)
                    }
                    this.appointment = '';
                }
                if (topic === this.editRequest) {
                    this.appointment = message.toString();
                    console.log(this.appointment);
                    const newMessage = JSON.parse(this.appointment);
                    const response = {
                        'dentistId': newMessage.dentistId,
                        'date': newMessage.editDate
                    };
                    console.log(response);
                    this.client.publish(this.editAvailabilityRequest, JSON.stringify(response), { qos: 1 });
                }
                if (topic === this.editAvailabilityResponse) {
                    let newAppointment = null;
                    let savedAppointment = null;
                    const firstAnswer = JSON.parse(message.toString());
                    console.log(firstAnswer);
                    const answer = firstAnswer.response;
                    console.log(answer);
                    switch (answer) {
                        case 'yes':
                            newAppointment = JSON.parse(this.appointment);
                            const updatedStatus = await this.editAppointmentCommand.editAppointment(newAppointment.userId, newAppointment.dentistId, newAppointment.requestId, newAppointment.issuance, newAppointment.date, newAppointment.editDate);
                            const date = (0, dateUtils_1.convertToLocalTime)(newAppointment.editDate, 'sv-SE');
                            console.log(updatedStatus);
                            if (updatedStatus === 'updated') {
                                savedAppointment = {
                                    'userId': newAppointment.userId,
                                    'requestId': newAppointment.requestId,
                                    'date': date,
                                    'status': 'edited'
                                };
                            }
                            else {
                                savedAppointment = {
                                    'userId': newAppointment.userId,
                                    'requestId': newAppointment.requestId,
                                    'date': 'none',
                                };
                            }
                            console.log(savedAppointment);
                            this.client.publish(this.editResponse, JSON.stringify(savedAppointment), { qos: 1 });
                            break;
                        case 'no':
                            newAppointment = JSON.parse(this.appointment);
                            console.log(newAppointment);
                            savedAppointment = {
                                'userId': newAppointment.userId,
                                'requestId': newAppointment.requestId,
                                'date': 'none',
                            };
                            console.log(savedAppointment);
                            this.client.publish(this.editResponse, JSON.stringify(savedAppointment), { qos: 1 });
                    }
                    this.appointment = '';
                }
                if (topic === this.deleteAllAppointments) {
                    //Create circuitbreaker for creating appointment
                    const deleteAppointmentsBreaker = new opossum_1.default((dentistId) => {
                        return this.deleteAppointmentCommand.deleteAllAppointments(dentistId);
                    }, this.options);
                    try {
                        deleteAppointmentsBreaker.on('success', (result) => console.log(result));
                        deleteAppointmentsBreaker.on('timeout', () => console.log('timeout'));
                        deleteAppointmentsBreaker.on('open', () => console.log('open'));
                        deleteAppointmentsBreaker.on('halfOpen', () => console.log('halfOpen'));
                        deleteAppointmentsBreaker.on('close', () => console.log('close'));
                        deleteAppointmentsBreaker.fallback(() => 'Sorry, out of service right now');
                        deleteAppointmentsBreaker.on('fallback', () => console.log('Sorry, out of service right now'));
                        const newMessage = JSON.parse(message.toString());
                        const answer = await deleteAppointmentsBreaker.fire(newMessage.dentistId);
                        console.log(answer);
                    }
                    catch (error) {
                        console.log(error);
                    }
                }
                if (topic === this.deleteAppointmentRequest) {
                    const deleteAppointmentBreaker = new opossum_1.default((userId, dentistId, date) => {
                        return this.deleteAppointmentCommand.deleteAppointment(userId, dentistId, date);
                    }, this.options);
                    try {
                        const newAppointment = JSON.parse(message.toString());
                        console.log("delete message ", newAppointment);
                        const answer = await deleteAppointmentBreaker.fire(newAppointment.userId, newAppointment.dentistId, newAppointment.date);
                        console.log(answer);
                        const response = {
                            'response': answer
                        };
                        if (!deleteAppointmentBreaker.opened) {
                            this.client.publish(this.deleteAppointmentResponse, JSON.stringify(response), { qos: 1 });
                        }
                    }
                    catch (err) {
                        console.log(err);
                    }
                }
                if (topic === this.deleteAppointmentResponse) {
                    const deletedStatus = JSON.parse(message.toString());
                    console.log(deletedStatus);
                }
            });
        });
    }
}
exports.MQTTController = MQTTController;
