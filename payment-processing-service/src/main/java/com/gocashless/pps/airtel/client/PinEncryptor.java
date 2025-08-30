package com.gocashless.pps.airtel.client;

import java.nio.charset.StandardCharsets;
import java.security.KeyFactory;
import java.security.PublicKey;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;
import javax.crypto.Cipher;

/**
 * Utility class for encrypting the Airtel Money PIN using RSA PKCS1_v1_5 padding.
 * This corresponds to the 'Pin' class in the Python code.
 */
public class PinEncryptor {

    // Public key provided by Airtel for PIN encryption (Base64 encoded)
    private static final String PUBLIC_KEY_BASE64 = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCkq3XbDI1s8Lu7SpUBP+bqOs/MC6PKWz6n/0UkqTiOZqKqaoZClI3BUDTrSIJsrN1Qx7ivBzsaAYfsB0CygSSWay4iyUcnMVEDrNVOJwtWvHxpyWJC5RfKBrweW9b8klFa/CfKRtkK730apy0Kxjg+7fF0tB4O3Ic9Gxuv4pFkbQIDAQAB";

    /**
     * Encrypts the provided PIN using RSA with PKCS1_v1_5 padding.
     *
     * @param pin The raw PIN string to encrypt.
     * @return The Base64 encoded encrypted PIN.
     * @throws Exception If an error occurs during key decoding or encryption.
     */
    public static String genPin(String pin) throws Exception {
        // Decode the Base64 public key
        byte[] keyBytes = Base64.getDecoder().decode(PUBLIC_KEY_BASE64);

        // Create X509EncodedKeySpec for the public key
        X509EncodedKeySpec keySpec = new X509EncodedKeySpec(keyBytes);
        KeyFactory keyFactory = KeyFactory.getInstance("RSA");
        PublicKey publicKey = keyFactory.generatePublic(keySpec);

        // Initialize Cipher for RSA encryption with PKCS1_v1_5 padding
        Cipher cipher = Cipher.getInstance("RSA/ECB/PKCS1Padding"); // PKCS1Padding corresponds to PKCS1_v1_5
        cipher.init(Cipher.ENCRYPT_MODE, publicKey);

        // Encrypt the PIN
        byte[] encryptedBytes = cipher.doFinal(pin.getBytes(StandardCharsets.UTF_8));

        // Base64 encode the encrypted bytes
        return Base64.getEncoder().encodeToString(encryptedBytes);
    }
}