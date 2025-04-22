# Send Mail with Python SMTP Client

This template allows you to send an email using a Python SMTP client, with optional support for attachments. Email settings and credentials are provided as parameters, making this solution both flexible and secure.

## Parameters

- **MAIL_SUBJECT**  
  _(Required)_ The subject of the email.

- **MAIL_BODY**  
  _(Required)_ The body of the email, supports HTML content.

- **RECEIVER_EMAIL**  
  _(Required)_ The recipient's email address.

- **SENDER_EMAIL**  
  _(Required)_ The sender's email address.

- **APP_PASS**  
  _(Required)_ The SMTP app password used to authenticate the sender.

- **ATTACHMENTS_COMMA_SEP**  
  _(Optional)_ Comma-separated list of attachment file names (e.g., `file1.pdf,file2.jpg`). Leave empty if no attachments are needed.

- **CONDITION_FLAG**  
  _(Optional)_ Conditional expression for running the script. Default is `succeeded()`.

## Features

- Supports multiple attachments (optional).
- The email body can be formatted with HTML.
- Conditional execution using the `CONDITION_FLAG` parameter.
- Credentials are provided securely via parameters.

## How it Works

1. All parameters are set via pipeline or directly by the user.
2. The email message is built as a multipart message, with the body and optionally attachments included.
3. Sending is performed via Gmail SMTP server (SSL, port 465), authenticating using the app password.

---

> **Note:**  
> Ensure that the sender has enabled App Passwords in their Gmail account and that the SMTP server supports SSL.  
> Attachment filenames must be available in the script execution directory.

## Example Usage

Suppose you want to send an email with subject "Report", an HTML message body, to `recipient@example.com` from `sender@gmail.com`, using an app password, and attaching two files (`report.pdf`, `image.png`).

Example pipeline parameters:

```yaml
- resources:
  repositories:
  - repository: azure
    type: github
    name: pagopa/azure-pipeline-templates
    endpoint: 'azure-devops-github-ro'
```
```yaml
- template: templates/send-mail/template.yaml@azure
  parameters:
    CONDITION_FLAG: "failed()"
    MAIL_SUBJECT: "SUBJECT_HERE"
    MAIL_BODY: |
      <html>
        <body>
          <p>This is an email body.</p>
        </body>
      </html>
    SENDER_EMAIL: "sender@gmail.com"
    RECEIVER_EMAIL: "recipient@example.com" 
    APP_PASS: "APP PASSWORD"
    ATTACHMENTS_COMMA_SEP: "example.pdf"
```


This configuration will send an HTML-formatted email with the given subject, body, and attachments, as long as the `CONDITION_FLAG` is met.

---

For customization or to use an SMTP server other than Gmail, change the connection parameters (host, port) and, if needed, adapt the authentication logic accordingly.
