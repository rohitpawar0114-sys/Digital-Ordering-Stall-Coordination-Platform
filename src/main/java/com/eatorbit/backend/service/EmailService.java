package com.eatorbit.backend.service;

import com.eatorbit.backend.model.Order;
import com.eatorbit.backend.model.OrderItem;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Async
    public void sendOrderConfirmation(Order order) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(order.getCustomer().getEmail());
            helper.setSubject("Order Confirmation - " + order.getTokenNumber());

            String content = buildOrderReceiptHtml(order);
            helper.setText(content, true);

            mailSender.send(message);
            System.out.println("Email sent successfully to " + order.getCustomer().getEmail());
        } catch (MessagingException e) {
            System.err.println("Failed to send email: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private String buildOrderReceiptHtml(Order order) {
        StringBuilder sb = new StringBuilder();
        sb.append("<html><body>");
        sb.append(
                "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;'>");

        // Header
        sb.append(
                "<div style='text-align: center; border-bottom: 2px solid #ff7a00; padding-bottom: 20px; margin-bottom: 20px;'>");
        sb.append("<h2 style='color: #ff7a00; margin: 0;'>EatOrbit</h2>");
        sb.append("<p style='color: #666; margin: 5px 0;'>Order Confirmation</p>");
        sb.append("</div>");

        // Order Details
        sb.append("<p>Hi <strong>").append(order.getCustomer().getFullName()).append("</strong>,</p>");
        sb.append("<p>Your order has been placed successfully! Here is your receipt.</p>");

        sb.append("<div style='background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px;'>");
        sb.append("<p><strong>Order Token:</strong> <span style='font-size: 1.2em; color: #ff7a00;'>")
                .append(order.getTokenNumber()).append("</span></p>");
        sb.append("<p><strong>Outlet:</strong> ").append(order.getOutlet().getOutletName()).append("</p>");
        sb.append("<p><strong>Date:</strong> ").append(order.getCreatedAt()).append("</p>");
        sb.append("</div>");

        // Items Table
        sb.append("<table style='width: 100%; border-collapse: collapse; margin-bottom: 20px;'>");
        sb.append("<tr style='background-color: #eee;'>");
        sb.append("<th style='padding: 10px; text-align: left; border-bottom: 1px solid #ddd;'>Item</th>");
        sb.append("<th style='padding: 10px; text-align: center; border-bottom: 1px solid #ddd;'>Qty</th>");
        sb.append("<th style='padding: 10px; text-align: right; border-bottom: 1px solid #ddd;'>Price</th>");
        sb.append("</tr>");

        for (OrderItem item : order.getItems()) {
            sb.append("<tr>");
            sb.append("<td style='padding: 10px; border-bottom: 1px solid #eee;'>")
                    .append(item.getFood().getFoodName());
            if (item.getSelectedIngredients() != null && !item.getSelectedIngredients().isEmpty()) {
                sb.append("<br><small style='color: #888;'>").append(String.join(", ", item.getSelectedIngredients()))
                        .append("</small>");
            }
            sb.append("</td>");
            sb.append("<td style='padding: 10px; text-align: center; border-bottom: 1px solid #eee;'>")
                    .append(item.getQuantity()).append("</td>");
            sb.append("<td style='padding: 10px; text-align: right; border-bottom: 1px solid #eee;'>₹")
                    .append(item.getTotalPrice()).append("</td>");
            sb.append("</tr>");
        }

        sb.append("</table>");

        // Total
        sb.append("<div style='text-align: right; margin-top: 10px;'>");
        sb.append("<h3 style='margin: 0;'>Total Amount: ₹").append(order.getTotalAmount()).append("</h3>");
        sb.append("</div>");

        // Footer
        sb.append(
                "<div style='text-align: center; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px; color: #888; font-size: 12px;'>");
        sb.append("<p>Thank you for choosing EatOrbit!</p>");
        sb.append("</div>");

        sb.append("</div>");
        sb.append("</body></html>");
        return sb.toString();
    }
}
