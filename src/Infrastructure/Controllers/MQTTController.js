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
const emailService_1 = require("../Notifications/emailService");
class MQTTController {
    constructor(createAppointmentCommand, editAppointmentCommand, getAppointmentsCommand, deleteAppointmentCommand, getUserQuery) {
        this.createAppointmentCommand = createAppointmentCommand;
        this.editAppointmentCommand = editAppointmentCommand;
        this.getAppointmentsCommand = getAppointmentsCommand;
        this.deleteAppointmentCommand = deleteAppointmentCommand;
        this.getUserQuery = getUserQuery;
        this.options = {
            port: 8883,
            host: 'cb9fe4f292fe4099ae5eeb9f230c8346.s2.eu.hivemq.cloud',
            protocol: 'mqtts',
            username: 'T2Project',
            password: 'Mamamia1234.',
            clientId: 'mqttjs_' + Math.random().toString(16).substring(2, 8)
        };
        //readonly client = mqtt.connect('mqtt://broker.hivemq.com');
        this.client = mqtt_1.default.connect(this.options);
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
        this.getAppointmentsResponse = 'get/appointments/response';
        this.deleteAppointmentRequest = 'delete/appointment/request';
        this.deleteAppointmentResponse = 'delete/appointment/response';
        this.userInformationRequest = 'information/request';
        this.userInformationResponse = 'information/response';
        this.user = {
            jwtToken: '',
            name: '',
            email: '',
            password: ''
        };
        this.editAppointment = {
            userId: '',
            dentistId: '',
            requestId: '',
            issuance: '',
            date: '',
            editDate: ''
        };
        this.appointment = {
            userId: '',
            dentistId: '',
            requestId: '',
            issuance: '',
            date: '',
        };
    }
    connect() {
        this.client.on('connect', () => {
            console.log('Client is connected to the internet');
            this.client.subscribe(this.appointmentRequest, { qos: 1 });
            this.client.subscribe(this.editRequest);
            this.client.subscribe(this.editAvailabilityResponse, { qos: 1 });
            this.client.subscribe(this.availabilityResponse, { qos: 1 });
            this.client.subscribe(this.getAppointmentsRequest, { qos: 1 });
            this.client.subscribe(this.getAppointmentsResponse, { qos: 1 });
            this.client.subscribe(this.deleteAppointmentRequest, { qos: 1 });
            this.client.subscribe(this.deleteAppointmentResponse, { qos: 1 });
            console.log('Client has subscribed successfully');
            this.client.on('message', async (topic, message) => {
                if (topic === this.appointmentRequest) {
                    this.appointment = JSON.parse(message.toString());
                    console.log(this.appointment);
                    this.user = await this.getUserQuery.getUser(this.appointment.userId);
                    console.log(this.user);
                    const response = {
                        'dentistId': this.appointment.dentistId,
                        'date': this.appointment.date
                    };
                    this.client.publish(this.availabilityRequest, JSON.stringify(response), { qos: 1 });
                }
                if (topic === this.getAppointmentsRequest) {
                    const dentistryInfo = JSON.parse(message.toString());
                    console.log(dentistryInfo);
                    const appointments = await this.getAppointmentsCommand.getAllAppointments(dentistryInfo.dentistId);
                    console.log(appointments);
                    this.client.publish(this.getAppointmentsResponse, JSON.stringify(appointments));
                }
                if (topic === this.getAppointmentsResponse) {
                    const appointments = JSON.parse(message.toString());
                    console.log(appointments);
                }
                if (topic === this.availabilityResponse) {
                    let newAppointment = null;
                    let savedAppointment = null;
                    const firstAnswer = JSON.parse(message.toString());
                    console.log(firstAnswer);
                    const answer = firstAnswer.response;
                    console.log(answer);
                    switch (answer) {
                        case 'yes':
                            this.createAppointmentCommand.createAppointment(this.appointment.userId, this.appointment.dentistId, this.appointment.requestId, this.appointment.issuance, this.appointment.date);
                            const date = (0, dateUtils_1.convertToLocalTime)(new Date(this.appointment.date), 'sv-SE');
                            savedAppointment = {
                                'userId': this.appointment.userId,
                                'requestId': this.appointment.requestId,
                                'date': date
                            };
                            console.log(savedAppointment);
                            await (0, emailService_1.mailBookingConfirmation)(this.user.name, this.user.email, this.appointment.dentistId, date).catch((err) => {
                                console.log(err);
                            });
                            this.client.publish(this.appointmentResponse, JSON.stringify(savedAppointment), { qos: 1 });
                            break;
                        case 'no':
                            savedAppointment = {
                                'userId': this.appointment.userId,
                                'requestId': this.appointment.requestId,
                                'date': 'none'
                            };
                            console.log(savedAppointment);
                            this.client.publish(this.appointmentResponse, JSON.stringify(savedAppointment), { qos: 1 });
                            break;
                    }
                }
                if (topic === this.editRequest) {
                    this.editAppointment = JSON.parse(message.toString());
                    const response = {
                        'dentistId': this.editAppointment.dentistId,
                        'date': this.editAppointment.editDate
                    };
                    console.log(response);
                    this.client.publish(this.editAvailabilityRequest, JSON.stringify(response), { qos: 1 });
                }
                if (topic === this.editAvailabilityResponse) {
                    let savedAppointment = null;
                    const firstAnswer = JSON.parse(message.toString());
                    console.log(firstAnswer);
                    const answer = firstAnswer.response;
                    switch (answer) {
                        case 'yes':
                            const updatedStatus = await this.editAppointmentCommand.editAppointment(this.editAppointment.userId, this.editAppointment.dentistId, this.editAppointment.requestId, this.editAppointment.issuance, this.editAppointment.date, this.editAppointment.editDate);
                            const date = (0, dateUtils_1.convertToLocalTime)(new Date(this.editAppointment.editDate), 'sv-SE');
                            console.log(updatedStatus);
                            if (updatedStatus === 'updated') {
                                savedAppointment = {
                                    'userId': this.editAppointment.userId,
                                    'requestId': this.editAppointment.requestId,
                                    'date': date,
                                    'status': 'edited'
                                };
                                await (0, emailService_1.mailBookingChange)(this.user.email, this.editAppointment.dentistId, date, this.user.name).catch((err) => {
                                    console.log(err);
                                });
                            }
                            else {
                                savedAppointment = {
                                    'userId': this.editAppointment.userId,
                                    'requestId': this.editAppointment.requestId,
                                    'date': 'none',
                                    'status': 'not edited'
                                };
                            }
                            console.log(savedAppointment);
                            this.client.publish(this.editResponse, JSON.stringify(savedAppointment), { qos: 1 });
                            break;
                        case 'no':
                            savedAppointment = {
                                'userId': this.editAppointment.userId,
                                'requestId': this.editAppointment.requestId,
                                'date': 'none',
                                'status': 'not edited'
                            };
                            console.log(savedAppointment);
                            this.client.publish(this.editResponse, JSON.stringify(savedAppointment), { qos: 1 });
                    }
                }
                if (topic === this.deleteAppointmentRequest) {
                    const newAppointment = JSON.parse(message.toString());
                    console.log("delete message ", newAppointment);
                    const answer = await this.deleteAppointmentCommand.deleteAppointment(newAppointment.userId, newAppointment.dentistId, newAppointment.requestId, newAppointment.issuance, newAppointment.date);
                    const date = (0, dateUtils_1.convertToLocalTime)(newAppointment.date, 'sv-SE');
                    console.log(answer);
                    const response = {
                        'response': answer
                    };
                    await (0, emailService_1.mailBookingDeletion)(this.user.email, newAppointment.dentistId, date, this.user.name).catch((err) => {
                        console.log(err);
                    });
                    this.client.publish(this.deleteAppointmentResponse, JSON.stringify(response), { qos: 1 });
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
