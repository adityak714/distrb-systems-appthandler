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
import { mailBookingConfirmation, mailBookingChange, mailBookingDeletion } from '../Notifications/emailService'



export interface IEditAppointment {
        userId: string,
        dentistId: string,
        requestId: string, 
        issuance: string,
        date: string,
        editDate: string
}
export interface IAppointment {
    userId: string,
    dentistId: string,
    requestId: string, 
    issuance: string,
    date: string
}
export interface IUser {
    jwtToken: string,
    name: string,
    email: string,
    password: string

}

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
        
        /*
        readonly client = mqtt.connect('mqtt://broker.hivemq.com',{
            port: 1883,
            username: 'T2Project',
            password: 'Mamamia1234.',
        });
        */

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
    readonly userAppointmentsResponse = 'user/appointments/response'
    readonly userAppointmentsRequest = 'user/appointments/request'
    readonly getAppointmentsResponse = 'get/appointments/response'
    readonly deleteAppointmentRequest = 'delete/appointment/request'
    readonly deleteAppointmentResponse = 'delete/appointment/response'
    readonly deleteAllAppointments = 'delete/appointments/request'
    
    editAppointment : IEditAppointment = {
        userId: '',
        dentistId: '',
        requestId: '',
        issuance: '',
        date: '',
        editDate: ''
    }
    appointment : IAppointment= {
        userId: '',
        dentistId: '',
        requestId: '',
        issuance: '',
        date: '',
    }
    user : IUser | null = {
        jwtToken: '',
        name: '',
        email: '',
        password: ''
    }
    
    public connect() {
        this.client.on('connect', () => {
            console.log('Client is connected to the internet');
            this.client.subscribe(this.appointmentRequest, {qos: 1})
            this.client.subscribe(this.editRequest)
            this.client.subscribe(this.editAvailabilityResponse, {qos: 1})
            this.client.subscribe(this.availabilityResponse, {qos: 1})
            this.client.subscribe(this.userAppointmentsRequest, {qos: 1});
            this.client.subscribe(this.userAppointmentsResponse, {qos: 1});
            this.client.subscribe(this.getAppointmentsRequest, {qos: 1});
            this.client.subscribe(this.getAppointmentsResponse, {qos: 1});
            this.client.subscribe(this.deleteAppointmentRequest, {qos: 1});
            this.client.subscribe(this.deleteAppointmentResponse, {qos: 1});
            this.client.subscribe(this.deleteAllAppointments, {qos: 1});
            console.log('Client has subscribed successfully')
            this.client.on('message', async (topic, message) => {
                if (topic === this.appointmentRequest){
                    this.appointment = JSON.parse(message.toString());
                    console.log(this.appointment)
                    this.user = await this.getUserQuery.getUser(this.appointment.userId)
                    const response: JSON = <JSON><unknown>{
                        'dentistId': this.appointment.dentistId,
                        'date': this.appointment.date
                    }
                    console.log(response)
                    this.client.publish(this.availabilityRequest, JSON.stringify(response), {qos: 1});
                }
                if(topic === this.getAppointmentsRequest) {
                    const dentistryInfo = JSON.parse(message.toString());
                    console.log(dentistryInfo)
                    const appointments = await this.getAppointmentsCommand.getAllAppointments(dentistryInfo.dentistId)
                    this.client.publish(this.getAppointmentsResponse, JSON.stringify(appointments))
                }

                if(topic === this.getAppointmentsResponse) {
                    const appointments = JSON.parse(message.toString());
                }
                if(topic === this.userAppointmentsRequest) {
                    const request = JSON.parse(message.toString());
                    console.log(request)
                    const appointments = await this.getAppointmentsCommand.getAppointmentsByUserId(request.userId)
                    console.log(appointments)
                    this.client.publish(this.userAppointmentsResponse, JSON.stringify(appointments))
                }
                if(topic === this.userAppointmentsResponse) {
                    const appointments = JSON.parse(message.toString());
                    console.log(appointments)
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
                            const newAppointment = this.appointment;
                            this.createAppointmentCommand.createAppointment(newAppointment.userId, newAppointment.dentistId, newAppointment.requestId, newAppointment.issuance, newAppointment.date);
                            const date = convertToLocalTime(new Date(newAppointment.date), 'sv-SE')
                            savedAppointment = <JSON><unknown> {
                                'userId': newAppointment.userId,
                                'requestId': newAppointment.requestId,
                                'date': date
                            }
                            console.log(savedAppointment)
                            await mailBookingConfirmation(this.user!.name, this.user!.email, newAppointment.dentistId, newAppointment.date).catch((err) => {
                                console.log(err)
                            })
                            this.client.publish(this.appointmentResponse, JSON.stringify(savedAppointment), {qos: 1});
                            break;
                        case 'no':
                            savedAppointment = <JSON><unknown> {
                                'userId': this.appointment.userId,
                                'requestId': this.appointment.requestId,
                                'date': 'none'
                            }
                            console.log(savedAppointment)
                            this.client.publish(this.appointmentResponse, JSON.stringify(savedAppointment), {qos: 1});
                        }
                }
                if(topic === this.editRequest) {
                    this.editAppointment = JSON.parse(message.toString())
                    console.log(this.editAppointment)
                    const response: JSON = <JSON><unknown>{
                        'dentistId': this.editAppointment.dentistId,
                        'date': this.editAppointment.editDate
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
                            newAppointment = this.editAppointment;
                            const updatedStatus = await this.editAppointmentCommand.editAppointment(newAppointment.userId, newAppointment.dentistId, newAppointment.requestId, newAppointment.issuance, newAppointment.date, newAppointment.editDate);
                            const date = convertToLocalTime(new Date(newAppointment.editDate), 'sv-SE')
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
                            this.client.publish(this.editResponse, JSON.stringify(savedAppointment), {qos: 1});
                            break;
                        case 'no':
                            newAppointment = this.editAppointment;
                            console.log(newAppointment)
                            savedAppointment = <JSON><unknown> {
                                'userId': newAppointment.userId,
                                'requestId': newAppointment.requestId,
                                'date': 'none',
                            }
                            console.log(savedAppointment)
                            this.client.publish(this.editResponse, JSON.stringify(savedAppointment), {qos: 1});
                        }
                }
                if(topic === this.deleteAllAppointments) {
                    const newMessage = JSON.parse(message.toString())
                    const answer = await this.deleteAppointmentCommand.deleteAllAppointments(newMessage.dentistId)
                    console.log(answer)
                }
                if(topic === this.deleteAppointmentRequest) {
                    const newAppointment  = JSON.parse(message.toString());
                    console.log("delete message ", newAppointment)
                    const answer = await this.deleteAppointmentCommand.deleteAppointment(newAppointment.userId, newAppointment.dentistId, newAppointment.date)
                    console.log(answer)
                    const response = <JSON><unknown> {
                        'response': answer
                    }
                    await mailBookingDeletion(this.user!.email, newAppointment.dentistId, newAppointment.date, this.user!.name).catch((err) => {
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
