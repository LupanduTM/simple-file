import React, { useState, useMemo } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { modalStyles } from "../assets/styles/modal.styles";

const SelectionModal = ({ visible, data, title, onClose, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = useMemo(() => {
    if (!searchTerm) {
      return data;
    }
    return data.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  const handleSelect = (item) => {
    onSelect(item);
    onClose();
  };

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={modalStyles.modalContainer}>
        <View style={modalStyles.modalContent}>
          <Text style={modalStyles.modalTitle}>{title || "Select an item"}</Text>
          <TextInput
            style={modalStyles.searchInput}
            placeholder="Search..."
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
          <FlatList
            data={filteredData}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={modalStyles.stopItem}
                onPress={() => handleSelect(item)}
              >
                <Text style={modalStyles.stopText}>{item.name}</Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={<Text>No items found.</Text>}
          />
          <TouchableOpacity style={modalStyles.closeButton} onPress={onClose}>
            <Text style={modalStyles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default SelectionModal;
