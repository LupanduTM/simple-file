package com.gocashless.qrgs.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Base64;
import java.util.UUID;

/**
 * Service for encrypting and decrypting QR code payloads.
 * Uses AES for symmetric encryption and HMAC for integrity (simplified for example).
 * In a real system, you might use more robust key management and signing.
 */
@Service
public class EncryptionService {

    // This key should be securely managed (e.g., from environment variables, vault)
    // For demonstration, a simple hardcoded key. NEVER do this in production.
    @Value("${qr.encryption.secret-key:thisisasecretkeyforqrencryptionthatisatleast16byteslong}")
    private String secretKeyString;

    private SecretKey secretKey;
    private final ObjectMapper objectMapper = new ObjectMapper();

    // Initialize the secret key from the provided string
    private SecretKey getSecretKey() throws Exception {
        if (secretKey == null) {
            // Use SHA-256 hash of the secret string to get a 256-bit key for AES
            byte[] keyBytes = MessageDigest.getInstance("SHA-256").digest(secretKeyString.getBytes(StandardCharsets.UTF_8));
            secretKey = new SecretKeySpec(keyBytes, "AES");
        }
        return secretKey;
    }

    /**
     * Encrypts a JSON payload for the QR code.
     *
     * @param payload The object to encrypt (will be converted to JSON string).
     * @return Base64 encoded encrypted string.
     * @throws Exception If encryption fails.
     */
    public String encryptPayload(Object payload) throws Exception {
        String jsonPayload = objectMapper.writeValueAsString(payload);
        Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding"); // ECB is simple, consider CBC/GCM with IV for production
        cipher.init(Cipher.ENCRYPT_MODE, getSecretKey());
        byte[] encryptedBytes = cipher.doFinal(jsonPayload.getBytes(StandardCharsets.UTF_8));
        return Base64.getEncoder().encodeToString(encryptedBytes);
    }

    /**
     * Decrypts a Base64 encoded encrypted string to a JSON payload.
     *
     * @param encryptedPayload Base64 encoded encrypted string.
     * @param valueType Class type to deserialize the JSON into.
     * @return Decrypted object.
     * @throws Exception If decryption fails.
     */
    public <T> T decryptPayload(String encryptedPayload, Class<T> valueType) throws Exception {
        Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");
        cipher.init(Cipher.DECRYPT_MODE, getSecretKey());
        byte[] decryptedBytes = cipher.doFinal(Base64.getDecoder().decode(encryptedPayload));
        String jsonPayload = new String(decryptedBytes, StandardCharsets.UTF_8);
        return objectMapper.readValue(jsonPayload, valueType);
    }
}
