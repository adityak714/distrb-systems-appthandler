"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    subscribeFrontEnd() {
        this.client.on('connect', () => {
            this.client.subscribe(this.appointmentRequest);
            console.log('Client has subscribed successfully to the frontend');
        });
        this.client.on('message', (topic, message) => __awaiter(this, void 0, void 0, function* () {
            this.appointment = message.toString();
            const newMessage = JSON.parse(this.appointment);
            console.log(newMessage);
            console.log(newMessage.dentistId);
            const response = {
                'dentistId': (newMessage.dentistId),
                'date': newMessage.date
            };
            console.log(response);
            this.publish(this.availabilityRequest, JSON.stringify(response));
        }));
    }
    susbcribeAvailabilityChecker() {
        let newAppointment = null;
        let savedAppointment = null;
        this.client.on('connect', () => {
            this.client.subscribe(this.availabilityResponse);
        });
        this.client.on('message', (topic, message) => {
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
