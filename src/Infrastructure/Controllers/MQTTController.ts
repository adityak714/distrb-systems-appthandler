/* eslint-disable no-case-declarations */
/* eslint-disable prettier/prettier */
import mqtt, {IClientOptions} from 'mqtt'
import { createAppointmentCommand } from '../../Application/Commands/createAppointmentCommand';
import { editAppointmentCommand } from '../../Application/Commands/editAppointmentCommand';
import { getAppointmentsCommand } from '../../Application/Commands/getAppointmentsCommand';
import { deleteAppointmentCommand } from '../../Application/Commands/deleteAppointmentCommand';
import { convertToLocalTime } from '../../Domain/Utils/dateUtils';
import CircuitBreaker from 'opossum';
import { getUserQuery } from '../../Application/Queries/getUserQuery';
import { IUser } from '../../Domain/Intefaces/IUser';
import { mailBookingConfirmation, mailBookingDeletion } from '../Notifications/emailService';

export class MQTTController {

    constructor(private createAppointmentCommand: createAppointmentCommand,
                private editAppointmentCommand: editAppointmentCommand,
                private getAppointmentsCommand: getAppointmentsCommand,
                private deleteAppointmentCommand: deleteAppointmentCommand,
                private getUserQuery: getUserQuery){}

        readonly mqttoptions: IClientOptions = {
            port: 8883,
            host: 'cb9fe4f292fe4099ae5eeb9f230c8346.s2.eu.hivemq.cloud',
            protocol: 'mqtts',
            username: 'T2Project',
            password: 'Mamamia1234.'
        }



        /*readonly client = mqtt.connect('mqtt://broker.hivemq.com',{
            port: 1883,
            username: 'T2Project',
            password: 'Mamamia1234.',
        });
        */

        options: CircuitBreaker.Options = {
            timeout: 500, // If our function takes longer than 3 seconds, trigger a failure
            errorThresholdPercentage: 50,// When 50% of requests fail, trip the circuit
            resetTimeout: 5000 // After 30 seconds, try again.
            };

        readonly client = mqtt.connect(this.mqttoptions);

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

