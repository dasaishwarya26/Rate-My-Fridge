import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Share,
  Image,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Result'>;
  route: RouteProp<RootStackParamList, 'Result'>;
};

function ScoreBar({ score }: { score: number }) {
  const color = score >= 7 ? '#4ade80' : score >= 4 ? '#facc15' : '#f87171';
  return (
    <View style={styles.scoreBarContainer}>
      <View style={styles.scoreBarTrack}>
        <View style={[styles.scoreBarFill, { width: `${score * 10}%`, backgroundColor: color }]} />
      </View>
      <Text style={[styles.scoreNumber, { color }]}>{score}/10</Text>
    </View>
  );
}

export default function ResultScreen({ navigation, route }: Props) {
  const { analysis, imageUri } = route.params;

  const handleShare = async () => {
    await Share.share({
      message: `My fridge scored ${analysis.score}/10 on Rate My Fridge!\n\nPersonality: ${analysis.personalityEmoji} ${analysis.personalityType}\n\n"${analysis.roast}"\n\nTry it yourself! 🧊`,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Fridge Thumbnail */}
        <Image source={{ uri: imageUri }} style={styles.thumbnail} />

        {/* Score */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>FRIDGE SCORE</Text>
          <ScoreBar score={analysis.score} />
        </View>

        {/* Personality */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>FRIDGE PERSONALITY</Text>
          <Text style={styles.personalityEmoji}>{analysis.personalityEmoji}</Text>
          <Text style={styles.personalityType}>{analysis.personalityType}</Text>
        </View>

        {/* Roast */}
        <View style={[styles.card, styles.roastCard]}>
          <Text style={styles.sectionLabel}>THE ROAST 🔥</Text>
          <Text style={styles.roastText}>"{analysis.roast}"</Text>
        </View>

        {/* Positives */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>SILVER LININGS ✨</Text>
          {analysis.positives.map((p, i) => (
            <Text key={i} style={styles.positiveItem}>✅  {p}</Text>
          ))}
        </View>

        {/* Recipes */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>YOU COULD MAKE 🍳</Text>
          {analysis.recipes.map((r, i) => (
            <View key={i} style={styles.recipeItem}>
              <Text style={styles.recipeName}>{r.name}</Text>
              <Text style={styles.recipeDesc}>{r.description}</Text>
            </View>
          ))}
        </View>

        {/* Action buttons */}
        <TouchableOpacity style={styles.shareButton} onPress={handleShare} activeOpacity={0.85}>
          <Text style={styles.shareButtonText}>📤  Share My Results</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => navigation.navigate('Camera')}
          activeOpacity={0.85}
        >
          <Text style={styles.retryButtonText}>🔄  Scan Another Fridge</Text>
        </TouchableOpacity>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  scroll: { padding: 20 },
  thumbnail: {
    width: '100%',
    height: 200,
    borderRadius: 20,
    marginBottom: 16,
    resizeMode: 'cover',
  },
  card: {
    backgroundColor: '#141414',
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
  },
  roastCard: { backgroundColor: '#1a0f00', borderWidth: 1, borderColor: '#f97316' },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#555',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  scoreBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  scoreBarTrack: {
    flex: 1,
    height: 12,
    backgroundColor: '#2a2a2a',
    borderRadius: 100,
    overflow: 'hidden',
  },
  scoreBarFill: { height: '100%', borderRadius: 100 },
  scoreNumber: { fontSize: 22, fontWeight: '800', width: 48, textAlign: 'right' },
  personalityEmoji: { fontSize: 48, textAlign: 'center', marginBottom: 8 },
  personalityType: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  roastText: {
    fontSize: 16,
    color: '#fdba74',
    lineHeight: 24,
    fontStyle: 'italic',
  },
  positiveItem: { fontSize: 15, color: '#ccc', marginBottom: 8, lineHeight: 22 },
  recipeItem: { marginBottom: 14 },
  recipeName: { fontSize: 16, fontWeight: '700', color: '#fff', marginBottom: 4 },
  recipeDesc: { fontSize: 14, color: '#888', lineHeight: 20 },
  shareButton: {
    backgroundColor: '#4ade80',
    paddingVertical: 18,
    borderRadius: 100,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#4ade80',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  shareButtonText: { color: '#0a0a0a', fontSize: 17, fontWeight: '700' },
  retryButton: {
    backgroundColor: '#1a1a1a',
    paddingVertical: 18,
    borderRadius: 100,
    alignItems: 'center',
  },
  retryButtonText: { color: '#fff', fontSize: 17, fontWeight: '600' },
});
