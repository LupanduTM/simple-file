
import { Ionicons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
} from "react-native";
import { homeStyles } from "../../assets/styles/home.styles";
import QrCodeModal from "../../components/QrCodeModal";
import SelectionModal from "../../components/SelectionModal";
import { COLORS } from "../../constants/colors";
import qrApiClient from "../../services/qrApiClient";
import routeApiClient from "../../services/routeApiClient";
import userApiClient from "../../services/userApiClient";

const HomeScreen = () => {
  
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [conductorProfile, setConductorProfile] = useState(null);

  const [stops, setStops] = useState([]);
  const [routes, setRoutes] = useState([]);

  const [selectionModalVisible, setSelectionModalVisible] = useState(false);
  const [qrModalVisible, setQrModalVisible] = useState(false);

  const [selectorType, setSelectorType] = useState(null);
  const [qrCodeImage, setQrCodeImage] = useState("");

  const [loading, setLoading] = useState(true);
  const [qrLoading, setQrLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [stopsResponse, routesResponse, profileResponse] = await Promise.all([
          routeApiClient.get("/api/v1/bus-stops"),
          routeApiClient.get("/api/v1/routes"),
          userApiClient.get("/api/v1/users/me"),
        ]);
        setStops(stopsResponse.data);
        setRoutes(routesResponse.data);
        setConductorProfile(profileResponse.data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch data. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleOpenSelectionModal = (type) => {
    setSelectorType(type);
    setSelectionModalVisible(true);
  };

  const handleSelect = (item) => {
    switch (selectorType) {
      case "route":
        setSelectedRoute(item);
        break;
      case "origin":
        setOrigin(item);
        break;
      case "destination":
        setDestination(item);
        break;
      default:
        break;
    }
    setSelectionModalVisible(false);
  };

  const handleSwap = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const handleClear = () => {
    setOrigin(null);
    setDestination(null);
    setSelectedRoute(null);
  };

  const handleGenerateQR = async () => {
    if (!selectedRoute || !origin || !destination) {
      Alert.alert("Missing Information", "Please select a route, origin, and destination.");
      return;
    }
    if (!conductorProfile) {
      Alert.alert("Error", "Could not verify conductor profile. Please restart the app.");
      return;
    }

    const qrRequest = {
      conductorId: conductorProfile.id,
      routeId: selectedRoute.id,
      originStopId: origin.id,
      destinationStopId: destination.id,
    };

    try {
      setQrLoading(true);
      setQrModalVisible(true);
      const response = await qrApiClient.post("/api/v1/qr/generate", qrRequest);
      setQrCodeImage(response.data.qrCodeImageBase64);
    } catch (err) {
      Alert.alert("QR Generation Failed", err.response?.data || "An unexpected error occurred.");
      setQrModalVisible(false);
      console.error(err);
    } finally {
      setQrLoading(false);
    }
  };

  return (
    <SafeAreaView style={homeStyles.container}>
      <ScrollView contentContainerStyle={homeStyles.content}>
        {/* Header */}
        <View style={homeStyles.header}>
          <Text style={homeStyles.title}>Welcome, {conductorProfile?.firstName || ""}</Text>
          <Text style={homeStyles.subtitle}>
            Generate a QR code for a new trip.
          </Text>
        </View>

        {/* Main Card */}
        <View style={homeStyles.card}>
          {loading ? (
            <ActivityIndicator size="large" color={COLORS.primary} />
          ) : error ? (
            <Text style={{ color: "red", textAlign: "center" }}>{error}</Text>
          ) : (
            <>
              <Text style={homeStyles.cardTitle}>Select Journey</Text>

              {/* Route Selector */}
              <TouchableOpacity
                style={[homeStyles.stopSelector, { marginBottom: 15 }]}
                onPress={() => handleOpenSelectionModal("route")}
              >
                <Ionicons name="bus-outline" size={24} color={COLORS.primary} />
                <Text style={homeStyles.stopText}>
                  {selectedRoute?.name || "Select Route"}
                </Text>
              </TouchableOpacity>

              <View style={homeStyles.routeContainer}>
                {/* Origin Selector */}
                <TouchableOpacity
                  style={homeStyles.stopSelector}
                  onPress={() => handleOpenSelectionModal("origin")}
                >
                  <Ionicons
                    name="radio-button-off"
                    size={24}
                    color={COLORS.primary}
                  />
                  <Text style={homeStyles.stopText}>{origin?.name || "Origin"}</Text>
                </TouchableOpacity>

                {/* Swap Button */}
                <TouchableOpacity style={homeStyles.swapButton} onPress={handleSwap}>
                  <Ionicons name="swap-vertical" size={24} color={COLORS.textLight} />
                </TouchableOpacity>

                {/* Destination Selector */}
                <TouchableOpacity
                  style={homeStyles.stopSelector}
                  onPress={() => handleOpenSelectionModal("destination")}
                >
                  <Ionicons
                    name="radio-button-on"
                    size={24}
                    color={COLORS.primary}
                  />
                  <Text style={homeStyles.stopText}>
                    {destination?.name || "Destination"}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Generate Button */}
              <TouchableOpacity
                style={homeStyles.generateButton}
                onPress={handleGenerateQR}
              >
                <Ionicons name="qr-code-outline" size={24} color={COLORS.white} />
                <Text style={homeStyles.generateButtonText}>Generate QR Code</Text>
              </TouchableOpacity>

              {/* Clear Button */}
              <TouchableOpacity
                style={homeStyles.clearButton}
                onPress={handleClear}
              >
                <Ionicons name="trash-outline" size={24} color={COLORS.text} />
                <Text style={homeStyles.clearButtonText}>Clear</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>

      <SelectionModal
        visible={selectionModalVisible}
        title={`Select ${selectorType}`}
        data={selectorType === "route" ? routes : stops}
        onClose={() => setSelectionModalVisible(false)}
        onSelect={handleSelect}
      />

      <QrCodeModal
        visible={qrModalVisible}
        loading={qrLoading}
        qrCodeImageBase64={qrCodeImage}
        onClose={() => setQrModalVisible(false)}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;