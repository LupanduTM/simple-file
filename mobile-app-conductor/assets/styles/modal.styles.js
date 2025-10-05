import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/colors";

export const modalStyles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 20,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  stopItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  stopText: {
    fontSize: 16,
    color: COLORS.text,
  },
  closeButton: {
    marginTop: 20,
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: "bold",
  },
});
