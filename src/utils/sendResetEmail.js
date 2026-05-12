import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendResetEmail = async (toEmail, token) => {
  if (!toEmail) throw new Error("Không có email người nhận");

  try {
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    const emailText = `Xin chào ${toEmail},\nNhấp vào link để thiết lập lại mật khẩu: ${resetLink}`;

    const emailHtml = `
    <h1>DevChill</h1>
    <p>Xin chào ${toEmail},</p>
    <p>Chúng tôi nhận được yêu cầu thiết lập lại mật khẩu cho tài khoản của bạn trên <b>DevChill</b>.</p>
    <p>Nếu bạn đã yêu cầu, vui lòng nhấp vào liên kết bên dưới để thiết lập lại mật khẩu:</p>
    <p><a href="${resetLink}" style="display:inline-block;padding:10px 20px;background:#1e90ff;color:#fff;text-decoration:none;border-radius:5px;">Thiết lập lại mật khẩu</a></p>
    <p>Lưu ý:</p>
    <ul>
    <li>Liên kết sẽ hết hạn sau 5 phút kể từ thời điểm yêu cầu.</li>
    <li>Nếu bạn không yêu cầu, vui lòng bỏ qua email này.</li>
    </ul>
    <p>Cảm ơn bạn đã sử dụng DevChill!</p>
    <p>DevChill — Bản quyền nội dung thuộc về tuandev</p>
    `;

    const { data, error } = await resend.emails.send({
      from: `DevChill <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: "Thiết lập lại mật khẩu DevChill",
      text: emailText,
      html: emailHtml,
    });

    if (error) throw new Error(error.message);
    console.log(`Email gửi đến ${toEmail} thành công`);
    return true;
  } catch (err) {
    console.error("Gửi email thất bại:", err);
    throw new Error("Không thể gửi email, kiểm tra cấu hình SMTP/Resend");
  }
};
