/* eslint-disable no-case-declarations */
/* eslint-disable prettier/prettier */
import mqtt, { IClientOptions } from 'mqtt'
import { createAppointmentCommand } from '../../Application/Commands/createAppointmentCommand';
import { editAppointmentCommand } from '../../Application/Commands/editAppointmentCommand';
import { getAppointmentsCommand } from '../../Application/Commands/getAppointmentsCommand';
import { deleteAppointmentCommand } from '../../Application/Commands/deleteAppointmentCommand';
import { getUserQuery } from '../../Application/Queries/getUserQuery';
import { convertDate } from '../../Domain/Utils/convertDate';
import { convertToLocalTime } from '../../Domain/Utils/dateUtils';
import { IUser } from '../../Domain/Intefaces/IUser';
import { mailBookingConfirmation, mailBookingChange, mailBookingDeletion } from '../Notifications/emailService'



export class MQTTController {

    constructor(private createAppointmentCommand: createAppointmentCommand, private editAppointmentCommand: editAppointmentCommand, private getAppointmentsCommand: getAppointmentsCommand,
        private deleteAppointmentCommand: deleteAppointmentCommand, private getUserQuery: getUserQuery){}

        readonly options: IClientOptions = {
            port: 8883,
            host: 'cb9fe4f292fe4099ae5eeb9f230c8346.s2.eu.hivemq.cloud',
            protocol: 'mqtts',
            username: 'T2Project',
            password: 'Mamamia1234.'
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
    readonly getAppointmentsRequest = 'get/appointments/request'
    readonly getAppointmentsResponse = 'get/appointments/response'
    readonly deleteAppointmentRequest = 'delete/appointment/request'
    readonly deleteAppointmentResponse = 'delete/appointment/response'
    readonly userInformationRequest = 'information/request'
    readonly userInformationResponse = 'information/response'

    appointment = '';
    user : IUser | null = {
        'jwtToken': '',
        'name': '',
        'email': '',
        'password': ''

    }
    public connect() {
        this.client.on('connect', () => {
            console.log('Client is connected to the internet');
            this.client.subscribe(this.appointmentRequest, {qos: 1})
            this.client.subscribe(this.editRequest)
            this.client.subscribe(this.editAvailabilityResponse, {qos: 1})
            this.client.subscribe(this.availabilityResponse, {qos: 1})
            this.client.subscribe(this.getAppointmentsRequest, {qos: 1});
            this.client.subscribe(this.getAppointmentsResponse, {qos: 1});
            this.client.subscribe(this.deleteAppointmentRequest, {qos: 1});
            this.client.subscribe(this.deleteAppointmentResponse, {qos: 1});
            console.log('Client has subscribed successfully')
            this.client.on('message', async (topic, message) => {
                if (topic === this.appointmentRequest){
                    this.appointment = message.toString();
                    console.log(this.appointment)
                   
                    const newMessage = JSON.parse(this.appointment);
                    this.user = await this.getUserQuery.getUser(newMessage.userId)
                    console.log(this.user)
                    const response: JSON = <JSON><unknown>{
                        'dentistId': newMessage.dentistId,
                        'date': newMessage.date
                    }
                    console.log(response)
                    this.client.publish(this.availabilityRequest, JSON.stringify(response), {qos: 1});
                    }
                if(topic === this.getAppointmentsRequest) {
                    const dentistryInfo = JSON.parse(message.toString());
                    console.log(dentistryInfo)
                    const appointments = await this.getAppointmentsCommand.getAllAppointments(dentistryInfo.dentistId)
                    console.log(appointments);
                    this.client.publish(this.getAppointmentsResponse, JSON.stringify(appointments))
                }
                if(topic === this.getAppointmentsResponse) {
                    const appointments = JSON.parse(message.toString());
                    console.log(appointments);
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
                            await mailBookingConfirmation(this.user!.name, this.user!.email, newAppointment.dentistId, date).catch((err) => {
                                console.log(err)
                            })
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
                    const convertedDate = convertDate(newMessage.editDate)
                    const response: JSON = <JSON><unknown>{
                        'dentistId': newMessage.dentistId,
                        'date': convertedDate
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
                            const updatedStatus = await this.editAppointmentCommand.editAppointment(newAppointment.userId, newAppointment.dentistId, newAppointment.requestId, newAppointment.issuance, newAppointment.date, newAppointment.editDate);
                            const date = convertToLocalTime(newAppointment.editDate, 'sv-SE')
                            console.log(updatedStatus)
                            if(updatedStatus === 'updated') {
                                savedAppointment = <JSON><unknown> {
                                    'userId': newAppointment.userId,
                                    'requestId': newAppointment.requestId,
                                    'date': date,
                                    'status': 'edited'
                                }
                            }else {
                                savedAppointment = <JSON><unknown> {
                                    'userId': newAppointment.userId,
                                    'requestId': newAppointment.requestId,
                                    'date': 'none',
                                }
                            }
                           
                            console.log(savedAppointment)
                            await mailBookingChange(this.user!.email, newAppointment.dentistId, date, this.user!.name).catch((err) => {
                                console.log(err)
                            })
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
                if(topic === this.deleteAppointmentRequest) {
                    const newAppointment  = JSON.parse(message.toString());
                    console.log("delete message ", newAppointment)
                    const answer = await this.deleteAppointmentCommand.deleteAppointment(newAppointment.userId, newAppointment.dentistId, newAppointment.requestId, newAppointment.issuance, newAppointment.date)
                    const date = convertToLocalTime(newAppointment.date, 'sv-SE')
                    console.log(answer)
                    const response = <JSON><unknown> {
                        'response': answer
                    }
                    await mailBookingChange(this.user!.email, newAppointment.dentistId, this.user!.name, date).catch((err) => {
                        console.log(err)
                    })
                    this.client.publish(this.deleteAppointmentResponse, JSON.stringify(response), {qos: 1})
                }
                if(topic === this.deleteAppointmentResponse) {
                    const deletedStatus = JSON.parse(message.toString());
                    console.log(deletedStatus)
                }

                
                })
        })
    }
}
