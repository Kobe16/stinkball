import { MatchScorePreview } from "app/components/MatchScorePreview";
import { PaginateWeek } from "app/components/PaginateWeek";
import React, { useState, useEffect } from "react";
import { ScrollView, Text, ViewStyle, View, TextStyle } from "react-native";
import { MatchScorePreviewType, MatchScorePreviewData } from "app/components/MatchScorePreviewTempData/MatchScorePreviewData";
import { typography } from "app/theme";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from "app/navigators/AppNavigator";

type MatchListNavigationProp = NativeStackNavigationProp<
  AppStackParamList,
  'MatchList'
>

export interface MatchListProps {
  navigation: MatchListNavigationProp;
}

const weeks: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

export const MatchListScreen = (props: MatchListProps) => {
  const [currentWeek, setCurrentWeek] = useState<number>(1);
  const [currentWeekData, setCurrentWeekData] = useState<MatchScorePreviewType[]>([]);

  useEffect(() => {
    // Fetch initial data when the component mounts
    const initialData = MatchScorePreviewData.filter(data => data.week === currentWeek);
    setCurrentWeekData(initialData);
  }, [currentWeek]);

  const handleWeekChange = (selectedWeek: number) => {
    // Update the current week only if it's different from the selected week
    if (currentWeek !== selectedWeek) {
      setCurrentWeek(selectedWeek);
      console.log("Selected Week:", selectedWeek);
    }
  };

  return (
    <ScrollView >
      <View style={$mainContainer}>
        <Text style={$title}>YOUR MATCHES</Text>
        <PaginateWeek weeks={weeks} onWeekChange={handleWeekChange} />
        {/* Map through each match that is part of the current week. */}
        {currentWeekData.map((data, index) => (
          <MatchScorePreview key={index} matchDetails={data} />
        ))}
      </View>
    </ScrollView>
  );
};

// Styling
const $mainContainer: ViewStyle = {
  backgroundColor: "#292929", 
  flex: 1, 
  flexDirection: "column",
  gap: 10,
  alignContent: "center",
  alignItems: "center",
  justifyContent: "flex-start",
  paddingTop: 60,
  paddingBottom: 60,
  minHeight: "100%",
}

const $title: TextStyle = {
  color: "white",
  fontSize: 24,
  fontFamily: typography.fonts.poppins.semiBold,
  alignSelf: "center"
}