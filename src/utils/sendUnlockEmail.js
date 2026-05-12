import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendUnlockEmail = async (toEmail) => {
  if (!toEmail) throw new Error("Không có email người nhận");

  try {
    const emailText = `Tài khoản của bạn trên DevChill đã được mở khóa.`;

    const emailHtml = `
      <h1>DevChill</h1>
      <p>Xin chào <b>${toEmail}</b>,</p>
      <p>Tài khoản của bạn đã được <span style="color:green;"><b>MỞ KHÓA</b></span>.</p>
      <p>Bạn có thể đăng nhập và sử dụng lại hệ thống.</p>
      <hr/>
      <p style="color:#ff6600;"><b>Lưu ý quan trọng:</b></p>
      <p>Vui lòng tuân thủ các quy định và tiêu chuẩn cộng đồng của DevChill.</p>
      <p>DevChill — tuandev</p>
    `;

    const { data, error } = await resend.emails.send({
      from: `DevChill <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: "Tài khoản của bạn đã được mở khóa",
      text: emailText,
      html: emailHtml,
    });

    if (error) throw new Error(error.message);
    console.log(`Đã gửi email mở khóa tới ${toEmail}`);
    return true;
  } catch (err) {
    console.error("Gửi email unlock thất bại:", err);
    throw new Error("Không thể gửi email mở khóa");
  }
};
