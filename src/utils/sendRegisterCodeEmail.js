import { Resend } from "resend";

// Khởi tạo Resend với API Key từ biến môi trường
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendRegisterCodeEmail = async (toEmail, code) => {
  if (!toEmail) throw new Error("Không có email người nhận");

  try {
    const emailText = `
Xin chào ${toEmail},

Chào mừng bạn đến với DevChill 🎬

Để hoàn tất quá trình đăng ký tài khoản, vui lòng sử dụng mã xác thực (OTP) bên dưới:

Mã xác thực của bạn là: ${code}

⏳ Lưu ý:
- Mã sẽ hết hạn sau 5 phút.
- Không chia sẻ mã này với bất kỳ ai.
- Nếu bạn không thực hiện đăng ký, hãy bỏ qua email này.

Cảm ơn bạn đã sử dụng DevChill!
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
          <span style="
            display:inline-block;
            font-size:32px;
            letter-spacing:8px;
            font-weight:bold;
            color:#1e90ff;
            background:#f0f8ff;
            padding:15px 25px;
            border-radius:8px;
          ">
            ${code}
          </span>
        </div>

        <p><b>⏳ Lưu ý:</b></p>
        <ul>
          <li>Mã sẽ hết hạn sau <b>5 phút</b>.</li>
          <li>Không chia sẻ mã này với bất kỳ ai.</li>
          <li>Nếu bạn không yêu cầu đăng ký, hãy bỏ qua email này.</li>
        </ul>

        <p>Nếu bạn cần hỗ trợ, vui lòng liên hệ với chúng tôi.</p>

        <p style="margin-top:30px">Cảm ơn bạn,<br/><b>DevChill Team</b></p>
      </div>

      <div style="background:#f5f5f5;padding:15px;text-align:center;font-size:12px;color:#777">
        © 2026 DevChill. All rights reserved.
      </div>

    </div>
    `;

    // Gọi API Resend để gửi mail
    const { data, error } = await resend.emails.send({
      from: "DevChill <onboarding@resend.dev>", // Bắt buộc dùng email này khi chưa có domain riêng
      to: toEmail,
      subject: "Mã xác thực đăng ký DevChill",
      text: emailText,
      html: emailHtml,
    });

    if (error) {
      console.error("Lỗi từ Resend API:", error);
      throw new Error(error.message);
    }

    console.log(`Gửi OTP đến ${toEmail} thành công! ID:`, data?.id);
    return true;
  } catch (err) {
    console.error("Gửi email thất bại:", err);
    throw new Error("Không thể gửi email, kiểm tra lại Resend API");
  }
};
