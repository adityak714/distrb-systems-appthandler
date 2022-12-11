/* eslint-disable no-case-declarations */
/* eslint-disable prettier/prettier */
import mqtt, { IClientOptions } from 'mqtt'
import { createAppointmentCommand } from '../../Application/Commands/createAppointmentCommand';
import { editAppointmentCommand } from '../../Application/Commands/editAppointmentCommand';
import { convertToLocalTime } from '../../Domain/Utils/dateUtils';


export class MQTTController {

    constructor(private createAppointmentCommand: createAppointmentCommand, private editAppointmentCommand: editAppointmentCommand){}

    readonly options: IClientOptions = {
        port: 8883,
        host: 'e960f016875b4c75857353c7f267d899.s2.eu.hivemq.cloud',
        protocol: 'mqtts',
        username: 'gusasarkw@student.gu.se',
        password: 'Twumasi123.'
    }

    //readonly client = mqtt.connect('mqtt://broker.hivemq.com');

    readonly client = mqtt.connect(this.options);
    readonly mqtt_options = {qos: 1};

    readonly availabilityTopic = 'avaiability/#'
    readonly appointmentTopic = 'appointment/#'
    readonly appointmentResponse = 'appointment/response'
    readonly appointmentRequest = 'appointment/request'
    readonly availabilityRequest = 'availability/request'
    readonly availabilityResponse = 'availability/response'
    readonly editRequest = 'edit/request'
    readonly editResponse = 'edit/response'
    readonly editAvailabilityResponse = 'edit/availability/response'
    readonly editAvailabilityRequest = 'edit/availability/request'

    appointment = '';
    public connect() {
        this.client.on('connect', () => {
            console.log('Client is connected to the internet');
            this.client.subscribe(this.appointmentRequest, {qos: 1})
            this.client.subscribe(this.editRequest)
            this.client.subscribe(this.editAvailabilityResponse, {qos: 1})
            this.client.subscribe(this.availabilityResponse, {qos: 1})
            console.log('Client has subscribed successfully')
            this.client.on('message', (topic, message) => {
                if (topic === this.appointmentRequest){
                    this.appointment = message.toString();
                    console.log(this.appointment)
                    const newMessage = JSON.parse(this.appointment);
                    const response: JSON = <JSON><unknown>{
                        'dentistId': newMessage.dentistId,
                        'date': newMessage.date
                    }
                    console.log(response)
                    this.client.publish(this.availabilityRequest, JSON.stringify(response), {qos: 1});
                    }
                 if (topic === this.availabilityResponse) {
                    let newAppointment = null;
                    let savedAppointment = null;
                    const firstAnswer = JSON.parse(message.toString())
                    console.log(firstAnswer)
                    const answer = firstAnswer.response
                    console.log(answer)
                    switch(answer) {
                        case 'yes':
                            newAppointment = JSON.parse(this.appointment);
                            this.createAppointmentCommand.createAppointment(newAppointment.userId, newAppointment.dentistId, newAppointment.requestId, newAppointment.issuance, newAppointment.date);
                            const date = convertToLocalTime(newAppointment.date, 'sv-SE')
                            savedAppointment = <JSON><unknown> {
                                'userId': newAppointment.userId,
                                'requestId': newAppointment.requestId,
                                'date': date
                            }
                            console.log(savedAppointment)
                            this.client.publish(this.appointmentResponse, JSON.stringify(savedAppointment), {qos: 1});
                            break;
                        case 'no':
                            newAppointment = JSON.parse(this.appointment);
                            console.log(newAppointment)
                            savedAppointment = <JSON><unknown> {
                                'userId': newAppointment.userId,
                                'requestId': newAppointment.requestId,
                                'date': 'none'
                            }
                            console.log(savedAppointment)
                            this.client.publish(this.appointmentResponse, JSON.stringify(savedAppointment), {qos: 1});
                        }
                    this.appointment = ''
                }
                if(topic === this.editRequest) {
                    this.appointment = message.toString()
                    console.log(this.appointment)
                    const newMessage = JSON.parse(this.appointment);
                    const response: JSON = <JSON><unknown>{
                        'dentistId': newMessage.dentistId,
                        'date': newMessage.editDate
                    }
                    console.log(response)
                    this.client.publish(this.editAvailabilityRequest, JSON.stringify(response), {qos: 1});
                }
                if(topic === this.editAvailabilityResponse) {
                    let newAppointment = null;
                    let savedAppointment = null;
                    const firstAnswer = JSON.parse(message.toString())
                    console.log(firstAnswer)
                    const answer = firstAnswer.response
                    console.log(answer)
                    switch(answer) {
                        case 'yes':
                            newAppointment = JSON.parse(this.appointment);
                            this.editAppointmentCommand.editAppointment(newAppointment.userId, newAppointment.dentistId, newAppointment.requestId, newAppointment.issuance, newAppointment.date, newAppointment.editDate);
                            const date = convertToLocalTime(newAppointment.editDate, 'sv-SE')
                            console.log(date)
                            savedAppointment = <JSON><unknown> {
                                'userId': newAppointment.userId,
                                'requestId': newAppointment.requestId,
                                'date': date,
                                'status': 'edited'
                            }
                            console.log(savedAppointment)
                            this.client.publish(this.editResponse, JSON.stringify(savedAppointment), {qos: 1});
                            break;
                        case 'no':
                            newAppointment = JSON.parse(this.appointment);
                            console.log(newAppointment)
                            savedAppointment = <JSON><unknown> {
                                'userId': newAppointment.userId,
                                'requestId': newAppointment.requestId,
                                'date': 'none',
                            }
                            console.log(savedAppointment)
                            this.client.publish(this.editResponse, JSON.stringify(savedAppointment), {qos: 1});
                        }
                this.appointment = ''
                }

                })
               

        })
    }
}