        //Global variables
        user : IUser | null = {
            jwtToken: '',
            name: '',
            email: '',
            password: ''

        }
       appointment = ''

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
                    this.appointment = message.toString();
                    const newMessage = JSON.parse(this.appointment);
                    this.user = await this.getUserQuery.getUser(newMessage.userId)
                    const response: JSON = <JSON><unknown>{
                        'dentistId': newMessage.dentistId,
                        'date': newMessage.date
                    }
                    console.log(response)
                    this.client.publish(this.availabilityRequest, JSON.stringify(response), {qos: 1});
                    }

                if(topic === this.getAppointmentsRequest) {
                    const getAppointmentsBreaker = new CircuitBreaker((dentistId:string) => {
                        return this.getAppointmentsCommand.getAllAppointments(dentistId);
                    })

                    try {
                        getAppointmentsBreaker.on('success', (result) => console.log(result))
                        getAppointmentsBreaker.on('timeout', () => console.log('timeout'))
                        getAppointmentsBreaker.on('open', () => console.log('open'))
                        getAppointmentsBreaker.on('halfOpen', () => console.log('halfOpen'));
                        getAppointmentsBreaker.on('close', () => console.log('close'));
                        getAppointmentsBreaker.fallback(() => 'Sorry, out of service right now');
                        getAppointmentsBreaker.on('fallback', () => console.log('Sorry, out of service right now'))

                        const dentistryInfo = JSON.parse(message.toString());

                        const appointments = await getAppointmentsBreaker.fire(dentistryInfo.dentistId)

                        if(!getAppointmentsBreaker.opened) {
                            this.client.publish(this.getAppointmentsResponse, JSON.stringify(appointments))
                        }
                    }

                    catch(error) {
                        console.log(error)
                    }

                }

                if(topic === this.getAppointmentsResponse) {
                    const appointments = JSON.parse(message.toString());
                }

                if(topic === this.userAppointmentsRequest) {

                    const userAppointmentBreaker = new CircuitBreaker((userId: string) => {
                        return this.getAppointmentsCommand.getAppointmentsByUserId(userId)
                    })

                    try {

                        userAppointmentBreaker.on('success', (result) => console.log(result))
                        userAppointmentBreaker.on('timeout', () => console.log('timeout'))
                        userAppointmentBreaker.on('open', () => console.log('open'))
                        userAppointmentBreaker.on('halfOpen', () => console.log('halfOpen'));
                        userAppointmentBreaker.on('close', () => console.log('close'));
                        userAppointmentBreaker.fallback(() => 'Sorry, out of service right now');
                        userAppointmentBreaker.on('fallback', () => console.log('Sorry, out of service right now'))
                        const request = JSON.parse(message.toString());
                        const appointments = await userAppointmentBreaker.fire(request.userId)
                        if(!userAppointmentBreaker.opened) {
                            this.client.publish(this.userAppointmentsResponse, JSON.stringify(appointments))
                        }
                    }
                    catch (error) {
                        console.log(error)
                    }
                }

                if(topic === this.userAppointmentsResponse) {
                    const appointments = JSON.parse(message.toString());
                }

                if (topic === this.availabilityResponse) {

                    const createAppointmentBreaker = new CircuitBreaker((userId: string, dentistId: string, requestId: string, issuance: string, date: string) => {
                        return this.createAppointmentCommand.createAppointment(userId, dentistId, requestId, issuance, date)
                    }, this.options);

                    try {

                        let newAppointment = null;
                        let savedAppointment = null;

                        const firstAnswer = JSON.parse(message.toString())
                        const answer = firstAnswer.response

                        createAppointmentBreaker.on('success', (result) => console.log(result))
                        createAppointmentBreaker.on('timeout', () => console.log('timeout'))
                        createAppointmentBreaker.on('open', () => console.log('Circuitbreaker is open'))
                        createAppointmentBreaker.on('halfOpen', () => console.log('halfOpen'));
                        createAppointmentBreaker.on('close', () => console.log('close'));
                        createAppointmentBreaker.fallback(() => 'Sorry, out of service right now');
                        createAppointmentBreaker.on('fallback', () => console.log('Sorry, out of service right now'));

                        switch(answer) {

                            case 'yes':
                                    newAppointment = JSON.parse(this.appointment);
                                    await createAppointmentBreaker.fire(newAppointment.userId, newAppointment.dentistId, newAppointment.requestId, newAppointment.issuance, newAppointment.date);

                                    const date = convertToLocalTime(newAppointment.date, 'sv-SE')
                                    savedAppointment = <JSON><unknown> {
                                        'userId': newAppointment.userId,
                                        'requestId': newAppointment.requestId,
                                        'date': date
                                    }
                                    console.log(savedAppointment)

                                    await mailBookingConfirmation(this.user!.name, this.user!.email, newAppointment.dentistId, newAppointment.date).catch((err) => {
                                        console.log(err)
                                    })

                                    if(!createAppointmentBreaker.opened) {
                                        this.client.publish(this.appointmentResponse, JSON.stringify(savedAppointment), {qos: 1});
                                    }

                                    break;

                            case 'no':
                                newAppointment = JSON.parse(this.appointment);
                                savedAppointment = <JSON><unknown> {
                                    'userId': newAppointment.userId,
                                    'requestId': newAppointment.requestId,
                                    'date': 'none'
                                    }
                                console.log(savedAppointment)
                                this.client.publish(this.appointmentResponse, JSON.stringify(savedAppointment), {qos: 1});

                                break;
                            }

                    } catch(err) {
                        createAppointmentBreaker.on('fallback', () => 'Sorry, out of service right now')
                        createAppointmentBreaker.fallback(() => console.log('Sorry, out of service right now'))
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
                if(topic === this.deleteAllAppointments) {
                    //Create circuitbreaker for creating appointment
                    const deleteAppointmentsBreaker = new CircuitBreaker((dentistId: string) => {
                        return this.deleteAppointmentCommand.deleteAllAppointments(dentistId)
                    }, this.options);
                    try {
                        deleteAppointmentsBreaker.on('success', (result) => console.log(result))
                        deleteAppointmentsBreaker.on('timeout', () => console.log('timeout'))
                        deleteAppointmentsBreaker.on('open', () => console.log('open'))
                        deleteAppointmentsBreaker.on('halfOpen', () => console.log('halfOpen'));
                        deleteAppointmentsBreaker.on('close', () => console.log('close'));
                        deleteAppointmentsBreaker.fallback(() => 'Sorry, out of service right now');
                        deleteAppointmentsBreaker.on('fallback', () => console.log('Sorry, out of service right now'))
                        const newMessage = JSON.parse(message.toString())
                        const answer = await deleteAppointmentsBreaker.fire(newMessage.dentistId)
                        console.log(answer)
                    }
                    catch(error) {
                        console.log(error)
                    }
                }
                if(topic === this.deleteAppointmentRequest) {
                    const deleteAppointmentBreaker = new CircuitBreaker((userId:string, dentistId: string, date: string) => {
                        return this.deleteAppointmentCommand.deleteAppointment(userId,dentistId, date)
                    }, this.options);

                    try {
                        const newAppointment  = JSON.parse(message.toString());
                        console.log('delete message ', newAppointment)
                        const answer = await deleteAppointmentBreaker.fire(newAppointment.userId, newAppointment.dentistId, newAppointment.date)
                        console.log(answer)
                        const response = <JSON><unknown> {
                            'response': answer
                        }
                        if(!deleteAppointmentBreaker.opened) {
                            this.client.publish(this.deleteAppointmentResponse, JSON.stringify(response), {qos: 1})
                            await mailBookingDeletion(this.user!.email, newAppointment.dentistId, newAppointment.date, this.user!.name).catch((err) => {
                                console.log(err)
                            })
                        }
                    }
                    catch (err) {
                        console.log(err)
                    }
                }
                if(topic === this.deleteAppointmentResponse) {
                    const deletedStatus = JSON.parse(message.toString());
                    console.log(deletedStatus)
                }
                })
        })
    }
}
