import nodemailer from 'nodemailer';

export interface TeamMember {
  name: string;
  email: string;
  phone: string;
  year: string;
  branch: string;
  usn: string;
}

export interface RegistrationData {
  teamName: string;
  members: TeamMember[];
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

const getEmailTemplate = (participantName: string, teamName: string): string => {
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .header {
            background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
            color: white;
            padding: 30px;
            border-radius: 8px 8px 0 0;
            text-align: center;
        }
        .content {
            background-color: white;
            padding: 30px;
            margin-bottom: 20px;
        }
        h1 {
            margin: 0;
            font-size: 28px;
        }
        h2 {
            color: #22c55e;
            font-size: 20px;
            margin-top: 20px;
            margin-bottom: 10px;
        }
        .section {
            margin-bottom: 20px;
        }
        .info-box {
            background-color: #f0fdf4;
            border-left: 4px solid #22c55e;
            padding: 15px;
            margin: 10px 0;
            border-radius: 4px;
        }
        .info-box strong {
            color: #16a34a;
        }
        .list {
            margin: 10px 0;
            padding-left: 20px;
        }
        .list li {
            margin-bottom: 8px;
        }
        .footer {
            background-color: #f5f5f5;
            border-top: 1px solid #ddd;
            padding: 20px 30px;
            text-align: center;
            font-size: 12px;
            color: #666;
            border-radius: 0 0 8px 8px;
        }
        .button {
            display: inline-block;
            background-color: #22c55e;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 4px;
            margin: 10px 0;
        }
        .contact-box {
            background-color: #fafafa;
            padding: 15px;
            border-radius: 4px;
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 Registration Confirmed</h1>
            <p>Coding Club Blockchain CTF</p>
        </div>
        
        <div class="content">
            <p>Hi <strong>${participantName}</strong>,</p>
            
            <p>Thank you for registering for the Coding Club Blockchain CTF! We are excited to see you there to put your skills to the test.</p>
            
            <p><strong>Your registration is confirmed.</strong> Please find the essential event details below:</p>
            
            <div class="info-box">
                <p><strong>📅 Date:</strong> 23/04/2026 (Thursday)</p>
                <p><strong>⏰ Time:</strong> 2:00 PM – 6:00 PM</p>
                <p><strong>📍 Venue:</strong> DTH</p>
                <p><strong>🎯 Check-in:</strong> Please arrive by 1:45 PM to settle in.</p>
                <p><strong>👥 Team Name:</strong> ${teamName}</p>
            </div>
            
            <h2>🛠 What to Bring</h2>
            <p>To ensure a smooth experience, please have the following ready:</p>
            <ul class="list">
                <li><strong>Laptop & Charger:</strong> Essential for the duration of the event.</li>
                <li><strong>Technical Setup:</strong> Ensure your browser is updated and any necessary development tools you anticipate using for the blockchain challenges are installed.</li>
            </ul>
            
            <h2>📋 Event Preparation</h2>
            <ul class="list">
                <li><strong>Rules:</strong> Please arrive ready to engage fairly. Any attempts at malfeasance, such as flag sharing or attacking the infrastructure, will lead to immediate disqualification.</li>
                <li><strong>Communication:</strong> Join our WhatsApp community here: <a href="https://chat.whatsapp.com/FF8AugYQwGfLFDhuM9Zupq">https://chat.whatsapp.com/FF8AugYQwGfLFDhuM9Zupq</a> for updates and announcements.</li>
            </ul>
            
            <h2>📞 Need Help?</h2>
            <p>If you have any questions before the event or run into issues on the day, please feel free to reach out to:</p>
            <div class="contact-box">
                <p><strong>Vivaan Hooda:</strong> <a href="https://wa.me/919845936029" target="_blank" rel="noopener noreferrer" style="color: #22c55e; text-decoration: none; font-weight: 500;">9845936029</a></p>
                <p><strong>Sathvic Sharma:</strong> <a href="https://wa.me/917204342252" target="_blank" rel="noopener noreferrer" style="color: #22c55e; text-decoration: none; font-weight: 500;">7204342252</a></p>
            </div>
            
            <p>Best regards,<br><strong>Vivaan Hooda</strong><br>Coding Club RVCE</p>
        </div>
        
        <div class="footer">
            <p>This is an automated email. Please do not reply. For queries, contact us directly.</p>
            <p>&copy; 2026 Coding Club RVCE. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
  `;
};

export async function sendRegistrationEmails(data: RegistrationData): Promise<void> {
  try {
    // Verify transporter connection
    await transporter.verify();
    console.log('✓ Email transporter verified');

    // Send email to each team member
    for (const member of data.members) {
      const mailOptions = {
        from: `"${process.env.SENDER_NAME}" <${process.env.SENDER_EMAIL}>`,
        to: member.email,
        subject: 'Registration Confirmed: Coding Club Blockchain CTF 🚀',
        html: getEmailTemplate(member.name, data.teamName),
      };

      try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`✓ Email sent to ${member.email}:`, info.response);
      } catch (error) {
        console.error(`✗ Failed to send email to ${member.email}:`, error);
        throw error;
      }
    }

    console.log(`✓ All registration emails sent successfully to ${data.members.length} members`);
  } catch (error) {
    console.error('Email sending error:', error);
    throw new Error(`Failed to send registration emails: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
