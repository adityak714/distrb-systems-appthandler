/* eslint-disable no-case-declarations */
/* eslint-disable prettier/prettier */
import mqtt from 'mqtt'
import { createAppointmentCommand } from '../../Application/Commands/createAppointmentCommand';

export class MQTTController {

    constructor(private createAppointmentCommand: createAppointmentCommand){}

    readonly client = mqtt.connect('mqtt://broker.hivemq.com');
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
        });
        this.client.on('message', async (topic, message) => {
            this.appointment = message.toString();
            const newMessage = JSON.parse(message.toString());
            const response: JSON = <JSON><unknown>{
                'dentistId': newMessage.dentistId,
                'date': newMessage.date
            }
            this.publish(this.availabilityRequest, JSON.stringify(response));
        })
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



