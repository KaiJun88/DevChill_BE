import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendLockEmail = async (toEmail, reason, lockUntil) => {
  if (!toEmail) throw new Error("Không có email người nhận");

  try {
    const unlockTime = new Date(lockUntil).toLocaleString("vi-VN");
    const emailText = `Tài khoản bị khóa. Lý do: ${reason}. Thời gian mở khóa: ${unlockTime}`;

    const emailHtml = `
      <h1>DevChill</h1>
      <p>Xin chào <b>${toEmail}</b>,</p>
      <p>Tài khoản của bạn đã bị <span style="color:red;"><b>KHÓA</b></span>.</p>
      <p><b>Lý do:</b></p>
      <p>${reason}</p>
      <p><b>Thời gian mở khóa:</b></p>
      <p style="color:#1e90ff;">${unlockTime}</p>
      <p>Trong thời gian này, bạn sẽ không thể sử dụng tài khoản.</p>
      <p>DevChill — tuandev</p>
    `;

    const { data, error } = await resend.emails.send({
      from: `DevChill <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: "Tài khoản của bạn đã bị khóa",
      text: emailText,
      html: emailHtml,
    });

    if (error) throw new Error(error.message);
    console.log(`Đã gửi email khóa tài khoản tới ${toEmail}`);
    return true;
  } catch (err) {
    console.error("Gửi email thất bại:", err);
    throw new Error("Không thể gửi email khóa tài khoản");
  }
};
