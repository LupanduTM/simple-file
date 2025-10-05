import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { modalStyles } from "../assets/styles/modal.styles";
import { COLORS } from "../constants/colors";

const QrCodeModal = ({ visible, qrCodeImageBase64, onClose, loading }) => {
  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={modalStyles.modalContainer}>
        <View style={modalStyles.modalContent}>
          <Text style={modalStyles.modalTitle}>Scan QR Code</Text>
          {loading ? (
            <ActivityIndicator size="large" color={COLORS.primary} />
          ) : (
            <Image
              style={{ width: 250, height: 250, alignSelf: "center" }}
              source={{ uri: `data:image/png;base64,${qrCodeImageBase64}` }}
            />
          )}
          <TouchableOpacity style={modalStyles.closeButton} onPress={onClose}>
            <Text style={modalStyles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default QrCodeModal;
