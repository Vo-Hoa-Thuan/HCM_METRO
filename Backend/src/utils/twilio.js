const twilio = require("twilio");

const client = new twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

exports.sendSms = async (to, message) => {
    try {
        const response = await client.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER,
            to
        });
        console.log("✅ Tin nhắn đã gửi thành công!", response.sid);
    } catch (error) {
        console.error("❌ Gửi tin nhắn thất bại:", error);
        throw error; // Ném lỗi để server biết lỗi cụ thể
    }
};

