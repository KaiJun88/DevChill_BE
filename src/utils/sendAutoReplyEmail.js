import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendAutoReplyEmail = async (
  toEmail,
  ticketCode,
  category,
  isGuest = false,
) => {
  if (!toEmail) return;

  try {
    const guestNotice = isGuest
      ? `<div style="background:#fff8e1; border-left:4px solid #ffc107; padding:15px; margin:25px 0; border-radius:4px 8px 8px 4px;">
          <p style="margin:0; font-size:14px; color:#856404;">💡 <b>Lưu ý dành cho khách:</b><br/>Lưu lại mã vé <b>#${ticketCode}</b> để tra cứu tiến độ nhé.</p>
         </div>`
      : "";

    const emailHtml = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #eee;border-radius:10px;overflow:hidden;">
        <div style="background:#1e90ff;color:#fff;padding:25px 20px;text-align:center">
          <h1 style="margin:0;font-size:26px;">DevChill 🎬</h1>
          <p style="margin:8px 0 0 0;font-size:15px;opacity:0.9;">Trung Tâm Hỗ Trợ Khách Hàng</p>
        </div>
        <div style="padding:30px 25px;color:#333;line-height:1.6;">
          <p>Xin chào,</p>
          <p>Hệ thống đã tiếp nhận yêu cầu hỗ trợ của bạn với chủ đề: <b>${category}</b>.</p>
          <div style="text-align:center;margin:35px 0">
            <p style="margin:0 0 10px 0; color:#666;">Mã yêu cầu của bạn là:</p>
            <span style="display:inline-block;font-size:28px;letter-spacing:3px;font-weight:bold;color:#1e90ff;background:#f0f8ff;padding:15px 30px;border-radius:8px;border:1px dashed #1e90ff;">
              ${ticketCode}
            </span>
          </div>
          <p><b>⏳ Tiến trình xử lý:</b> Phản hồi sớm nhất trong vòng 12-24h làm việc.</p>
          ${guestNotice}
          <p style="margin-top:35px;">Trân trọng,<br/><b style="color:#1e90ff;">Đội ngũ DevChill</b></p>
        </div>
      </div>
    `;

    const { data, error } = await resend.emails.send({
      from: `DevChill Support <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: `[DevChill] Tiếp nhận yêu cầu hỗ trợ #${ticketCode}`,
      html: emailHtml,
    });

    if (error) throw new Error(error.message);
    console.log(
      `[MAILER] Đã gửi thông báo tạo vé ${ticketCode} tới ${toEmail}`,
    );
    return true;
  } catch (err) {
    console.error("Lỗi gửi mail tạo vé:", err);
  }
};
