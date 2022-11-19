/* eslint-disable no-case-declarations */
/* eslint-disable prettier/prettier */
import mqtt, { IClientOptions } from 'mqtt'
import { createAppointmentCommand } from '../../Application/Commands/createAppointmentCommand';
import { Appointment } from '../../Domain/Entities/Appointment';

export class MQTTController {

    constructor(private createAppointmentCommand: createAppointmentCommand){}

    readonly options: IClientOptions = {
        port: 8883,
        host: '80a9b426b200440c81e9c17c2ba85bc2.s2.eu.hivemq.cloud',
        protocol: 'mqtts',
        username: 'gusreinaos',
        password: 'Mosquitto1204!'
    }

    readonly client = mqtt.connect(this.options);

    readonly availabilityTopic = 'avaiability/#'
    readonly appointmentTopic = 'appointment/#'
    readonly appointmentResponse = 'appointment/response'
    readonly appointmentRequest = 'appointment/request'
    readonly availabilityRequest = 'availability/request'
    readonly availabilityResponse = 'availability/response'

    appointment = '';

    //Subscribe to frontend request
    public subscribeFrontEnd() {
        this.client.on('connect', () => {
            this.client.subscribe(this.appointmentRequest)
            console.log('Client has subscribed successfully to the frontend')
        });
        this.client.on('message', async (topic, message) => {
            this.appointment = message.toString();
            const newMessage = JSON.parse(this.appointment);
            console.log(newMessage)
            console.log(newMessage.dentistId);
            const response: JSON = <JSON><unknown>{
                'dentistId': (newMessage.dentistId),
                'date': newMessage.date
            }
            console.log(response)
            this.publish(this.availabilityRequest, JSON.stringify(response));
        });
    }

    public susbcribeAvailabilityChecker() {

        let newAppointment = null;
        let savedAppointment = null;

        this.client.on('connect', () => {
            this.client.subscribe(this.availabilityResponse)
        });
        this.client.on('message', (topic, message) => {
            switch(message.toString()) {

                case 'yes':
                    newAppointment = JSON.parse(this.appointment.toString());
                    this.createAppointmentCommand.createAppointment(newAppointment.userId, newAppointment.dentistId, newAppointment.requestId, newAppointment.issuance, newAppointment.date);
                    savedAppointment = <JSON><unknown> {
                        'userId': newAppointment.userId,
                        'requestId': newAppointment.requestId,
                        'date': newAppointment.date
                    }
                    this.publish(this.appointmentResponse, JSON.stringify(savedAppointment));
                    break;

                case 'no':
                    newAppointment = JSON.parse(this.appointment.toString());
                    savedAppointment = <JSON><unknown> {
                        'userId': newAppointment.userId,
                        'requestId': newAppointment.requestId,
                        'date': 'none'
                    }
                    this.publish(this.appointmentResponse, JSON.stringify(savedAppointment));
            }
        })
    }

    //Publish method
    public publish(topic: string, responseMessage: string) {
        this.client.on('connect', () => {
            this.client.publish(topic, responseMessage);
            console.log(topic ,responseMessage)
        })
    }
}



