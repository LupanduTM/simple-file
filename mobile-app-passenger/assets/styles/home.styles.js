import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/colors";

export const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 20,
    alignItems: "center",
  },
  header: {
    width: "100%",
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.text,
    fontFamily: "SpaceMono-Regular",
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textLight,
    marginTop: 5,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 30,
    width: "100%",
    alignItems: "center",
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 10,
  },
  cardSubtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: "center",
    marginBottom: 30,
  },
  scanButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 100, // Make it a circle
    width: 180,
    height: 180,
    justifyContent: "center",
    alignItems: "center",
  },
  scanButtonText: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: "bold",
  },
});