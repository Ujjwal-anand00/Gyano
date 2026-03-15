const fs = require("fs");
const path = require("path");

const logo = fs.readFileSync(path.join(__dirname, "../assets/Gyano.png"));
const signature = fs.readFileSync(
  path.join(__dirname, "../assets/signature.png")
);

const logoBase64 = `data:image/png;base64,${logo.toString("base64")}`;
const signatureBase64 = `data:image/png;base64,${signature.toString("base64")}`;

const puppeteer = require("puppeteer");
const db = require("../database/db");
const QRCode = require("qrcode");

exports.generateCertificate = async (req, res) => {
  const studentId = req.user.id;
  const { courseId } = req.params;

  try {
    const student = db
      .prepare(
        `
      SELECT name FROM users WHERE id = ?
    `,
      )
      .get(studentId);

    const course = db
      .prepare(
        `
      SELECT title FROM courses WHERE id = ?
    `,
      )
      .get(courseId);

    const certificateId = `GY-${studentId}-${courseId}-${Date.now()}`;

    const date = new Date().toLocaleDateString();

    const verifyLink = `http://localhost:3000/verify/${certificateId}`;

    const qr = await QRCode.toDataURL(verifyLink);

    const html = `
<html>
<head>

<style>

body{
  font-family:'Georgia';
  background:#f4f6fb;
  display:flex;
  justify-content:center;
  align-items:center;
  height:100vh;
}

.certificate{

  width:1000px;
  padding:70px;
  border:12px solid #1e40af;
  border-radius:20px;
  background:white;
  text-align:center;
  position:relative;
  box-shadow:0 25px 50px rgba(0,0,0,0.15);

}

/* WATERMARK */

.certificate::before{
  content:"";
  background:url('${logoBase64}');
  background-size:320px;
  opacity:0.05;
  position:absolute;
  top:50%;
  left:50%;
  transform:translate(-50%,-50%);
  width:320px;
  height:320px;
}

/* LOGO */

.logo img{
  width:150px;
  margin-bottom:10px;
}

/* TITLE */

.subtitle{
  font-size:20px;
  margin-bottom:40px;
  color:#555;
}

/* STUDENT NAME */

.name{
  font-size:42px;
  font-weight:bold;
  margin:25px 0;
  color:#111;
}

/* COURSE */

.course{
  font-size:30px;
  color:#1e40af;
  margin:15px 0;
}

/* GOLD BADGE */

.badge{
  position:absolute;
  top:30px;
  right:30px;
  background:gold;
  padding:12px 18px;
  border-radius:50px;
  font-weight:bold;
}

/* FOOTER */

.footer{
  margin-top:60px;
  display:flex;
  justify-content:space-between;
  align-items:center;
}

.signature{
  text-align:center;
}

.signature img{
  width:180px;
}

.sign-name{
  font-size:14px;
  color:#555;
}

.qr img{
  width:100px;
}

.cert-id{
  font-size:12px;
  color:#777;
}

.date{
  margin-top:15px;
  font-size:14px;
}

</style>

</head>

<body>

<div class="certificate">

<div class="badge">Certified</div>

<div class="logo">
<img src="${logoBase64}" />
</div>

<div class="subtitle">Certificate of Completion</div>

<p>This certifies that</p>

<div class="name">${student.name}</div>

<p>has successfully completed the course</p>

<div class="course">${course.title}</div>

<div class="date">
Completed on ${date}
</div>

<div class="footer">

<div class="signature">

<img src="${signatureBase64}" />

<div class="sign-name">
Founder, Gyano
</div>

</div>

<div class="qr">

<img src="${qr}" />

<div class="cert-id">
ID: ${certificateId}
</div>

</div>

</div>

</div>

</body>
</html>
`;


    const browser = await puppeteer.launch();

    const page = await browser.newPage();

    await page.setContent(html);

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    await browser.close();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=gyano-certificate.pdf",
    });

    res.send(pdf);
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: "Certificate generation failed" });
  }
};
