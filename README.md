# delta_task_3

Subhash just got appointed as the chairman of Festember. He's really happy and wants to celebrate. Ram suggests to organise a booze party at his place. But being a chairman of such a big event, Subhash has too many friends to invite. Help subhash to develop a web application to do the invite job for him.

## Getting Started

1. Download or clone this repo to your local system
2. Install nodejs from Nodejs official website
3. Open the terminal in the folder where you have cloned the project.
4. Now run the following commands

```
   npm cache clean
   npm install
```

5. Now, you should be able to see the node modules folder with all dependencies installed.
6. Install the mongodb community edition from here [Mongodb official documentation](https://docs.mongodb.com/manual/administration/install-community/)
7. Ensure that mongo service has started and is listening on port 27017
8. Now , run the following command back in the terminal at the project folder

```
   npm run dev
```

9. Navigate to http://localhost:8000/login and you should be able to view the login page

## Tasks

All the ticked sub-tasks are completed.

- [x] **Normal mode:**
  - [x] Allow users to schedule an event and create a simple invitation for the same.
  - [x] Implement an authentication system to allow users to register on the site.
  - [x] Allow creation of simple text based invites with components like Header, Body, Footer etc.
  - [x] Create dynamic links for invitation which can be visited to view the invitation.
  - [x] Users must be able to accept / reject invitations.
  - [x] Support private events - allow the host to send the invitation only to people they wish to invite.
  - [x] Create a dashboard for a user to view events they have created and invitations they have accepted.
  - [x] Use prepared statements to prevent SQL injection.
  - [x] Have a neat, intuitive UI.
- [x] **Hackermode:**
  - [x] Implement support for customisable invitations (like fonts, colors etc) - Be creative!
  - [x] Notify users when they receive an invitation, someone accepts their invitation etc.
  - [x] Add support for user response while accepting invitation. (Like how many people they're bringing, food preferences etc)
  - [x] Allow the host to set a deadline to accept an invitation.
  - [x] Have templates for invitations (Birthday Party, Wedding, Funeral etc)
  - [x] Make the website responsive.
- [x] **Hackermode++:**
  - [x] Support addition and dynamic placement of images in the invitation.
  - [x] Implement an attendance tracking system for the events.
  - [x] Google Calendar API integration for users to keep track of events they're attending.
  - [x] Use an Email API to send invitations to users via email.
