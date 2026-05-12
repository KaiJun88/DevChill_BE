import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendSupportReplyEmail = async (
  toEmail,
  ticketCode,
  replyContent,
  statusUpdated,
) => {
  if (!toEmail) return;

  try {
    const statusMap = {
      open: "Đang chờ xử lý",
      in_progress: "Đang xử lý",
      resolved: "Đã giải quyết",
      closed: "Đã đóng",
    };
    const displayStatus = statusMap[statusUpdated] || statusUpdated;
    const statusColor =
      statusUpdated === "resolved"
        ? "#28a745"
        : statusUpdated === "in_progress"
          ? "#1e90ff"
          : "#6c757d";

    const emailHtml = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #eee;border-radius:10px;overflow:hidden;">
      <div style="background:#1e90ff;color:#fff;padding:25px 20px;text-align:center">
        <h1 style="margin:0;font-size:26px;">DevChill 🎬</h1>
      </div>
      <div style="padding:30px 25px;color:#333;line-height:1.6;">
        <p>Xin chào,</p>
        <p>Yêu cầu hỗ trợ mã <b>#${ticketCode}</b> của bạn vừa có cập nhật mới.</p>
        <p>Trạng thái hiện tại: <span style="display:inline-block; padding:5px 15px; border-radius:20px; font-size:13px; font-weight:bold; color:#fff; background-color:${statusColor};">${displayStatus}</span></p>
        <div style="background:#f0f8ff; border-left:5px solid #1e90ff; padding:20px; margin:25px 0; border-radius:4px 8px 8px 4px;">
          <p style="margin:0 0 10px 0; font-size:15px; color:#1e90ff;"><b>Phản hồi từ Ban Quản Trị:</b></p>
          <div style="font-size:15px; color:#2c3e50;">
            ${replyContent.replace(/\n/g, "<br/>")} 
          </div>
        </div>
        <p style="margin-top:35px;">Trân trọng,<br/><b style="color:#1e90ff;">Đội ngũ DevChill</b></p>
      </div>
    </div>
    `;

    const { data, error } = await resend.emails.send({
      from: `DevChill Support <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: `[DevChill] Cập nhật yêu cầu hỗ trợ #${ticketCode}`,
      html: emailHtml,
    });

    if (error) throw new Error(error.message);
    console.log(`[MAILER] Đã gửi phản hồi ticket ${ticketCode} tới ${toEmail}`);
    return true;
  } catch (err) {
    console.error("Gửi email hỗ trợ thất bại:", err);
  }
};
