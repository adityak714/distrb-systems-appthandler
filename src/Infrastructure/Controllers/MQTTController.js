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
            host: '80a9b426b200440c81e9c17c2ba85bc2.s2.eu.hivemq.cloud',
            protocol: 'mqtts',
            username: 'gusreinaos',
            password: 'Mosquitto1204!'
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
    //Publish method
    publish(topic, responseMessage) {
        this.client.on('connect', () => {
            this.client.publish(topic, responseMessage);
            console.log(topic, responseMessage);
        });
    }
}
exports.MQTTController = MQTTController;
