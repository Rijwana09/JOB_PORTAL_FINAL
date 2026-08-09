const welcomeEmailTemplate = ({ name }) => {
  return {
    subject: "Welcome to Job Portal",

    text: `
Hello ${name},

Welcome to Job Portal.

Your account has been created successfully.

We're excited to have you with us.
`,

    html: `
<!DOCTYPE html>

<html>

<body style="font-family:Arial;background:#f5f5f5;padding:40px;">

<div style="max-width:600px;background:white;margin:auto;padding:40px;border-radius:10px;">

<h2 style="color:#2563eb;">
Welcome 🎉
</h2>

<p>Hello <strong>${name}</strong>,</p>

<p>
Your account has been created successfully.
</p>

<p>
Start exploring jobs, companies and opportunities.
</p>

</div>

</body>

</html>
`,
  };
};

export default welcomeEmailTemplate;