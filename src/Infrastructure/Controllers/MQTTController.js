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
            password: 'Mamamia1234.'
        };
        /*
        readonly client = mqtt.connect('mqtt://broker.hivemq.com',{
            port: 1883,
            username: 'T2Project',
            password: 'Mamamia1234.',
        });
        */
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
        this.userAppointmentsResponse = 'user/appointments/response';
        this.userAppointmentsRequest = 'user/appointments/request';
        this.getAppointmentsResponse = 'get/appointments/response';
        this.deleteAppointmentRequest = 'delete/appointment/request';
        this.deleteAppointmentResponse = 'delete/appointment/response';
        this.deleteAllAppointments = 'delete/appointments/request';
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
        this.user = {
            jwtToken: '',
            name: '',
            email: '',
            password: ''
        };
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
                    this.appointment = JSON.parse(message.toString());
                    console.log(this.appointment);
                    this.user = await this.getUserQuery.getUser(this.appointment.userId);
                    const response = {
                        'dentistId': this.appointment.dentistId,
                        'date': this.appointment.date
                    };
                    console.log(response);
                    this.client.publish(this.availabilityRequest, JSON.stringify(response), { qos: 1 });
                }
                if (topic === this.getAppointmentsRequest) {
                    const dentistryInfo = JSON.parse(message.toString());
                    console.log(dentistryInfo);
                    const appointments = await this.getAppointmentsCommand.getAllAppointments(dentistryInfo.dentistId);
                    this.client.publish(this.getAppointmentsResponse, JSON.stringify(appointments));
                }
                if (topic === this.getAppointmentsResponse) {
                    const appointments = JSON.parse(message.toString());
                }
                if (topic === this.userAppointmentsRequest) {
                    const request = JSON.parse(message.toString());
                    console.log(request);
                    const appointments = await this.getAppointmentsCommand.getAppointmentsByUserId(request.userId);
                    console.log(appointments);
                    this.client.publish(this.userAppointmentsResponse, JSON.stringify(appointments));
                }
                if (topic === this.userAppointmentsResponse) {
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
                            const newAppointment = this.appointment;
                            this.createAppointmentCommand.createAppointment(newAppointment.userId, newAppointment.dentistId, newAppointment.requestId, newAppointment.issuance, newAppointment.date);
                            const date = (0, dateUtils_1.convertToLocalTime)(new Date(newAppointment.date), 'sv-SE');
                            savedAppointment = {
                                'userId': newAppointment.userId,
                                'requestId': newAppointment.requestId,
                                'date': date
                            };
                            console.log(savedAppointment);
                            await (0, emailService_1.mailBookingConfirmation)(this.user.name, this.user.email, newAppointment.dentistId, newAppointment.date).catch((err) => {
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
                    }
                }
                if (topic === this.editRequest) {
                    this.editAppointment = JSON.parse(message.toString());
                    console.log(this.editAppointment);
                    const response = {
                        'dentistId': this.editAppointment.dentistId,
                        'date': this.editAppointment.editDate
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
                            newAppointment = this.editAppointment;
                            const updatedStatus = await this.editAppointmentCommand.editAppointment(newAppointment.userId, newAppointment.dentistId, newAppointment.requestId, newAppointment.issuance, newAppointment.date, newAppointment.editDate);
                            const date = (0, dateUtils_1.convertToLocalTime)(new Date(newAppointment.editDate), 'sv-SE');
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
                            newAppointment = this.editAppointment;
                            console.log(newAppointment);
                            savedAppointment = {
                                'userId': newAppointment.userId,
                                'requestId': newAppointment.requestId,
                                'date': 'none',
                            };
                            console.log(savedAppointment);
                            this.client.publish(this.editResponse, JSON.stringify(savedAppointment), { qos: 1 });
                    }
                }
                if (topic === this.deleteAllAppointments) {
                    const newMessage = JSON.parse(message.toString());
                    const answer = await this.deleteAppointmentCommand.deleteAllAppointments(newMessage.dentistId);
                    console.log(answer);
                }
                if (topic === this.deleteAppointmentRequest) {
                    const newAppointment = JSON.parse(message.toString());
                    console.log("delete message ", newAppointment);
                    const answer = await this.deleteAppointmentCommand.deleteAppointment(newAppointment.userId, newAppointment.dentistId, newAppointment.date);
                    console.log(answer);
                    const response = {
                        'response': answer
                    };
                    await (0, emailService_1.mailBookingDeletion)(this.user.email, newAppointment.dentistId, newAppointment.date, this.user.name).catch((err) => {
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
