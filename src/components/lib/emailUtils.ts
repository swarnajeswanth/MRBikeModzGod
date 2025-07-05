import nodemailer from "nodemailer";

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

interface SendOTPEmailParams {
  to: string;
  otp: string;
  role: "customer" | "retailer";
  userName?: string;
}

const getEmailConfig = (): EmailConfig => {
  return {
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.GMAIL_USER!,
      pass: process.env.GMAIL_APP_PASSWORD!,
    },
  };
};

const createTransporter = () => {
  const config = getEmailConfig();
  return nodemailer.createTransport(config);
};

const generateOTPEmailHTML = (
  otp: string,
  role: "customer" | "retailer",
  userName?: string
) => {
  const getRoleSpecificContent = () => {
    if (role === "retailer") {
      return {
        title: "Retailer Account Verification",
        subtitle: "Complete your retailer account setup",
        description: `
          <p>Welcome to MrBikeModzGod! You're setting up your retailer account to manage products and store settings.</p>
          <p>Use the verification code below to complete your registration:</p>
        `,
        footer: `
          <p><strong>Important:</strong></p>
          <ul>
            <li>This code will expire in 10 minutes</li>
            <li>Keep your account credentials secure</li>
            <li>You'll have access to product management and store settings</li>
          </ul>
        `,
      };
    } else {
      return {
        title: "Account Verification",
        subtitle: "Verify your email address",
        description: `
          <p>Welcome to MrBikeModzGod! Please verify your email address to complete your account setup.</p>
          <p>Use the verification code below:</p>
        `,
        footer: `
          <p><strong>Note:</strong></p>
          <ul>
            <li>This code will expire in 10 minutes</li>
            <li>Keep your account credentials secure</li>
          </ul>
        `,
      };
    }
  };

  const content = getRoleSpecificContent();

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${content.title}</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f4f4f4;
            }
            .container {
                background-color: #ffffff;
                border-radius: 10px;
                padding: 30px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
                padding-bottom: 20px;
                border-bottom: 2px solid #e74c3c;
            }
            .logo {
                font-size: 28px;
                font-weight: bold;
                color: #e74c3c;
                margin-bottom: 10px;
            }
            .title {
                font-size: 24px;
                color: #2c3e50;
                margin-bottom: 5px;
            }
            .subtitle {
                font-size: 16px;
                color: #7f8c8d;
            }
            .otp-container {
                background: linear-gradient(135deg, #e74c3c, #c0392b);
                color: white;
                padding: 20px;
                border-radius: 8px;
                text-align: center;
                margin: 30px 0;
            }
            .otp-code {
                font-size: 32px;
                font-weight: bold;
                letter-spacing: 4px;
                margin: 10px 0;
            }
            .content {
                margin: 20px 0;
            }
            .footer {
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #ecf0f1;
                font-size: 14px;
                color: #7f8c8d;
            }
            .footer ul {
                margin: 10px 0;
                padding-left: 20px;
            }
            .footer li {
                margin: 5px 0;
            }
            .warning {
                background-color: #fff3cd;
                border: 1px solid #ffeaa7;
                border-radius: 5px;
                padding: 15px;
                margin: 20px 0;
            }
            .warning strong {
                color: #856404;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">MrBikeModzGod</div>
                <h1 class="title">${content.title}</h1>
                <p class="subtitle">${content.subtitle}</p>
            </div>
            
            <div class="content">
                ${content.description}
                
                <div class="otp-container">
                    <div>Your Verification Code</div>
                    <div class="otp-code">${otp}</div>
                    <div>Enter this code to verify your account</div>
                </div>
                
                ${
                  userName ? `<p><strong>Account:</strong> ${userName}</p>` : ""
                }
            </div>
            
            <div class="footer">
                ${content.footer}
                
                <div class="warning">
                    <strong>Security Notice:</strong> Never share this code with anyone. MrBikeModzGod will never ask for this code via phone, email, or any other communication method.
                </div>
                
                <p>If you didn't request this verification, please ignore this email.</p>
                
                <p>Best regards,<br>The MrBikeModzGod Team</p>
            </div>
        </div>
    </body>
    </html>
  `;
};

export const sendOTPEmail = async ({
  to,
  otp,
  role,
  userName,
}: SendOTPEmailParams): Promise<boolean> => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"MrBikeModzGod" <${process.env.GMAIL_USER}>`,
      to: to,
      subject: `Account Verification - ${
        role === "retailer" ? "Retailer" : "Customer"
      } Registration`,
      html: generateOTPEmailHTML(otp, role, userName),
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("OTP email sent successfully:", result.messageId);
    return true;
  } catch (error) {
    console.error("Failed to send OTP email:", error);
    return false;
  }
};

export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
