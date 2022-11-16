/* eslint-disable prettier/prettier */
import mqtt from 'mqtt'
import { createAppointmentCommand } from '../../Application/Commands/createAppointmentCommand';

export class MQTTController {

    constructor(private createAppointmentCommand: createAppointmentCommand){}

    readonly client = mqtt.connect('mqtt://broker.hivemq.com');
    readonly requestTopic = 'availability/request';
    readonly responseTopic = 'availability/response';

    //Publish method
    public publish(topic: string, responseMessage: string) {
        this.client.on('connect', () => {
            this.client.publish(topic, responseMessage);
            console.log(topic ,responseMessage)
        })
    }

    //Subscribe method
    public subscribe(){
        this.client.on('connect', () => {
            this.client.subscribe(this.requestTopic);
            console.log('Client has subscribed successfully');
        });
        this.client.on('message', async (topic, message) => {
            const newMessage = JSON.parse(message.toString());
            const appointmentCommand =  this.createAppointmentCommand.createAppointment(newMessage.userId, newMessage.dentistId, newMessage.issuance, newMessage.date)
            this.publish(this.responseTopic, await appointmentCommand)
        });
    }
}



