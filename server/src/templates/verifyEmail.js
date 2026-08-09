const verifyEmailTemplate = ({ name, verificationUrl }) => {
  return {
    subject: "Verify your Email",

    text: `
Hello ${name},

Welcome to Job Portal.

Please verify your email by visiting the link below:

${verificationUrl}

If you didn't create this account, you can safely ignore this email.
`,

    html: `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Email Verification</title>
</head>

<body style="font-family: Arial, sans-serif; background:#f5f5f5; padding:40px;">

<div style="max-width:600px;background:#ffffff;margin:auto;padding:40px;border-radius:10px;">

<h2 style="color:#2563eb;">
Welcome to Job Portal
</h2>

<p>Hello <strong>${name}</strong>,</p>

<p>
Thank you for creating your account.
</p>

<p>
Please verify your email address by clicking the button below.
</p>

<p style="margin:30px 0;">
<a
href="${verificationUrl}"
style="
background:#2563eb;
color:white;
padding:14px 28px;
text-decoration:none;
border-radius:8px;
display:inline-block;
">
Verify Email
</a>
</p>

<p>
If you did not create this account,
please ignore this email.
</p>

</div>

</body>
</html>
`,
  };
};

export default verifyEmailTemplate;