# Welcome to T2 Appointment Handler of Dentistimo Project!

## DIT356 Mini Project: Distributed Systems

<br>

![Inline image](Tooth.png)

<br>

# Team members

Oscar Reina Gustafsson [gusreinaos@student.gu.se]

Aditya Khadkikar [guskhadad@student.gu.se]

Anton Golubenko [gusgoluan@student.gu.se]

Kwabena Asare Boström [gusasarkw@student.gu.se]

Andreea Fulger [gusandrfu@student.gu.se]

Danesh Mohammadi [gusdanemo@student.gu.se]

Aleksey Zorin [guszorial@student.gu.se]

[gusreinaos@student.gu.se]:mailto:gusreinaos@student.gu.se
[guskhadad@student.gu.se]:mailto:guskhadad@student.gu.se
[gusgoluan@student.gu.se]:mailto:gusgoluan@student.gu.se
[gusasarkw@student.gu.se]:mailto:gusasarkw@student.gu.se
[gusandrfu@student.gu.se]:mailto:gusandrfu@student.gu.se
[gusdanemo@student.gu.se]:mailto:gusdanemo@student.gu.se
[guszorial@student.gu.se]:mailto:guszorial@student.gu.se

<br>

## Find dental care close to you

Our platform brings together the best affordable dental care in your area. With a single click you can now book your chosen dentist at your convenience. If you can feel it in your tooth it's time to visit us at dentistimo.com. Whether you're looking to redesign your smile or to fix an annoying cavity, Dentistimo is the solution for you. As simple to use as saying "Ouch!"

<br>

# Conceptual design

This system is a distributed system with a presentation layer that communicates with its subsystems via a broker and a gateway. The Gateway in question is used to act as both a type of validator and a filter for the data in the messages sent. Each subsystems are independent and have no coupling to one another which is the intention for the system to achieve easy scalability through modularization with the subsystem modules.

<br>

# Architectural styles

The system will be event driven, using the publish/subscribe model. This means that in short, there will be event producers publishing messages to a topic to which one or mupltiple consumers are subscribed to. These consumers are independent of each other and are only subscribed to the necessary topics. A broker is implemented to act as a middle man between the producers and consumers. The broker keeps track of which subsystem is subscribed to what topic. This style is well-suited for a distributed system where multiple subsystems have to process the same event. It also allows for real-time processing and better performance. Horizontal expansion of this system is also easily achived using this style.

<br>

# Conceptual design mapping

Our system consists of frontend and backend subsystems, in which messages to and from the subsystems are sent over MQTT using publish/subscribe to transfer the data, and get filtered through a gateway. Once the required filtering and processing has occurred, the subsystem that requested data to be processed will handle the data.

<br>