export interface BookDefinition {
  title: string;
  description: string;
  sourceFile: string;
}

export interface VocabularyEntry {
  hiragana: string;
  kanji: string | null;
  meaning: string;
  lesson: number;
}
