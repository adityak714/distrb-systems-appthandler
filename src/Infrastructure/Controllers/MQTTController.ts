/* eslint-disable no-case-declarations */
/* eslint-disable prettier/prettier */
import mqtt, { IClientOptions } from 'mqtt'
import { createAppointmentCommand } from '../../Application/Commands/createAppointmentCommand';
import { convertToLocalTime } from '../../Domain/Utils/dateUtils';


export class MQTTController {

    constructor(private createAppointmentCommand: createAppointmentCommand){}

    readonly options: IClientOptions = {
        port: 8883,
        host: '80a9b426b200440c81e9c17c2ba85bc2.s2.eu.hivemq.cloud',
        protocol: 'mqtts',
        username: 'gusreinaos',
        password: 'Mosquitto1204!'
    }

    //readonly client = mqtt.connect('mqtt://broker.hivemq.com');

    readonly client = mqtt.connect(this.options);

    readonly availabilityTopic = 'avaiability/#'
    readonly appointmentTopic = 'appointment/#'
    readonly appointmentResponse = 'appointment/response'
    readonly appointmentRequest = 'appointment/request'
    readonly availabilityRequest = 'availability/request'
    readonly availabilityResponse = 'availability/response'

    appointment = '';

    //Subscribe to frontend request
    public subscribe() {
        this.client.on('connect', () => {
            this.client.subscribe(this.appointmentRequest)
            this.client.subscribe(this.availabilityResponse)
            console.log('Client has subscribed successfully')
        });
        this.client.on('message', async (topic, message) => {

            if (topic === this.appointmentRequest){
                this.appointment = message.toString();
                const newMessage = JSON.parse(this.appointment);
                const response: JSON = <JSON><unknown>{
                    'dentistId': newMessage.dentistId,
                    'date': newMessage.date
                }
                console.log(response)
                this.publish(this.availabilityRequest, JSON.stringify(response));
            }
            else if (topic === this.availabilityResponse) {
                let newAppointment = null;
                let savedAppointment = null;

                switch(message.toString()) {

                    case 'yes':
                        newAppointment = JSON.parse(this.appointment.toString());
                        this.createAppointmentCommand.createAppointment(newAppointment.userId, newAppointment.dentistId, newAppointment.requestId, newAppointment.issuance, newAppointment.date);
                        savedAppointment = <JSON><unknown> {
                            'userId': newAppointment.userId,
                            'requestId': newAppointment.requestId,
                            'date': convertToLocalTime(newAppointment.date)
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
            }
        });
    }

    //Publish method
    public publish(topic: string, responseMessage: string) {
        this.client.on('connect',  () => {
            this.client.publish(topic, responseMessage);
            console.log(topic ,responseMessage)
        })
    }
}
