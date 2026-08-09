const forgotPasswordTemplate = ({ name, resetUrl }) => {
  return {
    subject: "Reset your Password",

    text: `
Hello ${name},

Click the link below to reset your password.

${resetUrl}

If you didn't request a password reset, ignore this email.
`,

    html: `
<!DOCTYPE html>
<html>

<body style="font-family:Arial;background:#f5f5f5;padding:40px;">

<div style="max-width:600px;background:white;margin:auto;padding:40px;border-radius:10px;">

<h2>Password Reset</h2>

<p>Hello <strong>${name}</strong>,</p>

<p>
We received a request to reset your password.
</p>

<p style="margin:30px 0;">

<a
href="${resetUrl}"
style="
background:#dc2626;
color:white;
padding:14px 28px;
border-radius:8px;
text-decoration:none;
display:inline-block;
">
Reset Password
</a>

</p>

<p>
If you didn't request this,
you can safely ignore this email.
</p>

</div>

</body>
</html>
`,
  };
};

export default forgotPasswordTemplate;