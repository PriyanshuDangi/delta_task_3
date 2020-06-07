const sgMail = require('@sendgrid/mail')

const sendgridApiKey = process.env.SENDGRID_API_KEY
sgMail.setApiKey(sendgridApiKey);

function sendInvitation(email, toName, fromName, title, link){
    const msg = {
        to: email,
        from: 'invitataionmail@gmail.com',
        subject: `Invitation for ${title} from ${fromName}`,
        text: `${fromName} invites you for the event ${title}. Please click the link below to see the invitation `,
        html: `${fromName} invites you for the event ${title}. Please click the <a href="${link}">here</a> to see the invitation.`,
    };
    sgMail.send(msg);
}

module.exports = {
    sendInvitation
}
