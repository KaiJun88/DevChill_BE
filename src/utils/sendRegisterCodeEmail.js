import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendRegisterCodeEmail = async (toEmail, code) => {
  if (!toEmail) throw new Error("Không có email người nhận");

  try {
    const emailText = `
Xin chào ${toEmail},
Chào mừng bạn đến với DevChill 🎬
Mã xác thực của bạn là: ${code}
`;

    const emailHtml = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #eee;border-radius:10px;overflow:hidden">
      <div style="background:#1e90ff;color:#fff;padding:20px;text-align:center">
        <h1>DevChill 🎬</h1>
        <p>Welcome to DevChill</p>
      </div>
      <div style="padding:20px">
        <p>Xin chào <b>${toEmail}</b>,</p>
        <p>Cảm ơn bạn đã đăng ký tài khoản tại <b>DevChill</b>.</p>
        <p>Vui lòng nhập mã xác thực bên dưới để hoàn tất đăng ký:</p>
        <div style="text-align:center;margin:30px 0">
          <span style="display:inline-block;font-size:32px;letter-spacing:8px;font-weight:bold;color:#1e90ff;background:#f0f8ff;padding:15px 25px;border-radius:8px;">
            ${code}
          </span>
        </div>
        <p><b>⏳ Lưu ý:</b></p>
        <ul>
          <li>Mã sẽ hết hạn sau <b>5 phút</b>.</li>
          <li>Không chia sẻ mã này với bất kỳ ai.</li>
        </ul>
        <p style="margin-top:30px">Cảm ơn bạn,<br/><b>DevChill Team</b></p>
      </div>
    </div>
    `;

    const { data, error } = await resend.emails.send({
      from: `DevChill <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: "Mã xác thực đăng ký DevChill",
      text: emailText,
      html: emailHtml,
    });

    if (error) throw new Error(error.message);
    console.log(`Gửi OTP đến ${toEmail} thành công! ID:`, data?.id);
    return true;
  } catch (err) {
    console.error("Gửi email thất bại:", err);
    throw new Error("Không thể gửi email, kiểm tra lại Resend API");
  }
};
