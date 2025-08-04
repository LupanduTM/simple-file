package com.gocashless.qrgs.util;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Component
public class QrCodeGenerator {

    @Value("${qrcode.width:300}")
    private int qrCodeWidth;

    @Value("${qrcode.height:300}")
    private int qrCodeHeight;

    @Value("${qrcode.format:PNG}")
    private String qrCodeImageFormat; // e.g., PNG, JPG

    @Value("${qrcode.charset:UTF-8}")
    private String qrCodeCharset;

    /**
     * Generates a QR code image as a Base64 encoded string.
     *
     * @param text The data to encode in the QR code.
     * @return Base64 encoded string of the QR code image (PNG format).
     * @throws WriterException If an error occurs during QR code generation.
     * @throws IOException If an I/O error occurs during image writing.
     */
    public String generateQrCodeImageBase64(String text) throws WriterException, IOException {
        Map<EncodeHintType, Object> hints = new HashMap<>();
        hints.put(EncodeHintType.CHARACTER_SET, qrCodeCharset);
        hints.put(EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.H); // High error correction
        hints.put(EncodeHintType.MARGIN, 1); // Less margin

        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        BitMatrix bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, qrCodeWidth, qrCodeHeight, hints);

        ByteArrayOutputStream pngOutputStream = new ByteArrayOutputStream();
        MatrixToImageWriter.writeToStream(bitMatrix, qrCodeImageFormat, pngOutputStream);
        byte[] pngData = pngOutputStream.toByteArray();

        return Base64.getEncoder().encodeToString(pngData);
    }
}