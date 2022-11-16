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
    topicArray : string[] = [this.availabilityTopic, this.appointmentTopic];
    booking : string = '';

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
            for(let i = 0; i < this.topicArray.length; i++) {
                this.client.subscribe(this.topicArray[i]);
                console.log('Client has subscribed successfully to ' + this.topicArray[i]);
            }
        });
        this.client.on('message', async (topic, message) => {
            if(topic === 'availability/response') {
                switch(message.toString()) {
                    case 'yes':
                        const newMessage = JSON.parse(message.toString());
                        console.log(newMessage);
                        const appointmentCommand =  this.createAppointmentCommand.createAppointment(newMessage.userId, newMessage.dentistId, newMessage.issuance, newMessage.date)
                        this.publish(this.appointmentResponse, await appointmentCommand);
                        break;
                    case 'no':
                        console.log(message.toString())
                        this.publish(this.appointmentResponse, 'no');
                }

            }
            if (topic === this.appointmentRequest) {
                this.booking = message.toString();
                this.publish(this.availabilityRequest, message.toString());
            }
           
        });
    }
}



