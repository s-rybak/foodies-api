const { BASE_URL, MAILER_FROM_NAME, MAILER_FROM_EMAIL } = process.env;

/**
 * Generates HTML markup for an email confirmation message.
 * Varies email text depending on whether it is the initial verification or a resent request.
 *
 * @param {string} confirmationLink The link to confirm the email address. Defaults to "#".
 * @param {boolean} [isResent=false] Indicates if the email is a resent confirmation email. Defaults to false.
 * @param {string} supportTeamEmail The email address of the support team. Defaults to the value of `UKR_NET_FROM_EMAIL`.
 *
 * @returns {string} The HTML markup for the email confirmation.
 */
export const emailConfirmationHtml = (
  confirmationLink = "#",
  isResent = false,
  userName,
  supportTeamEmail = MAILER_FROM_EMAIL
) => `<!DOCTYPE html>
<html>

<head>
  <style>
    body {
      width: 100%;
      font-family: 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.7;
      background-color: #f9f9f9;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    a {
      color: #1a73e8;
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
      color: #0a5cbb;
    }

    .email-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px 24px;
      border: 1px solid #e0e0e0;
      border-radius: 5px;
      background-color: #ffffff;
      /* Add gradient effect */
      background: linear-gradient(to bottom right, #ffffff 90%, rgba(0, 0, 0, 0.05) 100%);
      position: relative;
    }

    .foodies-logo {
      height: 54px;
      margin-bottom: 20px;
    }

    .greeting {
      margin-bottom: 28px;
      font-weight: 600;
    }

    .signature {
      margin-top: 28px;
    }

    .button {
      display: inline-block;
      margin-top: 16px;
      margin-bottom: 20px;
      background-color: #050505;
      color: white;
      padding: 6px 28px 8px 28px;
      text-decoration: none;
      border-radius: 18px;
      font-size: 16px;
      text-align: center;
    }

    .button:hover {
      color: white;
      background-color: #1A1A1A;
    }

    .button:focus {
      color: white;
      outline: 2px solid #4CAF50;
      outline-offset: 4px;
    }

    .footer {
      font-size: 0.8em;
      color: #555;
    }
  </style>
</head>

<body>
  <div class="email-container">
    <a href="${BASE_URL}" alt="foodies logo" title="Go to foodies website"><img class="foodies-logo" src="cid:logo@foodies-api"/></a>
    <p class="greeting">Dear ${userName || "User"},</p>

    ${
      isResent
        ? `<p>We have received your request to resend the confirmation email.</p>`
        : `<p>
              Thank you for registering with our service! We're excited to have you
              on board.
          </p>`
    }

    <p>To complete your registration and get full access to our features, please confirm your email address by clicking
      the button below:</p>

    <p style="text-align: center;">
      <a href="${confirmationLink}" 
          class="button" target="_blank" 
          rel="noopener noreferrer"
          title="Click to confirm your email"
          aria-label="con firm email">Confirm your email</a>
    </p>

    
    <p>
    ${
      isResent
        ? `If you did not request to resend the confirmation email, please ignore this message.`
        : `If you did not register for our service, please ignore this email.`
    }
    
    <br />
    If you have any questions, feel free to
      ${
        supportTeamEmail
          ? `<a href="mailto:${supportTeamEmail}?subject=Email verification for foodies&body=Dear foodies Team," aria-label="contact support">contact our support team</a>`
          : `contact our support team`
      }
      .
    </p>

    <p class="signature">Best regards,<br>${MAILER_FROM_NAME}</p>

    <hr style="border-top: 1px solid #e0e0e0; margin-top: 20px;">

    <p class="footer">
      This email is sent to verify your email address and enhance the security of your account.
      <br />
      Confirming your email helps us ensure that you are the rightful owner of this address and protects you from
      unauthorized access.
    </p>
  </div>
</body>

</html>
`;
