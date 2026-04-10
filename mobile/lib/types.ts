export interface Sense {
  definition: string;
  examples: string[];
  synonyms: string[];
}

export interface WordEntry {
  word: string;
  pos: string;
  senses: Sense[];
  score?: number;
}

export interface Bookmark {
  word: string;
  pos: string;
  definition: string;
}
