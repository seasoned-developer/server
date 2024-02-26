import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

email_address = 'votre_adresse_email@gmail.com'
email_password = 'votre_mot_de_passe'
to_email = 'destinataire@example.com'
msg = MIMEMultipart()
msg['From'] = email_address
msg['To'] = to_email
msg['Subject'] = 'Sujet de l\'e-mail'
body = 'Contenu du message.'
msg.attach(MIMEText(body, 'plain'))
server = smtplib.SMTP('smtp.gmail.com', 587)
server.starttls()
server.login(email_address, email_password)
server.sendmail(email_address, to_email, msg.as_string())
server.quit()
print("E-mail envoyé avec succès.")
