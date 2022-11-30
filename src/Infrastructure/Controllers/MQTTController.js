"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MQTTController = void 0;
/* eslint-disable no-case-declarations */
/* eslint-disable prettier/prettier */
const mqtt_1 = __importDefault(require("mqtt"));
class MQTTController {
    constructor(createAppointmentCommand) {
        this.createAppointmentCommand = createAppointmentCommand;
        this.options = {
            port: 8883,
            host: 'e960f016875b4c75857353c7f267d899.s2.eu.hivemq.cloud',
            protocol: 'mqtts',
            username: 'gusasarkw@student.gu.se',
            password: 'Twumasi123.'
        };
        //readonly client = mqtt.connect('mqtt://broker.hivemq.com');
        this.client = mqtt_1.default.connect(this.options);
        this.availabilityTopic = 'avaiability/#';
        this.appointmentTopic = 'appointment/#';
        this.appointmentResponse = 'appointment/response';
        this.appointmentRequest = 'appointment/request';
        this.availabilityRequest = 'availability/request';
        this.availabilityResponse = 'availability/response';
        this.appointment = '';
    }
    connect() {
        this.client.on("connect", () => {
            console.log("Client is connected to the internet");
            this.client.subscribe(this.appointmentRequest, { qos: 1 });
            this.client.subscribe(this.availabilityResponse, { qos: 1 });
            console.log('Client has subscribed successfully');
            this.client.on('message', (topic, message) => {
                if (topic === this.appointmentRequest) {
                    this.appointment = message.toString();
                    console.log(this.appointment);
                    const newMessage = JSON.parse(this.appointment);
                    const response = {
                        'dentistId': newMessage.dentistId,
                        'date': newMessage.date
                    };
                    console.log(response);
                    this.client.publish(this.availabilityRequest, JSON.stringify(response));
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
                            newAppointment = JSON.parse(this.appointment);
                            this.createAppointmentCommand.createAppointment(newAppointment.userId, newAppointment.dentistId, newAppointment.requestId, newAppointment.issuance, newAppointment.date);
                            savedAppointment = {
                                'usrId': newAppointment.userId,
                                'requestId': newAppointment.requestId,
                                'date': newAppointment.date
                            };
                            this.client.publish(this.appointmentResponse, JSON.stringify(savedAppointment));
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
                            this.client.publish(this.appointmentResponse, JSON.stringify(savedAppointment));
                    }
                }
            });
        });
    }
    publish(topic, responseMessage) {
        this.client.on('connect', () => {
            this.client.publish(topic, responseMessage, (err) => {
                if (err) {
                    console.log("Error in publishing the message" + err);
                }
                else {
                    console.log("Topic: " + topic + " , message: " + responseMessage);
                }
            });
        });
    }
    testPublish() {
        let message = JSON.stringify({ "userId": 12345, "requestId": 13, "dentistId": 1, "issuance": 1602406766314, "date": "2020-12-14 14:00:00" });
        let i = 0;
        this.client.on('connect', () => {
            while (i < 5) {
                this.client.publish('availability/request', message, { qos: 1 });
                console.log(i);
                i++;
            }
            console.log('done');
        });
    }
    //Subscribe to frontend request
    subscribe() {
        this.client.on('connect', () => {
            this.client.subscribe(this.appointmentRequest);
            this.client.subscribe(this.availabilityResponse);
            console.log('Client has subscribed successfully');
        });
        this.client.on('message', async (topic, message) => {
            if (topic === this.appointmentRequest) {
                this.appointment = message.toString();
                const newMessage = JSON.parse(this.appointment);
                const response = {
                    'dentistId': newMessage.dentistId,
                    'date': newMessage.date
                };
                console.log(response);
                this.publish(this.availabilityRequest, JSON.stringify(response));
            }
            else if (topic === this.availabilityResponse) {
                let newAppointment = null;
                let savedAppointment = null;
                switch (message.toString()) {
                    case 'yes':
                        newAppointment = JSON.parse(this.appointment.toString());
                        this.createAppointmentCommand.createAppointment(newAppointment.userId, newAppointment.dentistId, newAppointment.requestId, newAppointment.issuance, newAppointment.date);
                        savedAppointment = {
                            'userId': newAppointment.userId,
                            'requestId': newAppointment.requestId,
                            'date': newAppointment.date
                        };
                        this.publish(this.appointmentResponse, JSON.stringify(savedAppointment));
                        break;
                    case 'no':
                        newAppointment = JSON.parse(this.appointment.toString());
                        savedAppointment = {
                            'userId': newAppointment.userId,
                            'requestId': newAppointment.requestId,
                            'date': 'none'
                        };
                        this.publish(this.appointmentResponse, JSON.stringify(savedAppointment));
                }
            }
        });
    }
}
exports.MQTTController = MQTTController;
