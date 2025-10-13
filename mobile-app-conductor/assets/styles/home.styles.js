import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/colors";

export const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 40,
  },
  content: {
    padding: 20,
  },
  header: {
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
    padding: 20,
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
    marginBottom: 20,
  },
  routeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  stopSelector: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  stopText: {
    marginLeft: 10,
    fontSize: 16,
    color: COLORS.text,
  },
  swapButton: {
    padding: 10,
    marginHorizontal: 10,
  },
  generateButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 18,
    marginTop: 30,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  generateButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  clearButton: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    padding: 18,
    marginTop: 15,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  clearButtonText: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  input: {
    borderRadius: 12,
    padding: 18,
    fontSize: 16,
    color: COLORS.white,
    backgroundColor: COLORS.primary,
    width: '100%',
    marginBottom: 15,
    height: 55,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 10,
  },
});